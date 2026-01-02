import { getLeaderboard, getProfile } from '@/lib';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Platform, ScrollView, StatusBar, Text, View } from 'react-native';

const isWeb = Platform.OS === 'web';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '../../components/BottomNavbar';

interface LeaderboardUser {
    id: string;
    full_name: string;
    username: string;
    tinta: number;
    rank: number;
}

export default function SosialScreen() {
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
        setLoading(true);
        const [leaderboardData, profile] = await Promise.all([
            getLeaderboard(),
            getProfile(),
        ]);

        if (leaderboardData) {
            setLeaderboard(leaderboardData);
        }

        if (profile) {
            setCurrentUserId(profile.id);
        }
        } catch (error) {
        console.error('Error fetching leaderboard:', error);
        } finally {
        setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
        fetchData();
        }, [fetchData])
    );

    const top3 = leaderboard.slice(0, 3);
    const restOfList = leaderboard;

    const getRankSuffix = (rank: number) => {
        if (rank === 1) return 'st';
        if (rank === 2) return 'nd';
        if (rank === 3) return 'rd';
        return 'th';
    };

    return (
        <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#E8EAF6" />
        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
            <View className="px-4 pt-1" style={{ zIndex: 0 }}>
                <ImageBackground
                    source={require('../../assets/images/podium.png')}
                    className="w-full h-72 overflow-hidden"
                    style={isWeb ? { width: '100%', height: 288 } : undefined}
                    resizeMode="contain"
                >
                    <View className="flex-1 flex-row justify-center items-start">
                        {top3[1] && (
                            <View className="items-center w-32 mt-12" style={isWeb ? { width: 128, marginTop: 48 } : undefined}>
                                <View className="h-2" />
                                <View className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-300 overflow-hidden" style={isWeb ? { width: 64, height: 64 } : undefined}>
                                    <Image
                                        source={require('../../assets/images/Profile - Men 2.png')}
                                        className="w-full h-full"
                                        style={isWeb ? { width: '100%', height: '100%' } : undefined}
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text className="text-xs font-satoshi-bold text-gray-700">@{top3[1].username || 'user'}</Text>
                                <View className="bg-[#5C6BC0] px-2 py-0.5 rounded-full mt-1">
                                    <Text className="text-[8px] font-satoshi-bold text-white">
                                        {top3[1].tinta.toLocaleString('id-ID')} tinta
                                    </Text>
                                </View>
                            </View>
                        )}

                        {top3[0] && (
                            <View className="items-center w-32 " style={isWeb ? { width: 128 } : undefined}>
                                <View className="w-20 h-20 rounded-full bg-gray-200 border-2 border-yellow-400 overflow-hidden" style={isWeb ? { width: 80, height: 80 } : undefined}>
                                    <Image
                                        source={require('../../assets/images/Profile - Men 2.png')}
                                        className="w-full h-full"
                                        style={isWeb ? { width: '100%', height: '100%' } : undefined}
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text className="text-sm font-satoshi-bold text-gray-700">@{top3[0].username || 'user'}</Text>
                                <View className="bg-[#5C6BC0] px-2 py-0.5 rounded-full mt-1">
                                    <Text className="text-[8px] font-satoshi-bold text-white">
                                        {top3[0].tinta.toLocaleString('id-ID')} tinta
                                    </Text>
                                </View>
                            </View>
                        )}

                        {top3[2] && (
                            <View className="items-center w-32 mt-20" style={isWeb ? { width: 128, marginTop: 80 } : undefined}>
                                <View className="h-2" />
                                <View className="w-16 h-16 rounded-full bg-gray-200 border-2 border-orange-300 overflow-hidden" style={isWeb ? { width: 64, height: 64 } : undefined}>
                                    <Image
                                        source={require('../../assets/images/Profile - Men 2.png')}
                                        className="w-full h-full"
                                        style={isWeb ? { width: '100%', height: '100%' } : undefined}
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text className="text-xs font-satoshi-bold text-gray-700">@{top3[2].username || 'user'}</Text>
                                <View className="bg-[#5C6BC0] px-2 py-0.5 rounded-full mt-1">
                                    <Text className="text-[8px] font-satoshi-bold text-white">
                                        {top3[2].tinta.toLocaleString('id-ID')} tinta
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </ImageBackground>
            </View>

            <View className="flex-1 px-0 -mt-16" style={{ zIndex: 30 }}>
                <ImageBackground
                    source={require('../../assets/images/backgroundLeaderboard.png')}
                    className="flex-1 overflow-hidden h-full w-full"
                    style={isWeb ? { flex: 1, width: '100%', height: '100%' } : undefined}
                    resizeMode="cover"
                >
                    <View className="h-16" />
                    
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        className="flex-1 px-4 rounded-3xl"
                        contentContainerStyle={{ paddingBottom: 16 }}
                    >
                    {restOfList.map((user, index) => {
                        const isCurrentUser = user.id === currentUserId;
                        return (
                        <View
                            key={user.id}
                            className={`flex-row items-center p-4 mb-2 rounded-2xl ${
                            isCurrentUser ? 'bg-white border-2 border-[#5C6BC0]' : 'bg-white'
                            }`}
                            style={isCurrentUser ? {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2,
                            } : {}}
                        >
                            <View className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden mr-3" style={isWeb ? { width: 56, height: 56, marginRight: 12 } : undefined}>
                            <Image
                                source={require('../../assets/images/Profile - Men 2.png')}
                                className="w-full h-full"
                                style={isWeb ? { width: '100%', height: '100%' } : undefined}
                                resizeMode="cover"
                            />
                            </View>

                            <View className="flex-1">
                            <Text className="text-base font-satoshi-bold text-gray-800">
                                {user.full_name || 'User'}
                            </Text>
                            {isCurrentUser ? (
                                <Text className="text-sm font-satoshi-medium text-[#F9C74E]">
                                Kamu
                                </Text>
                            ) : (
                                <Text className="text-sm font-satoshi-medium text-gray-500">
                                @{user.username || 'user'}
                                </Text>
                            )}
                            </View>

                            <Text className="text-base font-satoshi-bold text-gray-700">
                            {user.rank}{getRankSuffix(user.rank)}
                            </Text>
                        </View>
                        );
                    })}
                    <View className="h-4" />
                    </ScrollView>
                </ImageBackground>
            </View>

            <BottomNavbar />
        </SafeAreaView>
        </View>
    );
}
