import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';

const isWeb = Platform.OS === 'web';

interface LatihanCardProps {
    moduleId: string;
    moduleNumber: number;
    title: string;
    thumbnail: any;
    progress: number;
    quizScores: {
        mudah: number | null;
        sedang: number | null;
        sulit: number | null;
    };
}

export default function LatihanCard({
    moduleId,
    moduleNumber,
    title,
    thumbnail,
    progress,
    quizScores,
}: LatihanCardProps) {
    const router = useRouter();

    const getDifficultyStyle = (difficulty: 'mudah' | 'sedang' | 'sulit', hasScore: boolean) => {
        if (hasScore) {
            return {
                button: 'bg-foundation-red-light border-foundation-red-darker',
                text: 'text-foundation-red-darker',
            };
        }
        return {
            button: 'bg-foundation-red-light border-foundation-red-darker',
            text: 'text-foundation-red-darker',
        };
    };

    const handleDifficultyPress = (difficulty: 'mudah' | 'sedang' | 'sulit') => {
        router.push(`/latihan/${moduleId}/${difficulty}`);
    };

    return (
        <View className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-100">
            <View className="relative">
                <Image
                    source={thumbnail}
                    className="w-full h-40"
                    style={isWeb ? { width: '100%', height: 160 } : undefined}
                    resizeMode="cover"
                />
                <View className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 flex-row items-center shadow-sm">
                    <Text className="text-xs font-satoshi-bold text-gray-800 mr-1">
                        Materi {moduleNumber}
                    </Text>
                    <Image
                        source={require('../assets/images/LatihanIcon.png')}
                        className="w-4 h-4"
                        style={isWeb ? { width: 16, height: 16 } : undefined}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <View className="py-4 px-3">
                <Text className="text-base font-satoshi-bold text-gray-900 mb-3" numberOfLines={2}>
                    {title}
                </Text>

                <View className="mb-1">
                    <View className="h-2 bg-[#FCE5E5]/40 rounded-full overflow-hidden">
                        <View 
                            className="h-full bg-foundation-red-darker rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </View>
                </View>
                <Text className="text-xs font-satoshi-medium text-gray-600 mb-4">
                    Selesai : {progress} %
                </Text>

                <View className="flex-row gap-2">
                    {(['mudah', 'sedang', 'sulit'] as const).map((difficulty) => {
                        const hasScore = quizScores[difficulty] !== null;
                        const styles = getDifficultyStyle(difficulty, hasScore);
                        const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
                        
                        return (
                            <Pressable
                                key={difficulty}
                                onPress={() => handleDifficultyPress(difficulty)}
                                className={`flex-1 py-2.5 rounded-xl border-2 ${styles.button}`}
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                <Text className={`text-center font-satoshi-bold text-sm ${styles.text}`}>
                                    {label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
