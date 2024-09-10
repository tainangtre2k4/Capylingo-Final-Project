import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation, router } from "expo-router";
import BackButton from "@/src/components/BackButton";
import HeaderProgressTracker from "@/src/components/skillcheck/HeaderProgressTracker";
import { RenderHTML } from "react-native-render-html";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ReadingContext } from "./_layout";

const { width, height } = Dimensions.get("window");

const ReadingArticle = () => {
  const navigation = useNavigation();
  const MIN_FONT_SIZE = 14;
  const MAX_FONT_SIZE = 28;
  const DEFAULT_FONT_SIZE = 14;
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const {
    curIndex,
    maxIndex,
    passage,
    timeRemaining,
    prevPassage,
    nextPassage,
  } = useContext(ReadingContext);

  const increaseFontSize = () => {
    if (fontSize < MAX_FONT_SIZE) {
      setFontSize((prevSize) => prevSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > MIN_FONT_SIZE) {
      setFontSize((prevSize) => prevSize - 2);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <HeaderProgressTracker current={curIndex + 1} all={maxIndex + 1} />
          <TouchableOpacity
            style={styles.headerRightIconContainer}
            onPress={() => {
              router.replace("/skillcheck/reading/QuestionSheet");
            }}
            activeOpacity={0.6}
          >
            <Ionicons name="document-text-outline" size={20} color="#0693F1" />
          </TouchableOpacity>
        </View>
      ),
      headerTitleStyle: {
        color: "white",
      },
      ...Platform.select({
        android: {
          statusBarColor: "white",
          statusBarStyle: "dark",
        },
      }),
    });
  }, [navigation, curIndex, maxIndex, passage]);

  return (
    <>
      <ScrollView style={styles.container}>
        <RenderHTML
          defaultTextProps={{ selectable: true, style: { fontSize } }}
          source={passage}
          contentWidth={width}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={styles.footerIconContainer}
          onPress={increaseFontSize}
          android_ripple={{ color: "#F3F3F3" }}
        >
          <Image
            source={require("@/assets/images/skillcheck/text_up.png")}
            style={styles.footerText}
          />
          <Text style={styles.footerLabel}>Zoom in</Text>
        </Pressable>
        <Pressable
          style={styles.footerIconContainer}
          onPress={decreaseFontSize}
        >
          <Image
            source={require("@/assets/images/skillcheck/text_down.png")}
            style={styles.footerText}
          />
          <Text style={styles.footerLabel}>Zoom out</Text>
        </Pressable>
        <Pressable style={styles.footerIconContainer}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={prevPassage}
          />
          <Text style={styles.footerLabel}>Previous</Text>
        </Pressable>
        <Pressable style={styles.footerIconContainer}>
          <Ionicons
            name="arrow-forward"
            size={24}
            color="black"
            onPress={nextPassage}
          />
          <Text style={styles.footerLabel}>Next</Text>
        </Pressable>
      </View>
    </>
  );
};

export default ReadingArticle;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
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
