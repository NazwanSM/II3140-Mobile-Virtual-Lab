import { supabase } from '../supabase/client';

interface Artwork {
    required_tinta: number;
}

interface Profile {
    tinta: number;
}

interface UserArtwork {
    id: string;
}

export async function selectArtwork(artworkId: string) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
        return { error: 'User not authenticated' };
        }

        const { data: artwork } = await supabase
        .from('artworks')
        .select('required_tinta')
        .eq('id', artworkId)
        .single() as { data: Artwork | null };

        if (!artwork) {
        return { error: 'Artwork not found' };
        }

        const { data: profile } = await supabase
        .from('profiles')
        .select('tinta')
        .eq('id', user.id)
        .single() as { data: Profile | null };

        if (!profile) {
        return { error: 'Profile not found' };
        }

        if (profile.tinta < artwork.required_tinta) {
        return { error: 'Insufficient tinta' };
        }

        const { data: existingUnlock } = await supabase
        .from('user_artworks')
        .select('id')
        .eq('user_id', user.id)
        .eq('artwork_id', artworkId)
        .single() as { data: UserArtwork | null };

        if (!existingUnlock) {
        const { error: unlockError } = await supabase
            .from('user_artworks')
            .insert({
            user_id: user.id,
            artwork_id: artworkId,
            is_active: false,
            });

        if (unlockError) {
            return { error: 'Failed to unlock artwork' };
        }
        }

        await supabase
        .from('user_artworks')
        .update({ is_active: false })
        .eq('user_id', user.id);

        await supabase
        .from('user_artworks')
        .update({ is_active: true })
        .eq('user_id', user.id)
        .eq('artwork_id', artworkId);

        return { success: true };
    } catch (error) {
        console.error('Error selecting artwork:', error);
        return { error: 'Failed to select artwork' };
    }
}

export async function updateProfile(data: { 
    full_name?: string; 
    username?: string; 
    institution?: string;
    avatar_url?: string;
}) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
        return { error: 'User not authenticated' };
        }

        if (data.username) {
        const { data: existingUsername } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('username', data.username)
            .single();

        if (existingUsername && existingUsername.id !== user.id) {
            return { error: 'Username sudah digunakan' };
        }
        }

        const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

        if (error) {
        return { error: 'Failed to update profile' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { error: 'Failed to update profile' };
    }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
        return { success: false, error: 'User not authenticated' };
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
        });

        if (signInError) {
        return { success: false, error: 'Password lama salah' };
        }

        const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
        });

        if (updateError) {
        return { success: false, error: 'Gagal mengubah password' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating password:', error);
        return { success: false, error: 'Failed to update password' };
    }
}

export async function getTintaBalance() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
        return null;
        }

        const { data: profile } = await supabase
        .from('profiles')
        .select('tinta')
        .eq('id', user.id)
        .single();

        return profile?.tinta || 0;
    } catch (error) {
        console.error('Error getting tinta balance:', error);
        return null;
    }
}

export async function getUserArtworks() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
        return [];
        }

        const { data: userArtworks, error } = await supabase
        .from('user_artworks')
        .select(`
            id,
            is_active,
            artwork:artworks(*)
        `)
        .eq('user_id', user.id);

        if (error) {
        console.error('Error fetching user artworks:', error);
        return [];
        }

        return userArtworks || [];
    } catch (error) {
        console.error('Error getting user artworks:', error);
        return [];
    }
}
