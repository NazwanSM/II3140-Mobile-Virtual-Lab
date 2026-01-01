import { supabase } from '../supabase/client';

interface SubmitQuizResult {
  success: boolean;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  tintaEarned?: number;
  error?: string;
}

interface ExistingProgress {
  progress: number;
  modul_viewed: boolean;
  video_viewed: boolean;
  mudah_completed: boolean;
  sedang_completed: boolean;
  sulit_completed: boolean;
  completed: boolean;
  [key: string]: boolean | number;
}

interface Profile {
  tinta: number;
}

interface Question {
  question_number: number;
  correct_answer: string;
}

export async function submitQuiz(
  moduleId: string,
  difficulty: string,
  answers: Record<number, string>,
  questions: Question[]
): Promise<SubmitQuizResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, correctAnswers: 0, wrongAnswers: 0, score: 0, error: 'User not authenticated' };
    }

    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        correctAnswers++;
      }
    });

    const wrongAnswers = questions.length - correctAnswers;
    const score = Math.round((correctAnswers / questions.length) * 100);

    const { data: existingResult } = await supabase
      .from('quiz_results')
      .select('id, score')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .eq('difficulty', difficulty)
      .maybeSingle();

    if (existingResult) {
      const { data: updatedData, error: updateError } = await supabase
        .from('quiz_results')
        .update({
          score: score,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          total_questions: questions.length,
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .eq('difficulty', difficulty)
        .select();

      if (updateError) {
        console.error('Error updating quiz result:', updateError);
      } else {
        console.log('Quiz result updated successfully:', updatedData);
      }
    } else {
      const { error: insertError } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          difficulty: difficulty,
          score: score,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          total_questions: questions.length,
          completed_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error inserting quiz result:', insertError);
      }
    }

    const tintaPerQuestion: Record<string, number> = {
      'mudah': 100,
      'sedang': 150,
      'sulit': 200,
    };

    const tintaReward = correctAnswers * (tintaPerQuestion[difficulty] || 100);

    const { data: existingProgress } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (existingProgress) {
      const progress = existingProgress as unknown as ExistingProgress;
      const quizCompleted = progress[`${difficulty}_completed`] as boolean || false;

      if (!quizCompleted && score >= 60) {
        const modulViewed = progress.modul_viewed as boolean || false;
        const videoViewed = progress.video_viewed as boolean || false;
        const mudahCompleted = difficulty === 'mudah' ? true : (progress.mudah_completed as boolean || false);
        const sedangCompleted = difficulty === 'sedang' ? true : (progress.sedang_completed as boolean || false);
        const sulitCompleted = difficulty === 'sulit' ? true : (progress.sulit_completed as boolean || false);

        const newProgress = 
          (modulViewed ? 20 : 0) +
          (videoViewed ? 20 : 0) +
          (mudahCompleted ? 20 : 0) +
          (sedangCompleted ? 20 : 0) +
          (sulitCompleted ? 20 : 0);

        const { error: updateError } = await supabase
          .from('learning_progress')
          .update({
            progress: newProgress,
            [`${difficulty}_completed`]: true,
            completed: newProgress >= 100,
          })
          .eq('user_id', user.id)
          .eq('module_id', moduleId);

        if (updateError) {
          console.error('Error updating learning progress:', updateError);
        }
      }
    } else {
      const { error: insertError } = await supabase
        .from('learning_progress')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          progress: score >= 60 ? 20 : 0,
          modul_viewed: false,
          video_viewed: false,
          mudah_completed: difficulty === 'mudah' && score >= 60,
          sedang_completed: difficulty === 'sedang' && score >= 60,
          sulit_completed: difficulty === 'sulit' && score >= 60,
          completed: false,
        });

      if (insertError) {
        console.error('Error inserting learning progress:', insertError);
      }
    }

    if (correctAnswers > 0) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('tinta')
        .eq('id', user.id)
        .single();

      if (profile) {
        const profileData = profile as unknown as Profile;
        const currentTinta = profileData.tinta || 0;
        await supabase
          .from('profiles')
          .update({ tinta: currentTinta + tintaReward })
          .eq('id', user.id);
      }
    }

    return { success: true, correctAnswers, wrongAnswers, score, tintaEarned: tintaReward };
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return { success: false, correctAnswers: 0, wrongAnswers: 0, score: 0, error: 'Failed to submit quiz' };
  }
}

export async function getQuizQuestions(moduleId: string, difficulty: string) {
  try {
    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('module_id', moduleId)
      .eq('difficulty', difficulty)
      .order('question_number', { ascending: true });

    if (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }

    return questions || [];
  } catch (error) {
    console.error('Error getting quiz questions:', error);
    return [];
  }
}

export async function getQuizResults(moduleId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: results, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId);

    if (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }

    return results || [];
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return [];
  }
}

export async function getAllQuizResults() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: results, error } = await supabase
      .from('quiz_results')
      .select(`
        *,
        module:modules(id, title, module_number)
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching all quiz results:', error);
      return [];
    }

    return results || [];
  } catch (error) {
    console.error('Error getting all quiz results:', error);
    return [];
  }
}
