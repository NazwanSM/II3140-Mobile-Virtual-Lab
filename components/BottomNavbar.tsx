import { Ionicons } from '@expo/vector-icons';
import { Href, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NavItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    isActive: boolean;
    onPress: () => void;
};

function NavItem({ icon, label, isActive, onPress }: NavItemProps) {
    const scale = useSharedValue(1);
    const width = useSharedValue(isActive ? 85 : 26);
    const opacity = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        if (isActive) {
            width.value = withSpring(85, {
                damping: 20,
                stiffness: 180,
            });
            opacity.value = withSpring(1, {
                damping: 20,
                stiffness: 180,
            });
        } else {
            width.value = 26;
            opacity.value = 0;
        }
    }, [isActive, opacity, width]);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const pillStyle = useAnimatedStyle(() => ({
        width: width.value,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.92, { damping: 10, stiffness: 500 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 500 });
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={containerStyle}
            className="items-center justify-center w-[85px] h-[50px]"
        >
            <Animated.View
                style={[
                    pillStyle,
                    {
                        backgroundColor: 'white',
                        borderRadius: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: isActive ? 10 : 0,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isActive ? 0.15 : 0,
                        shadowRadius: 3.84,
                        elevation: isActive ? 5 : 0,
                    },
                ]}
            >
                <Ionicons
                    name={icon}
                    size={24}
                    color={isActive ? '#F9C74E' : '#9CA3AF'}
                />
                {isActive && (
                    <Animated.Text
                        style={[
                            textStyle,
                            {
                                fontFamily: 'Satoshi-Bold',
                                fontSize: 11,
                                color: '#F9C74E',
                                marginLeft: 6,
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {label}
                    </Animated.Text>
                )}
            </Animated.View>
        </AnimatedPressable>
    );
}

export default function BottomNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (paths: string[]) => 
        paths.some(path => pathname === path || pathname.endsWith(path));

    const navItems = [
        {
            icon: 'home' as const,
            label: 'Beranda',
            paths: ['/', '/index', '/(tabs)', '/(tabs)/index'],
            route: '/(tabs)' as const,
        },
        {
            icon: 'book' as const,
            label: 'Belajar',
            paths: ['/belajar', '/(tabs)/belajar'],
            route: '/(tabs)/belajar' as const,
        },
        {
            icon: 'game-controller' as const,
            label: 'Main',
            paths: ['/bermain', '/(tabs)/bermain'],
            route: '/(tabs)/bermain' as const,
        },
        {
            icon: 'person' as const,
            label: 'Profil',
            paths: ['/profile', '/(tabs)/profile'],
            route: '/(tabs)/profile' as const,
        },
    ];

    return (
        <View className="bg-white border-t border-gray-200 flex-row justify-between items-center py-2 px-4">
            {navItems.map((item) => (
                <NavItem
                    key={item.route}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive(item.paths)}
                    onPress={() => router.push(item.route as Href)}
                />
            ))}
        </View>
    );
}
