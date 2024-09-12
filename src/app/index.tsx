import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { CircularCarousel } from '@/src/components/onboarding/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const data = [
  require('@/assets/iconOB/learn.png'),
  require('@/assets/iconOB/vg.png'),
  require('@/assets/iconOB/resources.png'),
  require('@/assets/iconOB/skill.png'),
  require('@/assets/iconOB/final.png'),
];

export default function App() {
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);

  // Check if it's the first time the app is launched
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          // First time launch, show the onboarding
          await AsyncStorage.setItem('hasLaunched', 'true');
          setFirstLaunch(true);
        } else {
          // Not first time, redirect to auth immediately
          router.replace('/(auth)');
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    checkFirstLaunch();
  }, []);

  // Show loading indicator while checking first launch
  if (firstLaunch === null) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  // Render CircularCarousel if it's the first launch
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <CircularCarousel data={data} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
