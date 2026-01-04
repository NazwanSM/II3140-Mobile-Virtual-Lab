import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../supabase/client';

WebBrowser.maybeCompleteAuthSession();

const redirectTo = AuthSession.makeRedirectUri({
    scheme: 'aksara',
    path: 'auth/callback',
});

export async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
            skipBrowserRedirect: true,
        },
        });

        if (error) {
        console.error('Error signing in with Google:', error);
        return { error: error.message };
        }

        if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectTo
        );

        if (result.type === 'success') {
            const url = result.url;
            const params = new URL(url).hash.substring(1);
            const urlParams = new URLSearchParams(params);
            
            const accessToken = urlParams.get('access_token');
            const refreshToken = urlParams.get('refresh_token');

            if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (sessionError) {
                return { error: sessionError.message };
            }

            return { success: true, user: sessionData.user };
            }
        }

        return { error: 'Authentication cancelled' };
        }

        return { error: 'No auth URL returned' };
    } catch (error) {
        console.error('Error in signInWithGoogle:', error);
        return { error: 'Failed to sign in with Google' };
    }
}

export async function signInWithEmail(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        if (error) {
        return { error: error.message };
        }

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Error signing in with email:', error);
        return { error: 'Failed to sign in' };
    }
}

export async function signInWithUsername(username: string, password: string) {
    try {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
        
        let emailToUse = username;
        
        if (!isEmail) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', username)
            .single();
        
        if (profileError || !profile) {
            return { error: 'Username atau password salah' };
        }
        
        emailToUse = profile.email;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
        });

        if (error) {
        return { error: 'Username atau password salah' };
        }

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Error signing in:', error);
        return { error: 'Gagal masuk. Silakan coba lagi.' };
    }
}

export async function signUpWithEmail(
    email: string,
    password: string,
    fullName: string,
    username?: string,
    institution?: string
) {
    try {
        if (username) {
        const { data: existingUsername } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUsername) {
            return { error: 'Username sudah digunakan' };
        }
        }

        const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
            full_name: fullName,
            username: username || null,
            institution: institution || null,
            },
        },
        });

        if (error) {
        return { error: error.message };
        }

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Error signing up:', error);
        return { error: 'Failed to sign up' };
    }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    try {    
        if (error) {
            return { error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { error: 'Failed to sign out' };
    }
}

export async function getUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
        return null;
        }

        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

export async function getProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
        return null;
        }

        const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

        if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
        }

        if (profile) {
        return profile;
        }

        console.log('Profile not found, creating new profile for user:', user.id);
        const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            username: user.user_metadata?.username || null,
            institution: user.user_metadata?.institution || null,
            tinta: 0
        })
        .select()
        .single();

        if (insertError) {
        if (insertError.code === '23505') {
            console.log('Profile already exists, fetching again...');
            const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
            return existingProfile;
        }
        
        console.error('Error creating profile:', insertError);
        return null;
        }

        return newProfile;

    } catch (error) {
        console.error('Error getting profile:', error);
        return null;
    }
}

export async function getSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
        return null;
        }

        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

export async function resetPassword(emailOrUsername: string, newPassword: string) {
    try {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername);
        
        let emailToUse = emailOrUsername;
        
        if (!isEmail) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('username', emailOrUsername)
                .single();
            
            if (profileError || !profile) {
                return { error: 'Email atau username tidak ditemukan' };
            }
            
            emailToUse = profile.email;
        } else {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', emailOrUsername)
                .single();
            
            if (profileError || !profile) {
                return { error: 'Email tidak ditemukan' };
            }
        }

        const { error } = await supabase.rpc('reset_user_password', {
            user_email: emailToUse,
            new_password: newPassword
        });

        if (error) {
            return { error: 'Gagal mereset password. ' + error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error resetting password:', error);
        return { error: 'Gagal mereset password' };
    }
}

export async function updatePassword(newPassword: string) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            return { error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating password:', error);
        return { error: 'Gagal memperbarui password' };
    }
}