import { Stack } from "expo-router";
import "../../global.css";
import AuthProvider from "../providers/AuthProvider";
import React from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack initialRouteName="learn" screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
