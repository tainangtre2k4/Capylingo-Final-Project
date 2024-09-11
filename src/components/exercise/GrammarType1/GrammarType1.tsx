import React, { useState } from 'react';
import { View, TextInput, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import CheckAnswerButton from '../exComponents/checkAnswerButton';
import QuestionText from '../exComponents/questionText';
import ResultBox from '../exComponents/resultBox';
import { sharedStyles } from '../styles/sharedStyles';
import ResultContent from './resultContent';

interface Type1Props {
  onNext: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  question: string;
  answer: string;
}

const ExGrammarType1: React.FC<Type1Props> = ({ onNext, onCorrectAnswer, onIncorrectAnswer, question, answer }) => {
  
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  
  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === answer.toLowerCase()) {
      setResult('correct');
      onCorrectAnswer();
    } else {
      setResult('incorrect');
      onIncorrectAnswer();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
      <View style={sharedStyles.container}>
        <QuestionText question={question} />
        <TextInput
          style={sharedStyles.input}
          placeholder="Enter your answer"
          onChangeText={text => setUserAnswer(text)}
          value={userAnswer}
          multiline={true}
          textAlignVertical="top"
          editable={!result}
        />

        <ResultBox result={result} content={<ResultContent result={result} answer={answer} />} />

        <CheckAnswerButton onPress={checkAnswer} onNext={onNext} result={result} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ExGrammarType1;
