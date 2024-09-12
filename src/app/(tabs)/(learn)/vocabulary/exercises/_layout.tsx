import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native'

const ExercisesStack = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  )
}

export default ExercisesStack
