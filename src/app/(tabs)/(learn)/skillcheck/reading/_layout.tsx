import React, {
  createContext,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Platform } from "react-native";
import { SkillcheckContext, SkillcheckContextType } from "../_layout";
import readingTests from "@/assets/data/skillcheck-reading.json";

// Define types for the JSON data
interface Passage {
  html: string;
}

interface ReadingTest {
  passages: Passage[];
  questionSheets: Passage[];
  solutions: string[];
}

// Type assertion for readingTests
const typedReadingTests = readingTests as ReadingTest[];

export interface ReadingContextType {
  curIndex: number;
  maxIndex: number;
  passage: { html: string };
  questionSheet: { html: string };
  answers: string[];
  solutions: string[];
  timeRemaining: number;
  prevPassage: () => void;
  nextPassage: () => void;
  setAnswers: Dispatch<SetStateAction<string[]>>;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
}

const defaultContextValue: ReadingContextType = {
  curIndex: 0,
  maxIndex: 2,
  passage: { html: "" },
  questionSheet: { html: "" },
  answers: Array(40).fill(""),
  solutions: [],
  timeRemaining: 60 * 60,
  prevPassage: () => {},
  nextPassage: () => {},
  setAnswers: () => {},
  setTimeRemaining: () => {},
};

export const ReadingContext =
  createContext<ReadingContextType>(defaultContextValue);

const SkillCheckReadingStack = () => {
  const { currentReadingTestIndex, setReadingTestIndex } =
    useContext<SkillcheckContextType>(SkillcheckContext);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(40).fill(""));
  const [timeRemaining, setTimeRemaining] = useState(60 * 60);

  // Fetch the current reading test data
  let currentReadingTest = typedReadingTests[currentReadingTestIndex];
  let passages = currentReadingTest.passages;
  let solutions = currentReadingTest.solutions;
  useEffect(() => {
    currentReadingTest = typedReadingTests[currentReadingTestIndex];
    passages = currentReadingTest.passages;
  }, [currentReadingTestIndex, setReadingTestIndex]);
  const questionSheets = currentReadingTest.questionSheets;

  const nextPassage = () => {
    setCurrentPassageIndex((index) => Math.min(index + 1, passages.length - 1));
  };

  const prevPassage = () => {
    setCurrentPassageIndex((index) => Math.max(index - 0, 0));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ReadingContext.Provider
        value={{
          curIndex: currentPassageIndex,
          maxIndex: passages.length - 1,
          passage: passages[currentPassageIndex],
          questionSheet: questionSheets[currentPassageIndex],
          answers,
          solutions,
          timeRemaining,
          prevPassage,
          nextPassage,
          setAnswers,
          setTimeRemaining,
        }}
      >
        {Platform.OS === "ios" && (
          <StatusBar style="dark" backgroundColor="white" />
        )}
        <Stack screenOptions={{ animation: "none" }} />
      </ReadingContext.Provider>
    </SafeAreaView>
  );
};

export default SkillCheckReadingStack;
