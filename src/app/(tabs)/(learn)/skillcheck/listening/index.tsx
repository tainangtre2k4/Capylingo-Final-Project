import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { router, useNavigation } from "expo-router";
import BackButton from "@/src/components/BackButton";
import HeaderProgressTracker from "@/src/components/skillcheck/HeaderProgressTracker";
import { RenderHTML } from "react-native-render-html";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ListeningContext } from "./_layout";
import AudioPlayer from "@/src/components/skillcheck/AudioPlayer";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const ListeningArticle = () => {
  const navigation = useNavigation();
  const MIN_FONT_SIZE = 14;
  const MAX_FONT_SIZE = 28;
  const DEFAULT_FONT_SIZE = 14;
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const {
    curIndex,
    maxIndex,
    answers,
    solutions,
    setAnswers,
    prevPassage,
    nextPassage,
    questionSheet,
    audioSource,
  } = useContext(ListeningContext);
  const [isToolbarHidden, setToolbarHidden] = useState<boolean>(false);

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
              setToolbarHidden(!isToolbarHidden);
            }}
            activeOpacity={0.6}
          >
            <Ionicons
              name={isToolbarHidden ? "eye-off" : "eye"}
              size={20}
              color="#0693F1"
            />
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
  }, [navigation, curIndex, maxIndex, isToolbarHidden]);

  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "50%", "80%"], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleInputChange = (text: string, index: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = text;
    setAnswers(updatedAnswers);
  };

  const getVisibleAnswers = () => {
    if (curIndex === 0) {
      return answers.slice(0, 10);
    } else if (curIndex === 1) {
      return answers.slice(10, 20);
    } else if (curIndex === 2) {
      return answers.slice(20, 30);
    } else {
      return answers.slice(30);
    }
  };

  const visibleAnswers = getVisibleAnswers();

  const showGrade = () => {
    if (answers.length !== solutions.length) {
      throw new Error("Arrays must be of the same size");
    }

    let matchCount = 0;

    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === solutions[i]) {
        matchCount++;
      }
    }

    router.push({
      pathname: "resultScreen",
      params: {
        correct: matchCount,
        all: solutions.length,
        backPage: "skillcheck",
      },
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={[
          styles.controllerContainer,
          { padding: isToolbarHidden ? 0 : 6 },
        ]}
      >
        {!isToolbarHidden && (
          <View style={styles.controller}>
            <Pressable
              style={styles.controllerIconContainer}
              onPress={increaseFontSize}
              android_ripple={{ color: "#F3F3F3" }}
            >
              <Image
                source={require("@/assets/images/skillcheck/text_up.png")}
                style={styles.controllerText}
              />
              <Text style={styles.controllerLabel}>Zoom in</Text>
            </Pressable>
            <Pressable
              style={styles.controllerIconContainer}
              onPress={decreaseFontSize}
            >
              <Image
                source={require("@/assets/images/skillcheck/text_down.png")}
                style={styles.controllerText}
              />
              <Text style={styles.controllerLabel}>Zoom out</Text>
            </Pressable>
            <Pressable
              style={styles.controllerIconContainer}
              onPress={prevPassage}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text style={styles.controllerLabel}>Previous</Text>
            </Pressable>
            <Pressable
              style={styles.controllerIconContainer}
              onPress={nextPassage}
            >
              <Ionicons name="arrow-forward" size={24} color="black" />
              <Text style={styles.controllerLabel}>Next</Text>
            </Pressable>
          </View>
        )}
        <AudioPlayer audioSource={audioSource} />
      </View>
      <ScrollView style={styles.scrollViewContainer} overScrollMode="never">
        <RenderHTML
          defaultTextProps={{ selectable: true, style: { fontSize } }}
          source={questionSheet}
          contentWidth={width}
        />
      </ScrollView>
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        handleStyle={styles.bottomSheetHandle}
        backgroundStyle={styles.bottomSheetHandle}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>Answer Sheet</Text>
          <View style={{ flex: 1 }} />
        </View>
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContainer}
        >
          <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            {visibleAnswers.map((answer, index) => {
              const globalIndex = curIndex * 10 + index;
              return (
                <View key={globalIndex} style={styles.inputContainer}>
                  <Text style={styles.answerNumberText}>{globalIndex + 1}</Text>
                  <TextInput
                    style={styles.answerInput}
                    value={answer}
                    onChangeText={(text) =>
                      handleInputChange(text, globalIndex)
                    }
                  />
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                Alert.alert(
                  "Submit All",
                  "Are you sure you want to continue?",
                  [
                    {
                      text: "Cancel",
                      style: "destructive",
                    },
                    {
                      text: "Submit",
                      onPress: showGrade,
                    },
                  ]
                );
              }}
            >
              <Text style={styles.submitText}>Submit All</Text>
            </TouchableOpacity>
          </ScrollView>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default ListeningArticle;

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
  scrollViewContainer: {
    marginTop: 10,
    marginBottom: height * 0.23,
  },
  headerRightIconContainer: {
    padding: 9.5,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  controllerContainer: {
    backgroundColor: "#F3F3F3",
    borderRadius: 16,
  },
  controller: {
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 16,
  },
  controllerIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  controllerText: {
    height: 14,
    width: 24,
  },
  controllerHighlight: {
    height: 18,
    width: 16,
    resizeMode: "contain",
  },
  controllerLabel: {
    fontSize: 12,
  },
  bottomSheetContainer: {
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  bottomSheetHandle: {
    backgroundColor: "#F3F3F3",
    borderRadius: 40,
  },
  bottomSheetIndicator: {
    width: 60,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  inputContainer: {
    flexDirection: "row",
    borderRadius: 14,
    width: width * 0.84,
    height: 56,
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  answerNumberText: {
    fontSize: 18,
    marginRight: 24,
  },
  answerInput: {
    flex: 1,
    fontSize: 18,
  },
  submitText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0693F1",
  },
  submitButton: {
    borderRadius: 14,
    width: width * 0.44,
    height: 56,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginVertical: 10,
  },
});
