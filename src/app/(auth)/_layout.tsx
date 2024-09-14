import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import React from 'react';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/(learn)" />;
  }

  return <Stack screenOptions={{headerShown:false}}/>;
}
