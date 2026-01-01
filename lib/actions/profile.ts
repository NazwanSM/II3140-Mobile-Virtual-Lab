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

export async function getProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        // Try to get profile
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            return null;
        }

        // If profile exists, return it
        if (profile) {
            return profile;
        }

        // Profile doesn't exist, try to create it
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
            // If duplicate key error, profile already exists - try to fetch again
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

export async function getArtworksWithUserStatus() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return [];
        }

        const { data: artworks, error: artworksError } = await supabase
            .from('artworks')
            .select('*')
            .order('artwork_number', { ascending: true });

        if (artworksError) {
            console.error('Error fetching artworks:', artworksError);
            return [];
        }

        const { data: userArtworks, error: userArtworksError } = await supabase
            .from('user_artworks')
            .select('artwork_id, is_active')
            .eq('user_id', user.id);

        if (userArtworksError) {
            console.error('Error fetching user artworks:', userArtworksError);
            return [];
        }

        const artworksWithStatus = artworks?.map(artwork => {
            const userArtwork = userArtworks?.find(ua => ua.artwork_id === artwork.id);
            return {
                ...artwork,
                is_unlocked: !!userArtwork,
                is_active: userArtwork?.is_active || false
            };
        }) || [];

        return artworksWithStatus;
    } catch (error) {
        console.error('Error getting artworks with user status:', error);
        return [];
    }
}

export async function getLeaderboard() {
    try {
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, full_name, username, tinta')
            .order('tinta', { ascending: false });

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        const leaderboard = profiles?.map((profile, index) => ({
            ...profile,
            rank: index + 1,
        })) || [];

        return leaderboard;
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        return [];
    }
}
