import React from 'react'
import {SafeAreaView} from 'react-native'
import {Stack} from 'expo-router'
import {StatusBar} from 'expo-status-bar';

const ResourcesStack = () => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <StatusBar style='dark' backgroundColor='white'/>
            <Stack screenOptions={{headerShown: false}}/>
        </SafeAreaView>
    )
}

export default ResourcesStack