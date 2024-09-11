import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { CircularCarousel } from '@/src/components/onboarding/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();

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
          // Not first time, redirect to auth
          setFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    checkFirstLaunch();
  }, []);

  // Redirect to the authentication screen if not the first launch
  useEffect(() => {
    if (firstLaunch === false) {
      router.push('/(auth)');
    }
  }, [firstLaunch, navigation]);

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
