import { supabase } from '../supabase/client';

interface ExistingProgress {
  progress: number;
  modul_viewed: boolean;
  video_viewed: boolean;
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
      const currentProgress = progress.progress || 0;
      let newProgress = currentProgress;

      if (progressType === 'modul' && !progress.modul_viewed) {
        newProgress += 20;
        shouldAddTinta = true;

        await supabase
          .from('learning_progress')
          .update({
            progress: newProgress,
            modul_viewed: true,
            completed: newProgress >= 100,
          })
          .eq('user_id', user.id)
          .eq('module_id', moduleId);
      } else if (progressType === 'video' && !progress.video_viewed) {
        newProgress += 20;
        shouldAddTinta = true;

        await supabase
          .from('learning_progress')
          .update({
            progress: newProgress,
            video_viewed: true,
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
          completed: false,
        });
    }

    if (shouldAddTinta) {
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
          .update({ tinta: currentTinta + 500 })
          .eq('id', user.id);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating module progress:', error);
    return { error: 'Failed to update progress' };
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
