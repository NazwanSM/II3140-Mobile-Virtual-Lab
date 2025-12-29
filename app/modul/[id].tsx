import { getModuleById } from '@/lib/actions/modules';
import { updateModuleProgress } from '@/lib/actions/progress';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ContentSection = {
    type?: 'points' | 'table';
    title: string;
    description?: string;
    points?: string[];
    table?: {
        headers: string[];
        rows: string[][];
    };
};

export default function ModulDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [module, setModule] = useState<any>(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [completingProgress, setCompletingProgress] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const fetchModule = useCallback(async () => {
        try {
            setLoading(true);
            const moduleData = await getModuleById(id as string);
            
            if (moduleData) {
                
                if (typeof moduleData.content === 'string') {
                    moduleData.content = JSON.parse(moduleData.content);
                }
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

    const handleDownload = async () => {
        try {
            setShowDownloadModal(false);
            alert('Download akan segera dimulai');
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Gagal mengunduh file');
        }
    };

    const handleMarkComplete = async () => {
        if (isCompleted || completingProgress) return;
        
        try {
            setCompletingProgress(true);
            const result = await updateModuleProgress(id as string, 'modul');
            
            if (result.success) {
                setIsCompleted(true);
                alert('Selamat! Kamu mendapat +500 tinta ✨');
            } else if (result.error === 'Already completed') {
                setIsCompleted(true);
            }
        } catch (error) {
            console.error('Error marking module complete:', error);
        } finally {
            setCompletingProgress(false);
        }
    };

    const formatText = (text: string): React.ReactNode => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <Text key={index} className="font-satoshi-bold">
                        {part.slice(2, -2)}
                    </Text>
                );
            }
            return part;
        });
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
                <Text className="text-gray-600 font-satoshi-medium">Modul tidak ditemukan</Text>
            </View>
        );
    }

    const sections: ContentSection[] = module.content?.sections || [];

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

                            <Pressable 
                                onPress={() => setShowDownloadModal(true)}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Feather name="download" size={20} color="#B13E3E" />
                            </Pressable>
                        </View>
                    </View>

                    <View className="h-[1px] bg-gray-200 mx-6" />

                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                    >
                        <View className="px-6 py-6">
                            {sections.map((section, index) => (
                                <View key={index} className="mb-6">
                                    <Text className="text-lg font-satoshi-bold text-gray-900 mb-2">
                                        {section.title}
                                    </Text>

                                    {section.description && (
                                        <Text className="text-sm text-gray-700 mb-3 leading-6">
                                            {formatText(section.description)}
                                        </Text>
                                    )}

                                    {section.points && section.type !== 'table' && (
                                        <View className="ml-4">
                                            {section.points.map((point, pointIndex) => (
                                                <Text key={pointIndex} className="text-sm text-gray-700 mb-2 leading-6">
                                                    {formatText(point)}
                                                </Text>
                                            ))}
                                        </View>
                                    )}

                                    {section.type === 'table' && section.table && (
                                        <View className="border-2 border-gray-800 rounded-lg overflow-hidden">
                                            <View className="flex-row bg-gray-100 border-b-2 border-gray-800">
                                                {section.table.headers.map((header, headerIndex) => (
                                                    <View 
                                                        key={headerIndex} 
                                                        className="flex-1 p-3 border-r border-gray-800"
                                                        style={{ borderRightWidth: headerIndex === section.table!.headers.length - 1 ? 0 : 1 }}
                                                    >
                                                        <Text className="text-sm font-satoshi-bold text-gray-900 text-center">
                                                            {header}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>

                                            {section.table.rows.map((row, rowIndex) => (
                                                <View 
                                                    key={rowIndex} 
                                                    className="flex-row border-b border-gray-800"
                                                    style={{ borderBottomWidth: rowIndex === section.table!.rows.length - 1 ? 0 : 1 }}
                                                >
                                                    {row.map((cell, cellIndex) => (
                                                        <View 
                                                            key={cellIndex} 
                                                            className="flex-1 p-3 border-r border-gray-800"
                                                            style={{ borderRightWidth: cellIndex === row.length - 1 ? 0 : 1 }}
                                                        >
                                                            <Text className="text-sm text-gray-700 text-center">
                                                                {cell}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>

                        <View className="px-6 pb-6">
                            <Pressable 
                                onPress={handleMarkComplete}
                                disabled={isCompleted || completingProgress}
                                className={`rounded-2xl py-4 flex-row items-center justify-center ${
                                    isCompleted ? 'bg-green-100 border-2 border-green-500' : 
                                    completingProgress ? 'bg-gray-200' : 
                                    'bg-[#5A8BEE]'
                                }`}
                            >
                                {completingProgress ? (
                                    <ActivityIndicator size="small" color="#666" />
                                ) : (
                                    <>
                                        <Ionicons 
                                            name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
                                            size={24} 
                                            color={isCompleted ? "#10B981" : "#FFFFFF"} 
                                        />
                                        <Text className={`ml-2 text-base font-satoshi-bold ${
                                            isCompleted ? 'text-green-600' : 'text-white'
                                        }`}>
                                            {isCompleted ? 'Selesai Dibaca' : 'Tandai Selesai'}
                                        </Text>
                                    </>
                                )}
                            </Pressable>
                        </View>

                        <View className="h-2" />
                    </ScrollView>
                </SafeAreaView>

                <Modal
                    visible={showDownloadModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDownloadModal(false)}
                >
                    <Pressable 
                        className="flex-1 bg-black/50 items-center justify-center px-6"
                        onPress={() => setShowDownloadModal(false)}
                    >
                        <Pressable 
                            className="bg-white rounded-3xl p-6 w-full max-w-md"
                            onPress={(e) => e.stopPropagation()}
                        >
                            <Text className="text-xl font-satoshi-bold text-gray-900 text-center mb-6">
                                Unduh File Materi
                            </Text>

                            <View className="border-2 border-gray-200 rounded-2xl p-4 mb-6 flex-row items-center">
                                <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
                                    <Ionicons name="document-text" size={24} color="#5A8BEE" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-satoshi-bold text-gray-900">
                                        Rangkuman Modul {module.module_number}
                                    </Text>
                                </View>
                                <Ionicons name="download-outline" size={24} color="#5A8BEE" />
                            </View>

                            <Pressable 
                                onPress={handleDownload}
                                className="bg-[#5A8BEE] rounded-2xl py-4 mb-3"
                            >
                                <Text className="text-white text-center font-satoshi-bold text-base">
                                    Unduh
                                </Text>
                            </Pressable>

                            <Pressable 
                                onPress={() => setShowDownloadModal(false)}
                                className="bg-gray-100 rounded-2xl py-4"
                            >
                                <Text className="text-gray-700 text-center font-satoshi-bold text-base">
                                    Selesai
                                </Text>
                            </Pressable>
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        </>
    );
}
