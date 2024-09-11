import { Stack } from "expo-router";
import { Platform } from "react-native";
import React from "react";

export default function ProfileLayout() {
  return (
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
  );
}
