import React from "react";
import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";

const ResourcesStack = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack
        screenOptions={{
          statusBarColor: "transparent",
          statusBarTranslucent: true,
          statusBarStyle: "dark",
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
};

export default ResourcesStack;
