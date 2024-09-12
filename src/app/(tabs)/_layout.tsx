import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Tabs, useSegments } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

export default function TabsLayout(){
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)" />;
    }
    const segment = useSegments();

    const page = segment.join('/')
    const pagesToHideTabBar = ['skillcheck/reading', 'skillcheck/listening', 'resultScreen', 'vocabulary/learnVocab', 'vocabulary/exercises', 'grammar/learnGrammar', 'grammar/exercises']

    const checkPageToHideTabBar = (): boolean => {
        for (const s of pagesToHideTabBar)
          if (page.includes(s))
            return true;
        return false;
      };
    return(
        <Tabs initialRouteName="(learn)" screenOptions={{tabBarHideOnKeyboard: true, headerShown: false}}>
            <Tabs.Screen
                name="(learn)"
                options={{
                    headerTransparent: true,
                    headerTitle: '',
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="book-open-page-variant-outline" size={size} color="3DB2FF" />,
                    tabBarLabel: 'Learn',
                    tabBarStyle: { display: checkPageToHideTabBar() ? 'none' : 'flex' }
                }}
            />
            <Tabs.Screen
                name="(dictionary)"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="file-tray-full" size={size} color="3DB2FF" />,
                    tabBarLabel: 'Dictionary',
                }}
            />
            <Tabs.Screen
                name="(resources)"
                options={{
                    headerTransparent: true,
                    headerTitle: '',
                    tabBarIcon: ({ color, size }) => <Ionicons name="folder-open-outline" size={size} color="3DB2FF" />,
                    tabBarLabel: 'Resources',
                }}
            />

            <Tabs.Screen
                name="(profile)"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color="3DB2FF" />,
                    tabBarLabel: 'My Profile',
                }}
            />

    </Tabs>
    )
}
