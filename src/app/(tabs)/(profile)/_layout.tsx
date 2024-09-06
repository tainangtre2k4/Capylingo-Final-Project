import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import {StatusBar} from 'expo-status-bar';

export default function ProfileLayout(){
    return (
    <SafeAreaView style={{flex: 1}}>
        <Stack screenOptions={{headerShown: false}}/>
    </SafeAreaView>
    )
}