import React from "react";
import { SafeAreaView, Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ResourcesStack = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" backgroundColor="white" />
      <Stack
        screenOptions={{
          ...Platform.select({
            android: {
              statusBarColor: "white",
              statusBarStyle: "dark",
            },
          }),
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
};

export default ResourcesStack;
