import { Stack } from "expo-router";
import { SafeAreaView, Platform } from "react-native";
import { StatusBar } from 'expo-status-bar';
import React from "react";

export default function ProfileLayout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3DB2FF' }}>
            <Stack screenOptions={{
                headerShown: false, ...Platform.select({
                    android: {
                        statusBarColor: '#3DB2FF',
                        statusBarStyle: 'light',
                    },
                })
            }} />
        </SafeAreaView>
    )
}