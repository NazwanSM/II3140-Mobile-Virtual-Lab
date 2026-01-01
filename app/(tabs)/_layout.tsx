import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="belajar"
        options={{
          title: 'Belajar',
        }}
      />
      <Tabs.Screen
        name="latihan"
        options={{
          title: 'Latihan',
        }}
      />
      <Tabs.Screen
        name="sosial"
        options={{
          title: 'Sosial',
        }}
      />
    </Tabs>
  );
}
