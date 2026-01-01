import { getProfile } from '@/lib/actions/auth';
import { getArtworksWithUserStatus } from '@/lib/actions/profile';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';

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

const getImageSource = (imagePath: string | null) => {
    if (!imagePath) return null;
    
    const filename = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
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

export default function ArtworkCollectionScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [artworksData, profileData] = await Promise.all([
                getArtworksWithUserStatus(),
                getProfile()
            ]);
            
            if (artworksData) {
                setArtworks(artworksData);
            }

            if (profileData) {
                setProfile(profileData);
            }
        } catch (error) {
            console.error('Error fetching artworks:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const unlockedCount = artworks.filter(a => a.is_unlocked).length;

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#5A8BEE" />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen 
                options={{
                    headerShown: false,
                    presentation: 'card',
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                }}
            />
            <View className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                
                <SafeAreaView className="flex-1" edges={['bottom']}>
                    <View className="pt-16 px-6 pb-4">
                        <View className="flex-row items-center justify-between">
                            <Pressable 
                                onPress={() => router.back()}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Ionicons name="chevron-back" size={20} color="#000000" />
                            </Pressable>

                            <Text className="flex-1 text-center text-base font-satoshi-bold text-gray-900 mx-4">
                                Koleksi Karakter Kamu
                            </Text>

                            <View className="w-10" />
                        </View>
                    </View>

                    <View className="h-[1px] bg-gray-200 mx-6" />

                        <View className="px-6 py-2 bg-blue-50 mx-6 mt-3 rounded-2xl border-2 border-blue-200">
                            <Text className="text-center text-xl font-satoshi-bold text-gray-900 mb-1">
                                {unlockedCount} / {artworks.length}
                            </Text>
                            <Text className="text-center text-sm font-satoshi-medium text-gray-600">
                                Karakter Terbuka
                            </Text>
                        </View>

                        <View className="px-6 py-2">
                            <View className="flex-row flex-wrap justify-between">
                                {artworks.map((artwork) => (
                                    <Pressable
                                        key={artwork.id}
                                        onPress={() => setSelectedArtwork(artwork)}
                                        className="w-[32%] mb-4 rounded-2xl overflow-hidden border-2 border-gray-300 bg-gray-100"
                                        style={{ aspectRatio: 2/3 }}
                                    >
                                        {({ pressed }) => (
                                            <>
                                                {/* Artwork Image */}
                                                {artwork.is_unlocked ? (
                                                    <Image
                                                        source={getImageSource(artwork.image_url)}
                                                        className="w-full h-full"
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <Image
                                                        source={getImageSource(artwork.image_locked_url)}
                                                        className="w-full h-full"
                                                        resizeMode="cover"
                                                    />
                                                )}
                                                    {!artwork.is_unlocked && (
                                                        <View className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-3">
                                                        <Text className="text-xs font-satoshi-medium text-yellow-400 text-center mt-1">
                                                            {artwork.required_tinta.toLocaleString('id-ID')} tinta
                                                        </Text>
                                                        </View>
                                                    )}
                                                
                                            </>
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <View className="px-0 pb-10 items-start">
                            <ExpoImage
                                source={require('../../assets/images/Karakter-Profile.png')}
                                style={{ width: 380, height: 380 }}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                            />
                        </View>

                </SafeAreaView>

                <Modal
                    visible={selectedArtwork !== null}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSelectedArtwork(null)}
                >
                    <Pressable 
                        className="flex-1 bg-black/80 items-center justify-center p-6"
                        onPress={() => setSelectedArtwork(null)}
                    >
                        <Pressable className="bg-white rounded-[34px] overflow-hidden w-full max-w-sm">
                            {selectedArtwork && (
                                <>
                                    {/* Large Artwork Image */}
                                    <View className="aspect-[2/3] w-full">
                                        {selectedArtwork.is_unlocked && getImageSource(selectedArtwork.image_hover_url) ? (
                                            <Image
                                                source={getImageSource(selectedArtwork.image_hover_url)}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        ) : getImageSource(selectedArtwork.image_locked_hover_url) ? (
                                            <Image
                                                source={getImageSource(selectedArtwork.image_locked_hover_url)}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View className="w-full h-full bg-gray-300" />
                                        )}
                                        
                                    </View>
                                </>
                            )}
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        </>
    );
}
