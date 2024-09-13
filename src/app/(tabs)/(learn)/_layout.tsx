import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Platform } from "react-native";

const LearnStack: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#3DB2FF" }}>
      {Platform.OS === "ios" && (
        <StatusBar style="light" backgroundColor="#3DB2FF" />
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          ...Platform.select({
            android: {
              statusBarColor: "#3DB2FF",
              statusBarStyle: "light",
            },
          }),
        }}
        initialRouteName="learn"
      />
    </SafeAreaView>
  );
};

export default LearnStack;
