import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';

export interface GameCardProps {
    gameId: string;
    title: string;
    imageSrc: ImageSourcePropType;
    href: string;
    actionLabel?: string;
}


export default function GameCard({
    gameId,
    title,
    imageSrc,
    href,
    actionLabel = 'Mainkan',
}: GameCardProps) {
    const router = useRouter();

    const handlePress = () => {
        router.push(href as any);
    };

    return (
        <View className="bg-white rounded-3xl overflow-hidden mb-6 t.shadowMd" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
        }}>
            <View className="relative w-full h-56">
                <Image 
                    source={imageSrc} 
                    className="w-full h-full" 
                    resizeMode="cover"
                />
            </View>

            <View className="py-5">
                <Text className="text-lg font-satoshi-bold text-foundation-blue-darker mb-4">
                    {title}
                </Text>

                <Pressable
                    onPress={handlePress}
                    className="w-full py-3.5 rounded-2xl border-2 border-foundation-blue-darker bg-[#EDF4FE]"
                    style={({ pressed }) => [
                        {
                            opacity: pressed ? 0.8 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }]
                        }
                    ]}
                >
                    <Text className="text-center text-[#1F2D4A] font-satoshi-bold text-base">
                        {actionLabel}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
