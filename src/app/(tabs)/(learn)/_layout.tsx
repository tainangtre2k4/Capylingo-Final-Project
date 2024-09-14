import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Platform } from "react-native";
import { UserLearnProvider } from "./ UserLearnContext";

const LearnStack: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#3DB2FF" }}>
      <UserLearnProvider>
      <Stack
        screenOptions={{
          headerShown: false, 
          statusBarColor: "transparent",
          statusBarTranslucent: true,
          statusBarStyle: "light",
        }}
        initialRouteName="learn"
      />
      </UserLearnProvider>
    </SafeAreaView>
  );
};

export default LearnStack;
