import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface ProgressCardProps {
    title: string;
    date: string;
    progress: number;
    badge: string;
    badgeColor: 'yellow' | 'red' | 'green';
}

export default function ProgressCard({ title, date, progress, badge, badgeColor }: ProgressCardProps) {
    const getBadgeStyle = () => {
        switch (badgeColor) {
        case 'yellow':
            return 'bg-foundation-yellow2-normal';
        case 'red':
            return 'bg-foundation-red-normal';
        case 'green':
            return 'bg-green-400';
        default:
            return 'bg-gray-400';
        }
    };

    return (
        <View className="bg-foundation-blue-light rounded-2xl p-4 mb-3">
        <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
            <Text className="text-base font-satoshi-bold text-gray-800">{title}</Text>
            <View className="flex-row items-center mt-1">
                <Ionicons name="calendar" size={14} color="#4B68F7" />
                <Text className="text-sm font-satoshi text-gray-600 ml-1">{date}</Text>
            </View>
            </View>
            <View className={`${getBadgeStyle()} px-3 py-1 rounded-full`}>
            <Text className="text-white text-xs font-satoshi-medium">{badge}</Text>
            </View>
        </View>
        
        <View className="mt-2">
            <View className="bg-neutral-200 h-2 rounded-full overflow-hidden">
            <View 
                className="bg-foundation-blue-normal h-full rounded-full" 
                style={{ width: `${progress}%` }}
            />
            </View>
            <Text className="text-right text-gray-700 font-satoshi-medium mt-1">{progress}%</Text>
        </View>
        </View>
    );
}
