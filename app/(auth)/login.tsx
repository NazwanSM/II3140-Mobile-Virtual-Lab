import { signInWithGoogle, signInWithUsername } from '@/lib';
import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

const logoAksara = require('@/assets/images/LogoAksaraMedium.png');
const characterMonster = require('@/assets/images/Monster-Login.png');

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const translateY = useSharedValue(SCREEN_HEIGHT);

    useEffect(() => {
        
        setTimeout(() => {
            translateY.value = withSpring(0, {
                damping: 20,
                stiffness: 90,
                mass: 1,
            });
        }, 200);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bottomSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const handleLogin = async () => {
        if (!username || !password) {
        setError('Mohon isi semua field');
        return;
        }

        setLoading(true);
        setError('');

        const result = await signInWithUsername(username, password);

        if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
        }

        setLoading(false);
        router.replace('/(tabs)');
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        const result = await signInWithGoogle();

        if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
        }

        setLoading(false);
        router.replace('/(tabs)');
    };

    return (
        <View className="flex-1 bg-[#FCC212]">
        <StatusBar barStyle="dark-content" backgroundColor="#FCC212" />
        
        <Image
            source={require('@/assets/images/Background-Login.png')}
            className="absolute w-full h-full"
            resizeMode="cover"
            fadeDuration={0}
        />
        
        <SafeAreaView className="flex-1" edges={['top']}>
            <View className="mt-4 items-end w-full px-6">
                <Image 
                source={logoAksara}
                className="w-32 h-32"
                resizeMode="contain"
                />
            </View>

            <Animated.View 
                style={[
                bottomSheetStyle,
                { 
                    height: SHEET_HEIGHT,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                }
                ]}
            >
                <View style={{ position: 'absolute', left: 12, top: -40, zIndex: 30 }}>
                    <Image 
                    source={characterMonster}
                    className="w-40 h-40"
                    resizeMode="contain"
                    />
                </View>

                <Image
                source={require('@/assets/images/Card-Shape.png')}
                className="absolute w-full h-full"
                resizeMode="stretch"
                />
                
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    >
                    <View className="p-8 pt-24">
                    <Text className="text-2xl font-satoshi-bold text-center text-foundation-blue-darker mb-6">
                    Masuk
                    </Text>

                    {error ? (
                    <View className="bg-foundation-red-light p-3 rounded-lg mb-4">
                        <Text className="text-foundation-red-normal text-center font-satoshi">{error}</Text>
                    </View>
                    ) : null}

                    <View className="mb-4">
                    <Text className="text-foundation-blue-darker font-satoshi-medium mb-2">
                        Email atau Username <Text className="text-foundation-red-normal">*</Text>
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                        <Ionicons name="at" size={20} color="#000000" />
                        <TextInput
                        className="flex-1 text-gray-800 font-satoshi text-base ml-3"
                        placeholder="Masukkan email atau username"
                        placeholderTextColor="#000000"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        keyboardType="default"
                        />
                    </View>
                    </View>

                    <View className="mb-2">
                    <Text className="text-foundation-blue-darker font-satoshi-medium mb-2">
                        Kata Sandi <Text className="text-foundation-red-normal">*</Text>
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                        <Ionicons name="lock-closed" size={20} color="#000000" />
                        <TextInput
                        className="flex-1 text-gray-800 font-satoshi text-base ml-3"
                        placeholder="Masukkan Kata Sandi"
                        placeholderTextColor="#000000"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons 
                            name={showPassword ? "eye" : "eye-off"} 
                            size={22} 
                            color="#000000" 
                        />
                        </Pressable>
                    </View>
                    </View>

                    <Pressable className="self-end mb-6">
                    <Text className="text-foundation-red-normal font-satoshi-medium">
                        Lupa kata sandi?
                    </Text>
                    </Pressable>

                    <Pressable 
                    onPress={handleLogin}
                    disabled={loading}
                    className="w-full bg-[#F8AA2D] py-4 rounded-xl items-center active:opacity-80 disabled:opacity-60"
                    >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-base font-satoshi-bold">
                        Masuk
                        </Text>
                    )}
                    </Pressable>

                    <View className="flex-row items-center my-6">
                    <View className="flex-1 h-px bg-gray-300" />
                    <Text className="mx-4 text-gray-400 font-satoshi">Atau</Text>
                    <View className="flex-1 h-px bg-gray-300" />
                    </View>

                    <Pressable 
                    onPress={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white py-4 rounded-xl items-center border border-gray-300 flex-row justify-center active:opacity-80"
                    >
                    <Image 
                        source={require('@/assets/images/Google-Icon.png')}
                        className="w-5 h-5 mr-3"
                        resizeMode="contain"
                    />
                    <Text className="text-gray-700 text-base font-satoshi-medium">
                        Masuk Menggunakan Google
                    </Text>
                    </Pressable>

                    <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-600 font-satoshi">
                        Belum punya akun?{' '}
                    </Text>
                    <Pressable onPress={() => router.push('/(auth)/register' as Href)}>
                        <Text className="text-foundation-blue-darker font-satoshi-bold underline">
                        Buat akunmu
                        </Text>
                    </Pressable>
                    </View>
                </View>
                </ScrollView>
                </KeyboardAvoidingView>
            </Animated.View>
        </SafeAreaView>
        </View>
    );
}
