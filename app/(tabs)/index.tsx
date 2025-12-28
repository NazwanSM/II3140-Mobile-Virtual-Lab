import { getProfile } from '@/lib';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '../../components/BottomNavbar';
import DashboardCard from '../../components/DashboardCard';
import ProgressCard from '../../components/ProgressCard';

export default function HomeScreen() {
  const [userData, setUserData] = useState({ 
    name: '', 
    points: 0,
    school: '',
    username: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await getProfile();
      
      if (profile) {
        setUserData({
          name: profile.full_name || 'User',
          points: profile.tinta || 0,
          school: profile.institution || 'Belum diatur',
          username: profile.username || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

return (
  <View className="flex-1 bg-white">
    <StatusBar barStyle="dark-content" backgroundColor="#F9C74E" translucent={true} />

    <SafeAreaView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* Header Section */}
        <View className="bg-foundation-yellow-normal pt-4 pb-8 rounded-b-[40px] px-6 relative overflow-visible">
          
          {loading ? (
            <View className="flex-row items-center justify-center py-8">
              <ActivityIndicator size="large" color="#B39246" />
            </View>
          ) : (
            <View className="flex-row items-start">
              <View className="w-16 h-full mr-4 ">
                <View className="overflow-hidden items-center justify-center">
                  <Image 
                    source={require('../../assets/images/Profile - Men.png')} 
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View className="flex-1 z-10">
                <Text className="text-xs text-foundation-yellow-darker/80 font-satoshi-medium italic">
                  Halo, selamat datang kembali
                </Text>
                <Text className="text-xl font-satoshi-black text-foundation-yellow-darker mt-0.5">
                  {userData.name}
                </Text>

                <View className="flex-row items-center mt-1 opacity-80">
                  <Text className="text-xs mr-1">🏫</Text>
                  <Text className="text-[10px] font-satoshi-medium text-foundation-yellow-darker">
                    {userData.school}
                  </Text>
                </View>

                <View className="flex-row items-center bg-white px-3 py-1.5 rounded-full self-start mt-2 shadow-sm border border-foundation-yellow-light">
                  <Text className="text-sm mr-1.5">🪶</Text>
                  <Text className="text-xs font-satoshi-bold text-foundation-yellow-darker">
                    {userData.points.toLocaleString('id-ID')} XP
                  </Text>
                </View>
              </View>

              <View className="absolute -right-10 -bottom-12 w-40 h-48">
                <Image 
                  source={require('../../assets/images/Header.png')} 
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>

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
                completed={3}
                total={3}
              />

              <DashboardCard 
                title="Latih"
                description="Latih pemahamanmu dengan kuis menantang by Aksara"
                imageSource={require('../../assets/images/LATIH.png')}
                href="/latihan"
                gradientColors={['#D45272', '#813855']}
                completed={2}
                total={3}
              />

              <DashboardCard 
                title="Main"
                description="Lebih paham lembuat dengan bermain bersama Aksara"
                imageSource={require('../../assets/images/MAIN.png')}
                href="/bermain"
                gradientColors={['#DCC37B', '#B39246']}
                completed={1}
                total={3}
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