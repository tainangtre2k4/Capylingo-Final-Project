import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "expo-router";
import BackButton from "@/src/components/BackButton";
import HeaderProgressTracker from "@/src/components/skillcheck/HeaderProgressTracker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ReadingContext } from "./_layout";
import QuestionSheet from "./QuestionSheet";
import Passage from "./Passage";

const { width, height } = Dimensions.get("window");

const ReadingTest = () => {
  const navigation = useNavigation();
  const [isQuestionSheet, setIsQuestionSheet] = useState(false);
  const { curIndex, maxIndex } = useContext(ReadingContext);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <HeaderProgressTracker current={curIndex + 1} all={maxIndex + 1} />
          <TouchableOpacity
            style={[
              styles.headerRightIconContainer,
              { backgroundColor: isQuestionSheet ? "#0693F1" : "white" },
            ]}
            onPress={() => {
              console.log(isQuestionSheet);
              setIsQuestionSheet(!isQuestionSheet);
            }}
            activeOpacity={0.6}
          >
            {isQuestionSheet ? (
              <MaterialCommunityIcons
                name="lead-pencil"
                size={20}
                color="white"
              />
            ) : (
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#0693F1"
              />
            )}
          </TouchableOpacity>
        </View>
      ),
      headerTitleStyle: {
        color: "white",
      },
      statusBarColor: "transparent",
      statusBarTranslucent: true,
      statusBarStyle: "dark",
    });
  }, [isQuestionSheet, navigation, curIndex, maxIndex]);

  return isQuestionSheet ? <QuestionSheet /> : <Passage />;
};

export default ReadingTest;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
    paddingTop:
      Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 8,
    paddingBottom: 8,
  },
  horizontalScrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  verticalScrollView: {
    width: width,
    paddingHorizontal: 20,
  },
  headerRightIconContainer: {
    padding: 9,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  footer: {
    flexDirection: "row",
    paddingVertical: 14,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#A0A0A0",
  },
  footerIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: {
    height: 14,
    width: 24,
  },
  footerHighlight: {
    height: 18,
    width: 16,
    resizeMode: "contain",
  },
  footerLabel: {
    fontSize: 12,
  },
});
