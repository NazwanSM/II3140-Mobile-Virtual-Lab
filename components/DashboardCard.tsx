import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DashboardCardProps {
    title: string;
    description: string;
    imageSource: ImageSourcePropType;
    href: string;
    gradientColors: readonly [string, string, ...string[]];
    completed?: number;
    total?: number;
}

export default function DashboardCard({ 
    title, 
    description, 
    imageSource, 
    href, 
    gradientColors, 
    completed = 3, 
    total = 3 
}: DashboardCardProps) {
    const router = useRouter();

    return (
        <TouchableOpacity 
            onPress={() => router.push(href)}
            className="mb-3 rounded-3xl h-[120px] overflow-hidden"
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            
            <View className="pl-5 pt-3.5 pb-3.5 flex-1">
                <View className="absolute top-3 right-3 z-20">
                    <View className="w-9 h-9 rounded-full bg-yellow-400 items-center justify-center shadow-sm">
                        <Ionicons name="ribbon" size={14} color="#B8860B" style={{ marginBottom: -3 }} />
                        <Text className="text-[9px] font-satoshi-bold" style={{ color: '#8B6914' }}>
                            {completed}/{total}
                        </Text>
                    </View>
                </View>

                <View className="z-10 max-w-[45%]">
                    <Text className="text-[26px] font-satoshi-bold text-white mb-0.5">{title}</Text>
                    <Text className="text-[11px] font-satoshi text-white opacity-95 leading-[15px]">{description}</Text>
                </View>
                
                <View className="absolute bottom-3 right-3.5 z-10">
                    <View className="flex-row items-center">
                        <Text className="text-white text-[11px] font-satoshi-medium mr-1">Lihat</Text>
                        <Ionicons name="arrow-forward" size={11} color="white" />
                    </View>
                </View>
                
                <View className="absolute right-10 w-[180px] h-[125px]">
                    <Image 
                        source={imageSource} 
                        className="w-full h-full"
                        resizeMode="contain"
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}