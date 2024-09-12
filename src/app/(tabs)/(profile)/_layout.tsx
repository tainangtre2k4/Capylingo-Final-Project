import { Stack } from "expo-router";
import { Platform, SafeAreaView } from "react-native";
import React from "react";

export default function ProfileLayout() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#3DB2FF'}}>
      <Stack
        initialRouteName="profile"
        screenOptions={{
          headerShown: false,
          ...Platform.select({
            android: {
              statusBarColor: "#3DB2FF",
              statusBarStyle: "light",
            },
          }),
        }}
      />
    </SafeAreaView>
  );
}
