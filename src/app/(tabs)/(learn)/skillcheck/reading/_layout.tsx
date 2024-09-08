import React, { createContext, useState, SetStateAction, Dispatch, useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { passages, questionSheets } from "./Resources";
import { SafeAreaView, Platform } from 'react-native';

export interface ReadingContextType {
    curIndex: number;
    maxIndex: number;
    passage: { html: string };
    questionSheet: { html: string };
    answers: string[];
    timeRemaining: number;
    prevPassage: () => void;
    nextPassage: () => void;
    setAnswers: Dispatch<SetStateAction<any[]>>;
    setTimeRemaining: Dispatch<SetStateAction<number>>;
}

const defaultContextValue: ReadingContextType = {
    curIndex: 0,
    maxIndex: 2,
    passage: passages[0],
    questionSheet: questionSheets[0],
    answers: Array(40).fill(''),
    timeRemaining: 60 * 60,
    prevPassage: () => {},
    nextPassage: () => {},
    setAnswers: () => {},
    setTimeRemaining: () => {},
};

export const ReadingContext = createContext<ReadingContextType>(defaultContextValue);

const SkillCheckReadingStack = () => {
    const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(40).fill(''));
    const [timeRemaining, setTimeRemaining] = useState(60 * 60);

    const nextPassage = () => {
        setCurrentPassageIndex((index) => Math.min(index + 1, passages.length - 1));
    };

    const prevPassage = () => {
        setCurrentPassageIndex((index) => Math.max(index - 1, 0));
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
        <SafeAreaView style={{flex: 1}}>
            <ReadingContext.Provider value={{
                curIndex: currentPassageIndex,
                maxIndex: passages.length - 1,
                passage: passages[currentPassageIndex],
                questionSheet: questionSheets[currentPassageIndex],
                answers: answers,
                timeRemaining: timeRemaining,
                prevPassage,
                nextPassage,
                setAnswers,
                setTimeRemaining,
            }}>
                {Platform.OS === "ios" && <StatusBar style='dark' backgroundColor='white' />}
                <Stack screenOptions={{ animation: 'none' }} />
            </ReadingContext.Provider>
        </SafeAreaView>
    )
}

export default SkillCheckReadingStack