import { getModules } from '@/lib/actions/modules';
import { getAllProgress } from '@/lib/actions/progress';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '../../components/BottomNavbar';
import MateriCard from '../../components/MateriCard';

const thumbnailMap: { [key: number]: any } = {
    1: require('../../assets/images/Thumbnail-modul1.png'),
    2: require('../../assets/images/Thumbnail-modul2.png'),
    3: require('../../assets/images/Thumbnail-modul3.png'),
};

export default function BelajarScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [materiList, setMateriList] = useState<any[]>([]);

    const fetchModules = useCallback(async () => {
        try {
            setLoading(true);
            const [modules, progressData] = await Promise.all([
                getModules(),
                getAllProgress()
            ]);
            
            if (modules) {
                setMateriList(modules.map(module => {
                    const progressRecord = progressData?.find((p: any) => p.module_id === module.id);
                    return {
                        materiId: module.id.toString(),
                        materiNumber: module.module_number,
                        title: module.title,
                        thumbnail: thumbnailMap[module.module_number],
                        progress: progressRecord?.progress || 0,
                    };
                }));
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    useFocusEffect(
        useCallback(() => {
            fetchModules();
        }, [fetchModules])
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
                <SafeAreaView className="flex-1" edges={['bottom']}>
                    <ImageBackground
                        source={require('../../assets/images/Background-Header.png')}
                        className="pt-20 px-6 pb-10 rounded-b-[30px] w-full"
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
                                resizeMode="contain"
                            />
                            <Text className="text-2xl font-satoshi-bold text-gray-900">
                                Belajar
                            </Text>
                        </View>
                    </ImageBackground>

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                >
                    <View className="px-8 mt-5">
                        <Text className="text-xl font-satoshi-bold text-black mb-3">
                            Mau <Text className="text-foundation-blue-normal">belajar</Text> apa hari ini?
                        </Text>

                        {loading ? (
                            <View className="flex-row items-center justify-center py-12">
                                <ActivityIndicator size="large" color="#5A8BEE" />
                            </View>
                        ) : (
                            materiList.map((materi) => (
                                <MateriCard
                                    key={materi.materiId}
                                    materiId={materi.materiId}
                                    materiNumber={materi.materiNumber}
                                    title={materi.title}
                                    thumbnail={materi.thumbnail}
                                    progress={materi.progress}
                                />
                            ))
                        )}
                    </View>

                    <View className="h-5" />
                </ScrollView>

                <BottomNavbar />
            </SafeAreaView>
        </View>
    );
}
