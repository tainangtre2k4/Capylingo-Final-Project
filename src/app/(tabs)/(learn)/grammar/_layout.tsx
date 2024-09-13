import React from "react";
import { Stack } from "expo-router";

const GrammarStack = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarColor: "transparent",
        statusBarTranslucent: true,
        statusBarStyle: "light",
      }}
    />
  );
};

export default GrammarStack;
