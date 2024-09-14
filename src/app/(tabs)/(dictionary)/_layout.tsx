import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";

const DictionaryStack = () => {

  return (
    <SafeAreaView style={styles.container}>
        <Stack
          screenOptions={{
            animation: "none",
            statusBarColor: "transparent",
            statusBarTranslucent: true,
            statusBarStyle: "light",
          }}
        />
    </SafeAreaView>
  );
};

export default DictionaryStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3DB2FF",
  },
});
