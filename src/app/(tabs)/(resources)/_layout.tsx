import React from 'react'
import { SafeAreaView, Platform } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar';

const ResourcesStack = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar style='dark' backgroundColor='white' />
            <Stack screenOptions={{
                headerShown: false, ...Platform.select({
                    android: {
                        statusBarColor: 'white',
                        statusBarStyle: 'dark',
                    }
                })
            }} />
        </SafeAreaView>
    )
}

export default ResourcesStack