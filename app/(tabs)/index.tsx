import { getDashboardStats, getProfile } from '@/lib';
import { useFocusEffect, useRouter } from 'expo-router';
import { School } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '../../components/BottomNavbar';
import DashboardCard from '../../components/DashboardCard';
import ProgressCard from '../../components/ProgressCard';

export default function HomeScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState({ 
    name: '', 
    points: 0,
    school: '',
    username: '',
  });
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    belajar: { completed: 0, total: 3 },
    latihan: { completed: 0, total: 3 },
    bermain: { completed: 0, total: 2 },
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const [profile, stats] = await Promise.all([
        getProfile(),
        getDashboardStats(),
      ]);
      
      if (profile) {
        setUserData({
          name: profile.full_name || 'User',
          points: profile.tinta || 0,
          school: profile.institution || 'Belum diatur',
          username: profile.username || '',
        });
      }

      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

return (
  <View className="flex-1 bg-white">
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

    <SafeAreaView className="flex-1" edges={['bottom']}>
      
        
        <View className="pt-16 px-6 relative overflow-hidden">
          <Image
            source={require('../../assets/images/Background-Header.png')}
            className="absolute top-0 left-0 right-0 bottom-0 w-[112%] h-[160%] translate-x-0 -translate-y-1 rounded-b-[30px]"
            resizeMode="cover"
          />
          
          {loading ? (
            <View className="flex-row items-center justify-center py-8">
              <ActivityIndicator size="large" color="#8B7355" />
            </View>
          ) : (
            <View className="flex-row items-start">
              <Pressable 
                onPress={() => router.push('/(tabs)/profile')}
                className="w-16 h-full mr-4"
              >
                <View className="overflow-hidden items-center justify-center">
                  <Image 
                    source={require('../../assets/images/Profile - Men.png')} 
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </View>
              </Pressable>
              <Pressable 
                onPress={() => router.push('/(tabs)/profile')}
                className="flex-1 z-10"
              >
                <Text className="text-xs text-foundation-yellow-dark font-satoshi-medium italic">
                  Halo, selamat datang kembali
                </Text>
                <Text className="text-lg font-satoshi-bold text-foundation-yellow-darker mt-0.5" >
                  {userData.name}
                </Text>

                <View className="flex-row items-center mt-1 opacity-80">
                  <School size={14} color="#BD920E" strokeWidth={2}/>
                  <Text className="text-[10px] font-satoshi-medium text-foundation-yellow-dark ml-1">
                    {userData.school}
                  </Text>
                </View>

                <View className="flex-row items-center bg-foundation-yellow-light/50 px-3 py-1.5 rounded-full self-start mt-2 shadow-sm">
                  <Image
                    source={require('../../assets/images/tintaLogo.png')}
                    className="w-5 h-5 mr-1 bg-white rounded-full p-0.5"
                    resizeMode="contain"
                  />
                  <Text className="text-xs font-satoshi-bold text-foundation-yellow-darker">
                    {userData.points.toLocaleString('id-ID')} 
                  </Text>
                </View>
              </Pressable>

              <View className="w-28 h-28 -mt-1.4 -mr-6">
                <Image 
                  source={require('../../assets/images/Header.png')} 
                  className="w-full h-full rounded-b-[30px]"
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="px-8 mt-5">
            <Text className="text-xl font-satoshi-bold text-black mb-3">Jejak Belajar Terbaru</Text>
          
            <ProgressCard 
              title="Ejaan"
              date="11/20/2025"
              progress={27}
              badge="Belajar"
              badgeColor="yellow"
            />
          
            <ProgressCard 
              title="Kalimat Efektif"
              date="11/20/2025"
              progress={50}
              badge="Latihan"
              badgeColor="red"
            />

            <Text className="text-xl font-satoshi-bold text-black mb-3 mt-6">Jelajahi Fitur Aksara</Text>
          
            <View>
              <DashboardCard 
                title="Belajar"
                description="Pelajari modul - modul Aksara yang menarik!"
                imageSource={require('../../assets/images/BELAJAR.png')}
                href="/belajar"
                gradientColors={['#7A96E3', '#5A8BEE']}
                completed={dashboardStats.belajar.completed}
                total={dashboardStats.belajar.total}
              />

              <DashboardCard 
                title="Latih"
                description="Latih pemahamanmu dengan kuis menantang by Aksara"
                imageSource={require('../../assets/images/LATIH.png')}
                href="/latihan"
                gradientColors={['#D45272', '#813855']}
                completed={dashboardStats.latihan.completed}
                total={dashboardStats.latihan.total}
              />

              <DashboardCard 
                title="Main"
                description="Latih pemahamanmu dengan bermain bersama Aksara"
                imageSource={require('../../assets/images/MAIN.png')}
                href="/bermain"
                gradientColors={['#DCC37B', '#B39246']}
                completed={dashboardStats.bermain.completed}
                total={dashboardStats.bermain.total}
              />
            </View>
          </View>

          <View className="h-5" />
        </ScrollView>

        <BottomNavbar />
      </SafeAreaView>
    </View>
  );
}