import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, router } from "expo-router";
import React, {
  useContext,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { ReadingContext } from "./_layout";
import { RenderHTML } from "react-native-render-html";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const QuestionSheet = () => {
  const {
    curIndex,
    maxIndex,
    answers,
    solutions,
    questionSheet,
    timeRemaining,
    setAnswers,
    setTimeRemaining,
  } = useContext(ReadingContext);
  const fontSize = 14;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

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
      return answers.slice(0, 13);
    } else if (curIndex === 1) {
      return answers.slice(13, 26);
    } else {
      return answers.slice(26);
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

    router.replace({
      pathname: "resultScreen",
      params: {
        correct: matchCount,
        all: solutions.length,
        backPage: "skillcheck",
      },
    });
  };

  const handleResetTimer = () => {
    Alert.alert(
      "Reset Timer",
      "We advise against resetting the timer! Still proceed?",
      [
        {
          text: "Cancel",
          style: "destructive",
        },
        {
          text: "Yes",
          onPress: () => setTimeRemaining(60 * 60),
        },
      ]
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.questionSheetContainer}>
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
          <TouchableOpacity
            onLongPress={handleResetTimer}
            delayLongPress={1000}
          >
            <Text style={styles.bottomSheetTitle}>
              {formatTime(timeRemaining)}
            </Text>
          </TouchableOpacity>
        </View>
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContainer}
        >
          <ScrollView contentContainerStyle={{alignItems: 'center'}}>
            {visibleAnswers.map((answer, index) => {
              const globalIndex = curIndex * 13 + index;
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

export default QuestionSheet;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  headerRightIconContainer: {
    padding: 9.5,
    borderRadius: 12,
    backgroundColor: "#0693F1",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  questionSheetContainer: {
    flex: 3,
    backgroundColor: "white",
    paddingHorizontal: 20,
    marginBottom: height * 0.23,
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    paddingVertical: 20,
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  answerNumberText: {
    fontSize: 18,
    marginRight: 24,
  },
  answerInput: {
    flex: 1,
    fontSize: 20,
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
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});
