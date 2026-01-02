import { getProfile } from '@/lib/actions/auth';
import { updateProfile } from '@/lib/actions/profile';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        institution: '',
    });

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const profileData = await getProfile();
            
            if (profileData) {
                setProfile(profileData);
                setFormData({
                    full_name: profileData.full_name || '',
                    username: profileData.username || '',
                    institution: profileData.institution || '',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSave = () => {
        if (!formData.full_name.trim()) {
            Alert.alert('Error', 'Nama lengkap tidak boleh kosong');
            return;
        }

        if (!formData.username.trim()) {
            Alert.alert('Error', 'Username tidak boleh kosong');
            return;
        }

        setShowConfirmModal(true);
    };

    const confirmSave = async () => {
        setShowConfirmModal(false);
        
        try {
            setSaving(true);
            const result = await updateProfile({
                full_name: formData.full_name.trim(),
                username: formData.username.trim(),
                institution: formData.institution.trim(),
            });

            if (result.success) {
                Alert.alert('Berhasil', 'Profile berhasil diupdate!', [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]);
            } else if (result.error === 'Username sudah digunakan') {
                Alert.alert('Error', 'Username sudah digunakan oleh user lain');
            } else {
                Alert.alert('Error', 'Gagal mengupdate profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Terjadi kesalahan saat mengupdate profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#F9C74E" />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen 
                options={{
                    headerShown: false,
                    presentation: 'card',
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                }}
            />
            <View className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                
                <SafeAreaView className="flex-1" edges={['bottom']}>
                    <View className="pt-16 px-6 pb-4">
                        <View className="flex-row items-center justify-between">
                            <Pressable 
                                onPress={() => router.back()}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Ionicons name="chevron-back" size={20} color="#000000" />
                            </Pressable>

                            <Text className="flex-1 text-center text-base font-satoshi-bold text-gray-900 mx-4">
                                Edit Profil
                            </Text>

                            <View className="w-10" />
                        </View>
                    </View>

                    <View className="h-[1px] bg-gray-200 mx-6" />

                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                    >
                        <View className="items-center py-8">
                            <View className="relative">
                                <View className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                                    <Image 
                                        source={require('../../assets/images/Profile - Men 2.png')}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                                <View className="absolute bottom-0 right-0 bg-[#F9C74E] w-10 h-10 rounded-full items-center justify-center border-2 border-white">
                                    <Ionicons name="pencil" size={20} color="#000000" />
                                </View>
                            </View>
                        </View>

                        <View className="px-6 pb-6">
                            <View className="mb-6">
                                <Text className="text-sm font-satoshi-bold text-gray-900 mb-2">
                                    Nama Lengkap
                                </Text>
                                <TextInput
                                    value={formData.full_name}
                                    onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                                    placeholder="Masukkan nama lengkap"
                                    className="bg-foundation-yellow-light px-4 py-3.5 rounded-xl text-gray-900 font-satoshi-medium"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-satoshi-bold text-gray-900 mb-2">
                                    Username
                                </Text>
                                <View className="bg-foundation-yellow-light px-4 py-3.5 rounded-xl flex-row items-center">
                                    <Text className="text-gray-900 font-satoshi-medium mr-1">@</Text>
                                    <TextInput
                                        value={formData.username}
                                        onChangeText={(text) => setFormData({ ...formData, username: text.replace(/[^a-zA-Z0-9_]/g, '') })}
                                        placeholder="username"
                                        className="flex-1 text-gray-900 font-satoshi-medium"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-satoshi-bold text-gray-900 mb-2">
                                    Institusi
                                </Text>
                                <TextInput
                                    value={formData.institution}
                                    onChangeText={(text) => setFormData({ ...formData, institution: text })}
                                    placeholder="Masukkan nama institusi"
                                    className="bg-foundation-yellow-light px-4 py-3.5 rounded-xl text-gray-900 font-satoshi-medium"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-satoshi-bold text-gray-900 mb-2">
                                    Alamat Email
                                </Text>
                                <View className="bg-gray-100 px-4 py-3.5 rounded-xl">
                                    <Text className="text-gray-500 font-satoshi-medium">
                                        {profile?.email || ''}
                                    </Text>
                                </View>
                                <Text className="text-xs text-gray-500 font-satoshi-medium mt-1">
                                    Email tidak dapat diubah
                                </Text>
                            </View>

                            {/* Save Button */}
                            <Pressable
                                onPress={handleSave}
                                disabled={saving}
                                className="bg-foundation-yellow-normal py-2 rounded-xl mt-4 mx-4"
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                {saving ? (
                                    <ActivityIndicator size="small" color="#000000" />
                                ) : (
                                    <Text className="text-center font-satoshi-bold text-white text-base">
                                        Simpan
                                    </Text>
                                )}
                            </Pressable>
                        </View>

                        <View className="h-8" />
                    </ScrollView>
                </SafeAreaView>

                <Modal
                    visible={showConfirmModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowConfirmModal(false)}
                >
                    <View className="flex-1 bg-black/50 items-center justify-center px-6">
                        <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
                            <Pressable 
                                onPress={() => setShowConfirmModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 items-center justify-center"
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </Pressable>

                            <Text className="text-lg font-satoshi-bold text-gray-900 text-center mb-6 mt-2">
                                Apakah kamu yakin ingin{'\n'}menyimpan perubahan?
                            </Text>

                            <View className="flex-row gap-3">
                                <Pressable
                                    onPress={() => setShowConfirmModal(false)}
                                    className="flex-1 bg-white border-2 border-foundation-yellow-normal py-3 rounded-xl"
                                    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                                >
                                    <Text className="text-center font-satoshi-bold text-foundation-yellow-normal">
                                        Batalkan
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={confirmSave}
                                    className="flex-1 bg-foundation-yellow-normal py-3 rounded-xl"
                                    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                                >
                                    <Text className="text-center font-satoshi-bold text-white">
                                        Yakin
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
}
