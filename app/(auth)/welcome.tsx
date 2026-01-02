import { Image as ExpoImage } from 'expo-image';
import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Platform, Pressable, StatusBar, Text, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const logoAksara = require('@/assets/images/LogoAksaraMedium.png');
const characterWelcome = require('@/assets/images/Welcome.png');
const isWeb = Platform.OS === 'web';

export default function WelcomeScreen() {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const contentOpacity = useSharedValue(1);
    const contentScale = useSharedValue(1);

    useFocusEffect(
        useCallback(() => {
            contentOpacity.value = withSpring(1);
            contentScale.value = withSpring(1);
            setIsTransitioning(false);
        }, [])
    );

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{ scale: contentScale.value }],
    }));

    const handleNavigateToLogin = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        contentOpacity.value = withTiming(0, { duration: 300 });
        contentScale.value = withTiming(0.95, { duration: 300 }, (finished) => {
            if (finished) {
                runOnJS(router.push)('/(auth)/login' as Href);
            }
        });
    };

    const handleNavigateToRegister = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        contentOpacity.value = withTiming(0, { duration: 300 });
        contentScale.value = withTiming(0.95, { duration: 300 }, (finished) => {
            if (finished) {
                runOnJS(router.push)('/(auth)/register' as Href);
            }
        });
    };

    return (
        <View className="flex-1 bg-[#FCC212]">
        <StatusBar barStyle="dark-content" backgroundColor="#F9C74E" />
        <ExpoImage
                source={require('@/assets/images/Background-Login.png')} 
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                contentFit="cover"
                transition={300} 
                cachePolicy="memory-disk"
            />
        <SafeAreaView className="flex-1">
            <View className="mt-4 items-end w-full px-6">
                <Image 
                source={logoAksara}
                className="w-32 h-32"
                style={isWeb ? { width: 80, height: 80 } : undefined}
                resizeMode="contain"
                />
            </View>
            <Animated.View style={contentAnimatedStyle} className="flex-1 items-center px-6">

            <Text className="text-4xl text-foundation-yellow-darker mt-6 pt-10 font-satoshi-bold">
                Selamat datang
            </Text>

            <View className="flex-1 justify-center items-center">
                <Image 
                source={characterWelcome}
                className="w-72 h-96"
                style={isWeb ? { width: 200, height: 280 } : undefined}
                resizeMode="contain"
                />
            </View>

            <View className="w-full mb-8 gap-3">
                <Pressable 
                onPress={handleNavigateToLogin}
                disabled={isTransitioning}
                className="w-full bg-foundation-yellow-darker py-4 rounded-xl items-center active:opacity-80"
                >
                <Text className="text-white text-base font-satoshi-medium">
                    Masuk ke Akunmu
                </Text>
                </Pressable>

                <Pressable 
                onPress={handleNavigateToRegister}
                disabled={isTransitioning}
                className="w-full bg-white py-4 rounded-xl items-center border border-gray-200 active:opacity-80"
                >
                <Text className="text-foundation-yellow-darker text-base font-satoshi-medium">
                    Buat Akun
                </Text>
                </Pressable>
            </View>
            </Animated.View>
        </SafeAreaView>
        </View>
    );
}
