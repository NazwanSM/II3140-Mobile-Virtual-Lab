import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const isClient = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: isClient ? AsyncStorage : undefined,
        autoRefreshToken: isClient,
        persistSession: isClient,
        detectSessionInUrl: Platform.OS === 'web' && isClient,
    },
});
