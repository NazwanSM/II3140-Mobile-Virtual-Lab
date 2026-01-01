import { supabase } from '../supabase/client';

interface ExistingProgress {
  progress: number;
  modul_viewed: boolean;
  video_viewed: boolean;
  mudah_completed: boolean;
  sedang_completed: boolean;
  sulit_completed: boolean;
  completed: boolean;
}

interface Profile {
  tinta: number;
}

export async function updateModuleProgress(moduleId: string, progressType: 'modul' | 'video') {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'User not authenticated' };
    }

    const { data: existingProgress } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .single();

    let shouldAddTinta = false;

    if (existingProgress) {
      const progress = existingProgress as unknown as ExistingProgress;
      let shouldUpdate = false;
      let newModulViewed = progress.modul_viewed || false;
      let newVideoViewed = progress.video_viewed || false;

      if (progressType === 'modul' && !progress.modul_viewed) {
        newModulViewed = true;
        shouldAddTinta = true;
        shouldUpdate = true;
      } else if (progressType === 'video' && !progress.video_viewed) {
        newVideoViewed = true;
        shouldAddTinta = true;
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        const newProgress = 
          (newModulViewed ? 20 : 0) +
          (newVideoViewed ? 20 : 0) +
          (progress.mudah_completed ? 20 : 0) +
          (progress.sedang_completed ? 20 : 0) +
          (progress.sulit_completed ? 20 : 0);

        await supabase
          .from('learning_progress')
          .update({
            progress: newProgress,
            modul_viewed: newModulViewed,
            video_viewed: newVideoViewed,
            completed: newProgress >= 100,
          })
          .eq('user_id', user.id)
          .eq('module_id', moduleId);
      }
    } else {
      const initialProgress = 20;
      shouldAddTinta = true;

      await supabase
        .from('learning_progress')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          progress: initialProgress,
          modul_viewed: progressType === 'modul',
          video_viewed: progressType === 'video',
          mudah_completed: false,
          sedang_completed: false,
          sulit_completed: false,
          completed: false,
        });
    }

    if (shouldAddTinta) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('tinta')
        .eq('id', user.id)
        .single();

      if (profile && (progressType === 'modul')) {
        const profileData = profile as unknown as Profile;
        const currentTinta = profileData.tinta || 0;
        await supabase
          .from('profiles')
          .update({ tinta: currentTinta + 500 })
          .eq('id', user.id);
      }

      else if (profile && (progressType === 'video')) {
        const profileData = profile as unknown as Profile;
        const currentTinta = profileData.tinta || 0;
        await supabase
          .from('profiles')
          .update({ tinta: currentTinta + 750 })
          .eq('id', user.id);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating module progress:', error);
    return { error: 'Failed to update progress' };
  }
}

export async function updateGameProgress(gameId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'User not authenticated' };
    }

    const { data: existingRecord } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('game_id', gameId)
      .single();

    if (existingRecord) {
      return { error: 'Already completed', success: false };
    }

    await supabase
      .from('game_progress')
      .insert({
        user_id: user.id,
        game_id: gameId,
        completed: true,
      });

    const { data: profile } = await supabase
      .from('profiles')
      .select('tinta')
      .eq('id', user.id)
      .single();

    if (profile && gameId == 'tts') {
      const profileData = profile as unknown as Profile;
      const currentTinta = profileData.tinta || 0;
      await supabase
        .from('profiles')
        .update({ tinta: currentTinta + 6000 })
        .eq('id', user.id);
    }

    else if (profile && gameId == 'dragdrop') {
      const profileData = profile as unknown as Profile;
      const currentTinta = profileData.tinta || 0;
      await supabase
        .from('profiles')
        .update({ tinta: currentTinta + 9000 })
        .eq('id', user.id);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating game progress:', error);
    return { error: 'Failed to update progress', success: false };
  }
}

export async function getModuleProgress(moduleId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: progress, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching module progress:', error);
      return null;
    }

    return progress;
  } catch (error) {
    console.error('Error getting module progress:', error);
    return null;
  }
}

export async function getAllProgress() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: progress, error } = await supabase
      .from('learning_progress')
      .select(`
        *,
        module:modules(*)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching all progress:', error);
      return [];
    }

    return progress || [];
  } catch (error) {
    console.error('Error getting all progress:', error);
    return [];
  }
}

export async function getRecentProgress(limit: number = 5) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: progress, error } = await supabase
      .from('learning_progress')
      .select(`
        *,
        module:modules(id, title, slug)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent progress:', error);
      return [];
    }

    return progress || [];
  } catch (error) {
    console.error('Error getting recent progress:', error);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        belajar: { completed: 0, total: 3 },
        latihan: { completed: 0, total: 3 },
        bermain: { completed: 0, total: 2 },
      };
    }

    const { data: learningProgress } = await supabase
      .from('learning_progress')
      .select('modul_viewed, video_viewed, mudah_completed, sedang_completed, sulit_completed')
      .eq('user_id', user.id);

    const belajarCompleted = learningProgress?.filter(
      (p) => p.modul_viewed && p.video_viewed
    ).length || 0;

    const latihanCompleted = learningProgress?.filter(
      (p) => p.mudah_completed && p.sedang_completed && p.sulit_completed
    ).length || 0;

    const { data: gameProgress } = await supabase
      .from('game_progress')
      .select('game_id, completed')
      .eq('user_id', user.id)
      .eq('completed', true);

    const completedGames = gameProgress?.filter(
      (g) => g.game_id === 'tts' || g.game_id === 'dragdrop'
    ).length || 0;

    return {
      belajar: { completed: Math.min(belajarCompleted, 3), total: 3 },
      latihan: { completed: Math.min(latihanCompleted, 3), total: 3 },
      bermain: { completed: Math.min(completedGames, 2), total: 2 },
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      belajar: { completed: 0, total: 3 },
      latihan: { completed: 0, total: 3 },
      bermain: { completed: 0, total: 2 },
    };
  }
}
