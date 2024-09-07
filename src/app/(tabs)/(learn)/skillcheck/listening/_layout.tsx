import React, {createContext, useState, SetStateAction, Dispatch, useEffect} from 'react'
import {Stack} from 'expo-router'
import {StatusBar} from 'expo-status-bar';
import {audioSources, questionSheets} from "./Resources";
import { Platform } from 'react-native';

export interface ListeningContextType {
    curIndex: number;
    maxIndex: number;
    questionSheet: { html: string };
    answers: string[];
    audioSource: string;
    prevPassage: () => void;
    nextPassage: () => void;
    setAnswers: Dispatch<SetStateAction<any[]>>;
}

const defaultContextValue: ListeningContextType = {
    curIndex: 0,
    maxIndex: 2,
    questionSheet: questionSheets[0],
    answers: Array(40).fill(''),
    audioSource: audioSources[0],
    prevPassage: () => {},
    nextPassage: () => {},
    setAnswers: () => {},
};

export const ListeningContext = createContext<ListeningContextType>(defaultContextValue);

const SkillCheckListeningStack = () => {
    const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(40).fill(''));

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
            answers: answers,
            audioSource: audioSources[currentPassageIndex],
            prevPassage,
            nextPassage,
            setAnswers,
        }}>
            {Platform.OS === "ios" && <StatusBar style='dark' backgroundColor='white' />}
            <Stack screenOptions={{animation: 'none'}}/>
        </ListeningContext.Provider>


    )
}

export default SkillCheckListeningStack
