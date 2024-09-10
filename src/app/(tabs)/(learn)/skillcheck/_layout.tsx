import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Stack } from "expo-router";
import { numberOfListeningTests, numberOfReadingTests } from "@/assets/data/skillcheck.json"

export interface SkillcheckContextType {
  totalReadingTests: number;
  totalListeningTests: number;
  currentReadingTestIndex: number;
  currentListeningTestIndex: number;
  setReadingTestIndex: Dispatch<SetStateAction<number>>;
  setListeningTestIndex: Dispatch<SetStateAction<number>>;
}

const defaultContextValue: SkillcheckContextType = {
  totalReadingTests: 3,
  totalListeningTests: 3,
  currentReadingTestIndex: 0,
  currentListeningTestIndex: 0,
  setReadingTestIndex: () => {},
  setListeningTestIndex: () => {},
};

export const SkillcheckContext =
  createContext<SkillcheckContextType>(defaultContextValue);

const SkillcheckStack = () => {
  const [currentListeningTestIndex, setListeningTestIndex] = useState(0);
  const [currentReadingTestIndex, setReadingTestIndex] = useState(0);
  return (
    <SkillcheckContext.Provider
      value={{
        totalReadingTests: numberOfReadingTests,
        totalListeningTests: numberOfListeningTests,
        currentReadingTestIndex,
        currentListeningTestIndex,
        setReadingTestIndex,
        setListeningTestIndex,
      }}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SkillcheckContext.Provider>
  );
};

export default SkillcheckStack;
