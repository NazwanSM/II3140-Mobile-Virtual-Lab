import { supabase } from '../supabase/client';

export async function getModules() {
  try {
    const { data: modules, error } = await supabase
      .from('modules')
      .select('*')
      .order('module_number', { ascending: true });

    if (error) {
      console.error('Error fetching modules:', error);
      return [];
    }

    return modules || [];
  } catch (error) {
    console.error('Error getting modules:', error);
    return [];
  }
}

export async function getModuleById(moduleId: string) {
  try {
    const { data: module, error } = await supabase
      .from('modules')
      .select('*')
      .eq('id', moduleId)
      .single();

    if (error) {
      console.error('Error fetching module:', error);
      return null;
    }

    return module;
  } catch (error) {
    console.error('Error getting module:', error);
    return null;
  }
}

export async function getModuleBySlug(slug: string) {
  try {
    const { data: module, error } = await supabase
      .from('modules')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching module by slug:', error);
      return null;
    }

    return module;
  } catch (error) {
    console.error('Error getting module by slug:', error);
    return null;
  }
}

export async function getModulesWithProgress() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .order('order', { ascending: true });

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return [];
    }

    if (!user) {
      return modules?.map(m => ({ ...m, progress: 0 })) || [];
    }

    const { data: progress, error: progressError } = await supabase
      .from('learning_progress')
      .select('module_id, progress')
      .eq('user_id', user.id);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return modules?.map(m => ({ ...m, progress: 0 })) || [];
    }

    const progressMap = new Map(progress?.map(p => [p.module_id, p.progress]) || []);

    return modules?.map(m => ({
      ...m,
      progress: progressMap.get(m.id) || 0,
    })) || [];
  } catch (error) {
    console.error('Error getting modules with progress:', error);
    return [];
  }
}

export async function getModuleContent(moduleId: string) {
  try {
    const { data: content, error } = await supabase
      .from('module_contents')
      .select('*')
      .eq('module_id', moduleId)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching module content:', error);
      return [];
    }

    return content || [];
  } catch (error) {
    console.error('Error getting module content:', error);
    return [];
  }
}
