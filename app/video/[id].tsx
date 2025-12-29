import { getModuleById } from '@/lib/actions/modules';
import { updateModuleProgress } from '@/lib/actions/progress';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

function VideoPlayer({ videoUrl, height, onVideoEnd }: { videoUrl: string; height: number; onVideoEnd: () => void }) {
    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeVideoId(videoUrl);

    if (!videoId) {
        return (
            <View className="flex-1 items-center justify-center">
                <Ionicons name="alert-circle" size={48} color="#666" />
                <Text className="text-gray-400 mt-4 font-satoshi-medium">
                    Format URL video tidak valid
                </Text>
            </View>
        );
    }

    return (
        <YoutubePlayer
            height={height}
            videoId={videoId}
            play={false}
            onChangeState={(state: string) => {
                if (state === 'ended') {
                    onVideoEnd();
                }
            }}
        />
    );
}

export default function VideoDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [module, setModule] = useState<any>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const fetchModule = useCallback(async () => {
        try {
            setLoading(true);
            const moduleData = await getModuleById(id as string);
            
            if (moduleData) {
                console.log('Video URL:', moduleData.video_url);
                setModule(moduleData);
            }
        } catch (error) {
            console.error('Error fetching module:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchModule();
        }
    }, [id, fetchModule]);

    const handleVideoEnd = async () => {
        if (isCompleted) return;
        
        try {
            const result = await updateModuleProgress(id as string, 'video');
            
            if (result.success) {
                setIsCompleted(true);
                alert('Selamat! Kamu telah menyelesaikan video ini dan mendapat +500 tinta ✨');
            } else if (result.error === 'Already completed') {
                setIsCompleted(true);
            }
        } catch (error) {
            console.error('Error updating video progress:', error);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#5A8BEE" />
            </View>
        );
    }

    if (!module) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <Text className="text-gray-600 font-satoshi-medium">Video tidak ditemukan</Text>
            </View>
        );
    }

    const screenWidth = Dimensions.get('window').width;
    const videoHeight = (screenWidth * 9) / 16;

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
                                onPress={() => {
                                    if (router.canGoBack()) {
                                        router.back();
                                    } else {
                                        router.push('/(tabs)/belajar');
                                    }
                                }}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Ionicons name="chevron-back" size={20} color="#000000" />
                            </Pressable>

                            <Text className="flex-1 text-center text-base font-satoshi-bold text-gray-900 mx-4" numberOfLines={2}>
                                {module.title}
                            </Text>

                            <View className="w-10 h-10" />
                        </View>
                    </View>

                    <View className="h-[1px] bg-gray-200 mx-6" />

                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                    >
                        <View className="pt-6">
                            <View className="overflow-hidden" style={{ height: videoHeight }}>
                                {module.video_url ? (
                                    <VideoPlayer 
                                        videoUrl={module.video_url} 
                                        height={videoHeight}
                                        onVideoEnd={handleVideoEnd}
                                    />
                                ) : (
                                    <View className="flex-1 items-center justify-center">
                                        <Ionicons name="videocam-off" size={48} color="#666" />
                                        <Text className="text-gray-400 mt-4 font-satoshi-medium">
                                            Video belum tersedia
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View className="px-6 pt-6">
                            <Text className="text-lg font-satoshi-bold text-gray-900 mb-3">
                                Deskripsi
                            </Text>
                            <Text className="text-sm text-gray-700 leading-6">
                                Video pembelajaran ini membahas secara lengkap tentang {module.title.toLowerCase()}. 
                                Materi disajikan dengan cara yang mudah dipahami dan dilengkapi dengan contoh-contoh praktis.
                            </Text>
                        </View>

                        <View className="px-6 pt-6 pb-6">
                            <View className="flex-row items-center mb-3">
                                <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-3">
                                    <Ionicons name="sparkles" size={18} color="#9333EA" />
                                </View>
                                <Text className="text-lg font-satoshi-bold text-gray-900">
                                    Ringkasan AI
                                </Text>
                            </View>
                            
                            <View className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                                <Text className="text-sm text-gray-700 leading-6">
                                    {module.content?.ai_summary || 
                                    `Video ini menjelaskan konsep-konsep penting dalam ${module.title}. Pembahasan dimulai dari dasar-dasar teori, 
                                    dilanjutkan dengan penerapan praktis, dan diakhiri dengan tips untuk menghindari kesalahan umum. 
                                    Materi disusun secara sistematis sehingga mudah dipahami oleh pemelajar pemula maupun yang sudah berpengalaman.`}
                                </Text>

                                <View className="mt-4 space-y-2">
                                    <Text className="text-sm font-satoshi-bold text-gray-900 mb-2">
                                        Poin Penting:
                                    </Text>
                                    <View className="flex-row items-start mb-2">
                                        <Text className="text-purple-600 mr-2">•</Text>
                                        <Text className="flex-1 text-sm text-gray-700">
                                            Pemahaman konsep dasar yang kuat
                                        </Text>
                                    </View>
                                    <View className="flex-row items-start mb-2">
                                        <Text className="text-purple-600 mr-2">•</Text>
                                        <Text className="flex-1 text-sm text-gray-700">
                                            Contoh penerapan dalam kehidupan sehari-hari
                                        </Text>
                                    </View>
                                    <View className="flex-row items-start">
                                        <Text className="text-purple-600 mr-2">•</Text>
                                        <Text className="flex-1 text-sm text-gray-700">
                                            Tips menghindari kesalahan umum
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="h-5" />
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    );
}
