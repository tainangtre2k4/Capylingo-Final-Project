import React from 'react'
import {Stack} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
export default function _layout() {
  return (
    <>
      {Platform.OS === "ios" && (
          <StatusBar style="light" backgroundColor="#3DB2FF" />
      )}
      <Stack screenOptions={{
          headerShown:true,
      }}/>
    </>
  )
}