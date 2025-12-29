import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface MateriCardProps {
    materiId: string;
    materiNumber: number;
    title: string;
    thumbnail: any;
    progress: number;
}

export default function MateriCard({
    materiId,
    materiNumber,
    title,
    thumbnail,
    progress,
}: MateriCardProps) {
    const router = useRouter();

    return (
        <View className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <View className="relative h-40 w-full">
                <Image
                    source={thumbnail}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <View className="absolute top-4 right-4 bg-white rounded-full px-4 py-1.5 flex-row items-center shadow-md">
                    <Text className="text-sm font-satoshi-bold text-gray-800">Materi {materiNumber}</Text>
                    <Text className="ml-1.5 text-base">📚</Text>
                </View>
            </View>

            <View className="py-5">
                <Text className="text-lg font-satoshi-bold text-gray-800 mb-4" numberOfLines={2}>
                    {title}
                </Text>

                <View className="mb-4">
                    <View className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <View 
                            className="bg-foundation-blue-normal h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </View>
                    <Text className="text-right text-lg font-satoshi-bold text-gray-800">{progress}%</Text>
                </View>

                <View className="space-y-2">
                    <View className="flex-row gap-2 mb-2">
                        <Pressable 
                            onPress={() => router.push(`/modul/${materiId}`)}
                            className="flex-1 px-4 py-2 bg-[#F5E6E8] border-2 border-[#D4A5B0] rounded-xl active:opacity-70"
                        >
                            <Text className="text-center text-sm font-satoshi-bold text-[#8B4A5E]">
                                Modul
                            </Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => router.push(`/video/${materiId}`)}
                            className="flex-1 px-4 py-2 bg-[#F5E6E8] border-2 border-[#D4A5B0] rounded-xl active:opacity-70"
                        >
                            <Text className="text-center text-sm font-satoshi-bold text-[#8B4A5E]">
                                Video
                            </Text>
                        </Pressable>
                    </View>
                    
                    <Pressable 
                        onPress={() => router.push(`./latihan/${materiId}`)}
                        className="w-full px-4 py-2 bg-[#F5E6E8] border-2 border-[#D4A5B0] rounded-xl active:opacity-70"
                    >
                        <Text className="text-center text-sm font-satoshi-bold text-[#8B4A5E]">
                            Latihan Soal
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
