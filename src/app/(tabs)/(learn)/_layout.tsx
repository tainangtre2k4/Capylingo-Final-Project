import React from 'react'
import {Stack} from 'expo-router'
import {StatusBar} from 'expo-status-bar';
import {SafeAreaView} from "react-native";

const LearnStack = () => {

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#3DB2FF'}}>
                <StatusBar style='light' backgroundColor='#3DB2FF'/>
                <Stack screenOptions={{headerShown: false}}/>
        </SafeAreaView>

    )
}

export default LearnStack