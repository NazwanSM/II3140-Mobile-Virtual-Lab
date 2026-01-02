import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, Platform, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '../../components/BottomNavbar';
import GameCard from '../../components/GameCard';

const isWeb = Platform.OS === 'web';

export default function BermainScreen() {
    const router = useRouter();
    const [gameList] = useState([
        {
            gameId: '1',
            title: 'Teka - Teki Silang',
            imageSrc: require('../../assets/images/TekaTeki.png'),
            href: '/game/tts',
        },
        {
            gameId: '2',
            title: 'Drag and Drop',
            imageSrc: require('../../assets/images/DragAndDrop.png'),
            href: '/game/dragdrop',
        },
    ]);

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
                            Main
                        </Text>
                    </View>
                </ImageBackground>

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                >
                    <View className="px-8 mt-5">
                        <Text className="text-xl font-satoshi-bold text-black mb-5">
                            Mau <Text className="text-foundation-blue-normal">Main</Text> apa hari ini?
                        </Text>

                        {gameList.map((game) => (
                            <GameCard
                                key={game.gameId}
                                gameId={game.gameId}
                                title={game.title}
                                imageSrc={game.imageSrc}
                                href={game.href}
                            />
                        ))}
                    </View>

                    <View className="h-5" />
                </ScrollView>

                <BottomNavbar />
            </SafeAreaView>
        </View>
    );
}
