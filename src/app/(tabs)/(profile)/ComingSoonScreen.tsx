import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '@/src/components/BackButton';

export default function ComingSoonScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button in the top left */}
      <View style={styles.headerContainer}>
        <BackButton />
      </View>

      {/* Centered "Coming Soon" Text */}
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Coming Soon!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#898989',
  },
  headerContainer: {
    position: 'absolute',
    top: 50, // You can adjust this to fit your layout
    left: 20,
    zIndex: 1, // Make sure the button is above the content
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
