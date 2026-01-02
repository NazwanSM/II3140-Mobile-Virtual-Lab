import { signOut } from '@/lib/actions/auth';
import { getArtworksWithUserStatus, getProfile } from '@/lib/actions/profile';
import { Ionicons } from '@expo/vector-icons';import { LinearGradient } from 'expo-linear-gradient';import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Clipboard, Image, ImageBackground, Modal, Platform, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';

const isWeb = Platform.OS === 'web';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '../../components/BottomNavbar';

interface Artwork {
    id: string;
    title: string;
    image_url: string;
    image_locked_url: string | null;
    image_hover_url: string | null;
    image_locked_hover_url: string | null;
    is_unlocked: boolean;
    is_active: boolean;
    required_tinta: number;
    artwork_number: number | null;
    description: string | null;
}

// Helper to get image source from database path
const getImageSource = (imagePath: string | null) => {
    if (!imagePath) return null;
    
    // Remove leading slash and get just the filename
    const filename = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // Map database filenames to local assets
    const imageAssets: { [key: string]: any } = {
        'Karakter 1 - Normal.png': require('../../assets/images/Karakter 1 - Normal.png'),
        'Karakter 2 - Normal.png': require('../../assets/images/Karakter 2 - Normal.png'),
        'Karakter 3 - Normal.png': require('../../assets/images/Karakter 3 - Normal.png'),
        'Karakter 4 - Normal.png': require('../../assets/images/Karakter 4 - Normal.png'),
        'Karakter 5 - Normal.png': require('../../assets/images/Karakter 5 - Normal.png'),
        'Karakter 1 - Normal - Hover.png': require('../../assets/images/Karakter 1 - Normal - Hover.png'),
        'Karakter 2 - Normal - Hover.png': require('../../assets/images/Karakter 2 - Normal - Hover.png'),
        'Karakter 3 - Normal - Hover.png': require('../../assets/images/Karakter 3 - Normal - Hover.png'),
        'Karakter 4 - Normal - Hover.png': require('../../assets/images/Karakter 4 - Normal - Hover.png'),
        'Karakter 5 - Normal - Hover.png': require('../../assets/images/Karakter 5 - Normal - Hover.png'),
        'Karakter 2 - Locked.png': require('../../assets/images/Karakter 2 - Locked.png'),
        'Karakter 3 - Locked.png': require('../../assets/images/Karakter 3 - Locked.png'),
        'Karakter 4 - Locked.png': require('../../assets/images/Karakter 4 - Locked.png'),
        'Karakter 5 - Locked.png': require('../../assets/images/Karakter 5 - Locked.png'),
        'Karakter 2 - Locked - Hover.png': require('../../assets/images/Karakter 2 - Locked - Hover.png'),
        'Karakter 3 - Locked - Hover.png': require('../../assets/images/Karakter 3 - Locked - Hover.png'),
        'Karakter 4 - Locked - Hover.png': require('../../assets/images/Karakter 4 - Locked - Hover.png'),
        'Karakter 5 - Locked - Hover.png': require('../../assets/images/Karakter 5 - Locked - Hover.png'),
    };
    
    return imageAssets[filename] || null;
};

export default function ProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [showToast, setShowToast] = useState(false);

    const fetchProfileData = useCallback(async () => {
        try {
            setLoading(true);
            const [profileData, artworksData] = await Promise.all([
                getProfile(),
                getArtworksWithUserStatus()
            ]);
            
            if (profileData) {
                setProfile(profileData);
            }

            if (artworksData) {
                setArtworks(artworksData);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProfileData();
        }, [fetchProfileData])
    );

    const handleShareProfile = async () => {
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 1000);

    };

    const handleLogout = async () => {
        Alert.alert(
            'Keluar',
            'Apakah kamu yakin ingin keluar?',
            [
                {
                    text: 'Batal',
                    style: 'cancel'
                },
                {
                    text: 'Keluar',
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace('/(auth)/welcome');
                        } catch (error) {
                            console.error('Error logging out:', error);
                            Alert.alert('Error', 'Gagal keluar. Silakan coba lagi.');
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-[#FCC212]"
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
            <SafeAreaView className="flex-1" edges={['bottom']}>
                    <ImageBackground
                        source={require('../../assets/images/Background-Profile.png')}
                        className="pt-16 pb-24 px-6"
                        style={isWeb ? { width: '100%', paddingTop: 64, paddingBottom: 96, paddingHorizontal: 24 } : undefined}
                        resizeMode="cover"
                    >
                        <Pressable 
                            onPress={() => router.back()}
                            className="left-0 w-10 h-10 items-center justify-center mb-6"
                        >
                            <Ionicons name="chevron-back" size={20} color="#000000" />
                        </Pressable>
                    </ImageBackground>

                    <View className="mx-0 -mt-20 bg-white rounded-[60px] shadow-lg p-6 border border-gray-200">
                        {/* Profile Picture */}
                        <View className="items-center -mt-16 mb-4">
                            <View className="w-28 h-28 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg" style={isWeb ? { width: 112, height: 112 } : undefined}>
                                <Image 
                                    source={require('../../assets/images/Profile - Men 2.png')}
                                    className="w-full h-full"
                                    style={isWeb ? { width: '100%', height: '100%' } : undefined}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>

                        <View className="items-center mb-4">
                            <Text className="text-xl font-satoshi-bold text-foundation-yellow-dark">
                                {profile?.full_name || 'User'}
                            </Text>
                            <Text className="text-sm text-foundation-yellow-dark font-satoshi-medium mt-1">
                                @{profile?.username || 'username'}
                            </Text>
                            
                            {profile?.institution && (
                                <View className="flex-row items-center mt-2">
                                    <Ionicons name="location" size={16} color="#FCC212" />
                                    <Text className="text-sm text-gray-900 ml-1 font-satoshi-medium">
                                        {profile.institution}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="items-center mb-4">
                            <View className="bg-[#2C3E50] px-3 py-2 rounded-full flex-row items-center">
                                <Image
                                    source={require('../../assets/images/tintaLogo.png')}
                                    className="w-6 h-6 mr-2 bg-white rounded-full p-0.5"
                                    style={isWeb ? { width: 24, height: 24, marginRight: 8 } : undefined}
                                    resizeMode="contain"
                                />
                                <Text className="text-white font-satoshi-bold">
                                    {profile?.tinta?.toLocaleString('id-ID') || '0'} tinta
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row gap-3 mb-2 items-center">
                            <Pressable
                                onPress={() => {
                                    router.push('/profile/edit');
                                }}
                                className="flex-1 bg-foundation-yellow-normal px-3 py-2 rounded-xl"
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                <Text className="text-center font-satoshi-bold text-white">
                                    Edit Profile
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={handleShareProfile}
                                className="flex-1 bg-white border border-foundation-yellow-normal px-3 py-2 rounded-xl"
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                <Text className="text-center font-satoshi-bold text-foundation-yellow-normal">
                                    Share Profile
                                </Text>
                            </Pressable>
                        </View>
                    
                    <View className="px-2 mt-8">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-satoshi-bold text-gray-900">
                                Koleksi Karaktermu
                            </Text>
                            <Pressable onPress={() => {
                                router.push('/profile/artworks' as Href);
                            }}>
                                <Text className="text-sm font-satoshi-medium text-gray-900">
                                    Lihat Semua
                                </Text>
                            </Pressable>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mb-10"
                            contentContainerStyle={{ gap: 16 }}
                        >
                            {artworks.map((artwork) => (
                                <Pressable
                                    key={artwork.id}
                                    className="w-32 h-48 rounded-2xl overflow-hidden border-2 border-gray-300 bg-gray-100"
                                >
                                    {({ pressed }) => (
                                        <>
                                            {artwork.is_unlocked ? (
                                                <Image
                                                    source={
                                                        pressed && getImageSource(artwork.image_hover_url)
                                                            ? getImageSource(artwork.image_hover_url)
                                                            : getImageSource(artwork.image_url) || require('../../assets/images/Profile - Men.png')
                                                    }
                                                    className="w-full h-full"
                                                    style={isWeb ? { width: '100%', height: '100%' } : undefined}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <Image
                                                    source={
                                                        pressed && getImageSource(artwork.image_locked_hover_url)
                                                            ? getImageSource(artwork.image_locked_hover_url)
                                                            : getImageSource(artwork.image_locked_url) || require('../../assets/images/Profile - Men.png')
                                                    }
                                                    className="w-full h-full"
                                                    style={isWeb ? { width: '100%', height: '100%' } : undefined}
                                                    resizeMode="cover"
                                                />
                                            )}
                                        </>
                                    )}
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    <View className="px-2 mb-52">
                        <Pressable
                            onPress={handleLogout}
                            className="bg-foundation-red-normal py-2.5 rounded-xl"
                            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                        >
                            <Text className="text-center font-satoshi-bold text-white text-base">
                                Log Out
                            </Text>
                        </Pressable>
                    </View>
                    </View>

            </SafeAreaView>

            <Modal
                visible={showToast}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowToast(false)}
            >
                <View className="flex-1 items-center justify-end pb-10 px-6 bg-black/80">
                    <View className="bg-foundation-blue-normal px-6 py-4 rounded-2xl shadow-lg">
                        <Text className="text-white font-satoshi-medium text-center">
                            Tautan disimpan ke papan ketik
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
