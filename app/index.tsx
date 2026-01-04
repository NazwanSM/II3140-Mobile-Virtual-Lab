import { getSession } from '@/lib';
import { Image as ExpoImage } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const GUNUNGAN_SIZE = 140;
const LOGO_SIZE = 220;
const TEXT_HEIGHT = 90;
const TEXT_WIDTH = 280;
const LOGO_FINAL_SIZE = isWeb ? 80 : 111;
const OVERLAP = 120;
const COMBINED_WIDTH = GUNUNGAN_SIZE + TEXT_WIDTH - OVERLAP;
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;

const logoGunungan = require('@/assets/images/logo-aksara-tanpatulisan.png');
const logoTulisan = require('@/assets/images/logo-aksara-tulisan.png');
const logoFull = require('@/assets/images/LogoAksaraMedium.png');

export default function Index() {
    const insets = useSafeAreaInsets();
    const FINAL_X = SCREEN_WIDTH - LOGO_FINAL_SIZE - 22;
    const FINAL_Y = insets.top + 14.5;

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [splashComplete, setSplashComplete] = useState(false);
    const [phase, setPhase] = useState(1);

    const phase1Progress = useSharedValue(0);
    const phase2Progress = useSharedValue(0);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const session = await getSession();
        const authenticated = !!session;
        setIsAuthenticated(authenticated);

        if (!authenticated) {
            startSplashAnimation();
        }
    };

    const navigateToWelcome = () => {
        setSplashComplete(true);
        router.replace('/(auth)/welcome');
    };

    
    const startSplashAnimation = () => {
        phase1Progress.value = withDelay(
            800,
            withTiming(1, {
                duration: 900,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }, (finished) => {
                if (finished) {
                    runOnJS(startPhase2)();
                }
            })
        );
    };
    
    const startPhase2 = () => {
        setPhase(3);
        phase2Progress.value = withDelay(
            600,
            withTiming(1, {
                duration: 1000,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }, (finished) => {
                if (finished) {
                    runOnJS(navigateToWelcome)();
                }
            })
        );
    };
    
    const gununganStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            phase1Progress.value,
            [0, 1],
            [CENTER_X - GUNUNGAN_SIZE / 2, CENTER_X - COMBINED_WIDTH / 2]
        );

        return {
            position: 'absolute',
            width: GUNUNGAN_SIZE,
            height: GUNUNGAN_SIZE,
            left: translateX,
            top: CENTER_Y - GUNUNGAN_SIZE / 2,
            zIndex: 10,
        };
    });

    const textStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            phase1Progress.value,
            [0.3, 0.8],
            [0, 1]
        );

        const translateX = interpolate(
            phase1Progress.value,
            [0.3, 1],
            [CENTER_X + 50, CENTER_X - COMBINED_WIDTH / 2 + GUNUNGAN_SIZE - OVERLAP]
        );

        return {
            position: 'absolute',
            width: TEXT_WIDTH,
            height: TEXT_HEIGHT,
            left: translateX,
            top: CENTER_Y - TEXT_HEIGHT / 2 - 10,
            opacity,
            zIndex: 15,
        };
    });

    const combinedCenterX = CENTER_X - COMBINED_WIDTH / 2;

    const fullLogoStyle = useAnimatedStyle(() => {
        const size = interpolate(
            phase2Progress.value,
            [0, 1],
            [LOGO_SIZE, LOGO_FINAL_SIZE]
        );

        const translateX = interpolate(
            phase2Progress.value,
            [0, 1],
            [combinedCenterX, FINAL_X]
        );

        const translateY = interpolate(
            phase2Progress.value,
            [0, 1],
            [CENTER_Y - LOGO_SIZE / 2, FINAL_Y]
        );

        const opacity = interpolate(
            phase2Progress.value,
            [0, 0.1],
            [0, 1]
        );

        return {
            position: 'absolute',
            width: size,
            height: size,
            left: translateX,
            top: translateY,
            opacity,
            zIndex: 20,
        };
    }, [FINAL_X, FINAL_Y, combinedCenterX]);

    const hidePhase1Style = useAnimatedStyle(() => {
        const opacity = interpolate(
            phase2Progress.value,
            [0, 0.1],
            [1, 0]
        );
        return { opacity };
    });

    if (isAuthenticated === null) {
        return (
            <View className="flex-1 bg-[#FCC212]">
                <ExpoImage
                    source={require('@/assets/images/Background-Login.png')}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                />
            </View>
        );
    }

    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />;
    }

    if (splashComplete) {
        return <Redirect href="/(auth)/welcome" />;
    }

    return (
        <View className="flex-1 bg-[#FCC212]">
            <ExpoImage
                source={require('@/assets/images/Background-Login.png')}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                contentFit="cover"
                cachePolicy="memory-disk"
            />

            <Animated.View style={hidePhase1Style}>
                <Animated.View style={gununganStyle}>
                    <Image
                        source={logoGunungan}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="contain"
                    />
                </Animated.View>
                <Animated.View style={textStyle}>
                    <Image
                        source={logoTulisan}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="contain"
                    />
                </Animated.View>
            </Animated.View>

            {phase === 3 && (
                <Animated.View style={fullLogoStyle}>
                    <Image
                        source={logoFull}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="contain"
                    />
                </Animated.View>
            )}
        </View>
    );
}
