import { getModules } from '@/lib/actions/modules';
import { getAllProgress } from '@/lib/actions/progress';
import { getAllQuizResults } from '@/lib/actions/quiz';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Platform, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '../../components/BottomNavbar';
import LatihanCard from '../../components/LatihanCard';

const isWeb = Platform.OS === 'web';

interface QuizResult {
    module_id: string;
    difficulty: string;
    score: number;
}

export default function LatihanScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [latihanList, setLatihanList] = useState<any[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [modules, progressData, quizResults] = await Promise.all([
                getModules(),
                getAllProgress(),
                getAllQuizResults()
            ]);
            
            // Create score map from quiz results
            const scoreMap = new Map<string, number>();
            (quizResults as QuizResult[])?.forEach((result) => {
                const key = `${result.module_id}-${result.difficulty}`;
                scoreMap.set(key, result.score);
            });
            
            if (modules) {
                setLatihanList(modules.map(module => {
                    const quizScores = {
                        mudah: scoreMap.get(`${module.id}-mudah`) ?? null,
                        sedang: scoreMap.get(`${module.id}-sedang`) ?? null,
                        sulit: scoreMap.get(`${module.id}-sulit`) ?? null,
                    };
                    
                    const completedQuizzes = [
                        quizScores.mudah !== null,
                        quizScores.sedang !== null,
                        quizScores.sulit !== null
                    ].filter(Boolean).length;
                    
                    const progress = Math.round((completedQuizzes / 3) * 100);
                    
                    return {
                        moduleId: module.id.toString(),
                        moduleNumber: module.module_number,
                        title: module.title,
                        thumbnail: require('../../assets/images/frameMateri.png'),
                        progress: progress,
                        quizScores: quizScores,
                    };
                }));
            }
        } catch (error) {
            console.error('Error fetching latihan data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
                <SafeAreaView className="flex-1" edges={['bottom']}>
                    <ImageBackground
                        source={require('../../assets/images/Background-Header.png')}
                        className="pt-20 px-6 pb-10 rounded-b-[30px] w-full"
                        style={isWeb ? { width: '100%', paddingTop: 80, paddingHorizontal: 24, paddingBottom: 40 } : undefined}
                        resizeMode="cover"
                    >
                        <View className="flex-row items-center justify-center relative">
                            <Pressable 
                                onPress={() => router.back()}
                                className="absolute left-0 w-10 h-10 items-center justify-center"
                            >
                                <Ionicons name="chevron-back" size={20} color="#000000" />
                            </Pressable>

                            <Image
                                source={require('../../assets/images/BelajarIcon.png')}
                                className="w-8 h-8 mr-3"
                                style={isWeb ? { width: 32, height: 32, marginRight: 12 } : undefined}
                                resizeMode="contain"
                            />
                            <Text className="text-2xl font-satoshi-bold text-gray-900">
                                Latihan
                            </Text>
                        </View>
                    </ImageBackground>

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                >
                    <View className="px-8 mt-5">
                        <Text className="text-xl font-satoshi-bold text-black mb-5">
                            Mau <Text className="text-foundation-blue-normal">Latihan</Text> apa hari ini?
                        </Text>

                        {loading ? (
                            <View className="flex-1 items-center justify-center py-20">
                                <ActivityIndicator size="large" color="#F9C74E" />
                            </View>
                        ) : (
                            latihanList.map((latihan) => (
                                <LatihanCard
                                    key={latihan.moduleId}
                                    moduleId={latihan.moduleId}
                                    moduleNumber={latihan.moduleNumber}
                                    title={latihan.title}
                                    thumbnail={latihan.thumbnail}
                                    progress={latihan.progress}
                                    quizScores={latihan.quizScores}
                                />
                            ))
                        )}

                        <View className="h-24" />
                    </View>
                </ScrollView>

                <BottomNavbar />
            </SafeAreaView>
        </View>
    );
}
