import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
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
import { resetPassword } from '@/lib/actions/auth';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

const logoAksara = require('@/assets/images/LogoAksaraMedium.png');
const characterMonster = require('@/assets/images/Monster-Login.png');
const isWeb = Platform.OS === 'web';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const translateY = useSharedValue(SCREEN_HEIGHT);
    const logoOpacity = useSharedValue(0);

    useEffect(() => {
        logoOpacity.value = withSpring(1, { damping: 20, stiffness: 90 });
        setTimeout(() => {
            translateY.value = withSpring(0, {
                damping: 20,
                stiffness: 90,
                mass: 1,
            });
        }, 100);
    }, []);

    const bottomSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
    }));

    const handleResetPassword = async () => {
        if (!email.trim()) {
            setError('Email atau username harus diisi');
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError('Mohon isi semua field');
            return;
        }

        if (newPassword.length < 6) {
            setError('Kata sandi minimal 6 karakter');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Kata sandi tidak cocok');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        const result = await resetPassword(email, newPassword);

        setLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        setSuccess(true);
        setTimeout(() => {
            router.push('/(auth)/login' as Href);
        }, 2000);
    };

    return (
        <View className="flex-1 bg-[#FCC212]">
            <StatusBar barStyle="dark-content" backgroundColor="#FCC212" />
            
            <ExpoImage
                source={require('@/assets/images/Background-Login.png')} 
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                contentFit="cover"
                transition={300} 
                cachePolicy="memory-disk"
            />
            
            <SafeAreaView className="flex-1" edges={['top']}>
                <Animated.View style={logoAnimatedStyle} className="mt-4 items-end w-full px-6">
                    <Image 
                        source={logoAksara}
                        className="w-32 h-32"
                        style={isWeb ? { width: 80, height: 80 } : undefined}
                        resizeMode="contain"
                    />
                </Animated.View>

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
                            style={isWeb ? { width: 100, height: 100 } : undefined}
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
                                <Text className="text-2xl font-satoshi-bold text-center text-foundation-blue-darker mb-4">
                                    Buat Kata Sandi Baru
                                </Text>

                                <Text className="text-sm font-satoshi text-gray-400 mb-4">
                                    Buat kata sandi baru untuk akunmu.
                                </Text>

                                {error ? (
                                    <View className="bg-foundation-red-light p-3 rounded-lg mb-4">
                                        <Text className="text-foundation-red-normal text-center font-satoshi">{error}</Text>
                                    </View>
                                ) : null}

                                {success ? (
                                    <View className="bg-green-100 p-4 rounded-lg mb-4">
                                        <Text className="text-green-800 text-center font-satoshi-medium mb-2">
                                            Password berhasil direset!
                                        </Text>
                                        <Text className="text-green-700 text-center font-satoshi text-sm">
                                            Anda akan dialihkan ke halaman login...
                                        </Text>
                                    </View>
                                ) : null}

                                <View className="mb-4">
                                    <Text className="text-base font-satoshi-medium mb-2 text-foundation-blue-darker">
                                        Email atau Username
                                    </Text>
                                    <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
                                        <Ionicons name="mail" size={20} color="#000000" />
                                        <TextInput
                                            className="flex-1 text-gray-800 font-satoshi-medium ml-3"
                                            placeholder="Masukkan email atau username"
                                            placeholderTextColor="#9CA3AF"
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            autoCorrect={false}
                                            editable={!success}
                                        />
                                    </View>
                                </View>

                                <View className="mb-4">
                                    <Text className="text-base font-satoshi-medium mb-2 text-foundation-blue-darker">
                                        Kata Sandi Baru
                                    </Text>
                                    <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
                                        <Ionicons name="lock-closed" size={20} color="#000000" />
                                        <TextInput
                                            className="flex-1 text-gray-800 font-satoshi-medium ml-3"
                                            placeholder="Masukkan kata sandi baru"
                                            placeholderTextColor="#9CA3AF"
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            secureTextEntry={!showNewPassword}
                                            autoCapitalize="none"
                                            editable={!success}
                                        />
                                        <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                                            <Ionicons 
                                                name={showNewPassword ? "eye-outline" : "eye-off-outline"} 
                                                size={20} 
                                                color="#6B7280" 
                                            />
                                        </Pressable>
                                    </View>
                                </View>

                                <View className="mb-6">
                                    <Text className="text-base font-satoshi-medium mb-2 text-foundation-blue-darker">
                                        Konfirmasi Kata Sandi
                                    </Text>
                                    <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
                                        <Ionicons name="lock-closed" size={20} color="#000000" />
                                        <TextInput
                                            className="flex-1 text-gray-800 font-satoshi-medium ml-3"
                                            placeholder="Konfirmasi kata sandi baru"
                                            placeholderTextColor="#9CA3AF"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry={!showConfirmPassword}
                                            autoCapitalize="none"
                                            editable={!success}
                                        />
                                        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <Ionicons 
                                                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                                                size={20} 
                                                color="#6B7280" 
                                            />
                                        </Pressable>
                                    </View>
                                </View>

                                <Pressable 
                                    onPress={handleResetPassword}
                                    disabled={loading || success}
                                    className="w-full bg-[#F8AA2D] py-4 rounded-xl items-center active:opacity-80 disabled:opacity-60"
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 3,
                                        elevation: 2,
                                    }}
                                    >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text className="text-white text-base font-satoshi-bold">
                                            {success ? 'Berhasil' : 'Reset Password'}
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
