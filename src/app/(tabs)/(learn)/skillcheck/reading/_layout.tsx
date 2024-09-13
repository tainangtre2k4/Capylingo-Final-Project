import React, {
  createContext,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
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
  passages: Passage[];
  answers: string[];
  solutions: string[];
  timeRemaining: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  setAnswers: Dispatch<SetStateAction<string[]>>;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
}

const defaultContextValue: ReadingContextType = {
  curIndex: 0,
  maxIndex: 2,
  passage: { html: "" },
  passages: [],
  questionSheet: { html: "" },
  answers: Array(40).fill(""),
  solutions: [],
  timeRemaining: 60 * 60,
  setCurrentIndex: () => {},
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
          setCurrentIndex: setCurrentPassageIndex,
          maxIndex: passages.length - 1,
          passage: passages[currentPassageIndex],
          passages,
          questionSheet: questionSheets[currentPassageIndex],
          answers,
          solutions,
          timeRemaining,
          setAnswers,
          setTimeRemaining,
        }}
      >
        <Stack
          screenOptions={{
            animation: "none",
            statusBarColor: "white",
            statusBarStyle: "dark",
          }}
        />
      </ReadingContext.Provider>
    </SafeAreaView>
  );
};

export default SkillCheckReadingStack;
