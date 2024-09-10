import React, { createContext, useState, SetStateAction, Dispatch, useContext } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import listeningTests from "@/assets/data/skillcheck-listening.json"
import { SkillcheckContext, SkillcheckContextType } from '../_layout';
import { Platform } from 'react-native';

export interface ListeningContextType {
  curIndex: number;
  maxIndex: number;
  questionSheet: { html: string };
  answers: string[];
  audioSource: string;
  solutions: string[];
  prevPassage: () => void;
  nextPassage: () => void;
  setAnswers: Dispatch<SetStateAction<string[]>>;
}

const defaultContextValue: ListeningContextType = {
  curIndex: 0,
  maxIndex: 2,
  questionSheet: { html: '' },
  answers: Array(40).fill(''),
  audioSource: '',
  solutions: [],
  prevPassage: () => {},
  nextPassage: () => {},
  setAnswers: () => {},
};

export const ListeningContext = createContext<ListeningContextType>(defaultContextValue);

interface ListeningTest {
  questionSheets: { html: string }[];
  audioSources: string[];
  solutions: string[];
}

const SkillCheckListeningStack = () => {
  const { currentListeningTestIndex } = useContext<SkillcheckContextType>(SkillcheckContext);
  const currentListeningTest = (listeningTests as ListeningTest[])[currentListeningTestIndex];
  const questionSheets = currentListeningTest.questionSheets;
  const audioSources = currentListeningTest.audioSources;
  const solutions = currentListeningTest.solutions;
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(40).fill(''));

  const nextPassage = () => {
    setCurrentPassageIndex((index) => Math.min(index + 1, questionSheets.length - 1));
  };

  const prevPassage = () => {
    setCurrentPassageIndex((index) => Math.max(index - 1, 0));
  };

  return (
    <ListeningContext.Provider value={{
      curIndex: currentPassageIndex,
      maxIndex: questionSheets.length - 1,
      questionSheet: questionSheets[currentPassageIndex],
      answers,
      audioSource: audioSources[currentPassageIndex],
      solutions,
      prevPassage,
      nextPassage,
      setAnswers,
    }}>
      {Platform.OS === "ios" && <StatusBar style='dark' />}
      <Stack screenOptions={{ animation: 'none' }} />
    </ListeningContext.Provider>
  )
}

export default SkillCheckListeningStack