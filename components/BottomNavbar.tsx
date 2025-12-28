import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function BottomNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <View className="bg-white border-t border-gray-200 flex-row justify-around items-center py-3 px-6">
        {/* Home / Beranda */}
        <TouchableOpacity 
            onPress={() => router.push('/')}
            className="items-center"
        >
            {isActive('/') ? (
                <View 
                    className="bg-white rounded-full px-5 py-2.5 flex-row items-center"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    <Ionicons 
                        name="home" 
                        size={24} 
                        color="#F9C74E" 
                    />
                    <Text className="ml-2 font-satoshi-bold text-foundation-yellow-normal text-base">
                        Beranda
                    </Text>
                </View>
            ) : (
                <Ionicons 
                    name="home" 
                    size={26} 
                    color="#9CA3AF" 
                />
            )}
        </TouchableOpacity>

        {/* Tasks / Calendar */}
        <TouchableOpacity 
            onPress={() => router.push('/tasks')}
            className="items-center"
        >
            {isActive('/tasks') ? (
                <View 
                    className="bg-white rounded-full px-5 py-2.5 flex-row items-center"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    <Ionicons 
                        name="calendar" 
                        size={24} 
                        color="#F9C74E" 
                    />
                    <Text className="ml-2 font-satoshi-bold text-foundation-yellow-normal text-base">
                        Tugas
                    </Text>
                </View>
            ) : (
                <Ionicons 
                    name="calendar" 
                    size={26} 
                    color="#9CA3AF" 
                />
            )}
        </TouchableOpacity>

        {/* Games */}
        <TouchableOpacity 
            onPress={() => router.push('/games')}
            className="items-center"
        >
            {isActive('/games') ? (
                <View 
                    className="bg-white rounded-full px-5 py-2.5 flex-row items-center"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    <Ionicons 
                        name="game-controller" 
                        size={24} 
                        color="#F9C74E" 
                    />
                    <Text className="ml-2 font-satoshi-bold text-foundation-yellow-normal text-base">
                        Main
                    </Text>
                </View>
            ) : (
                <Ionicons 
                    name="game-controller" 
                    size={26} 
                    color="#9CA3AF" 
                />
            )}
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity 
            onPress={() => router.push('/profile')}
            className="items-center"
        >
            {isActive('/profile') ? (
                <View 
                    className="bg-white rounded-full px-5 py-2.5 flex-row items-center"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    <Ionicons 
                        name="people" 
                        size={24} 
                        color="#F9C74E" 
                    />
                    <Text className="ml-2 font-satoshi-bold text-foundation-yellow-normal text-base">
                        Profil
                    </Text>
                </View>
            ) : (
                <Ionicons 
                    name="people" 
                    size={26} 
                    color="#9CA3AF" 
                />
            )}
        </TouchableOpacity>
        </View>
    );
}
