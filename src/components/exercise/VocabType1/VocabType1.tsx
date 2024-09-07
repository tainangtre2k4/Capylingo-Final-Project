import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import CheckAnswerButton from '../exComponents/checkAnswerButton';
import QuestionText from '../exComponents/questionText';
import ResultBox from '../exComponents/resultBox';
import { sharedStyles, correctColor, incorrectAnswerColor } from '../styles/sharedStyles';
import ResultContent from './resultContent';

interface Type1Props {
  onNext: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  questionImageUrl: string;
  correctAnswerIndex: number;
  answers: string[];
}


const ExVocabType1: React.FC<Type1Props> = ({ onNext, questionImageUrl, correctAnswerIndex, answers, onCorrectAnswer, onIncorrectAnswer})  => {

  const question = "What does the picture mean?";

  
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const checkAnswer = () => {
    if (userAnswer === correctAnswerIndex) {
        setResult('correct');
        onCorrectAnswer();
      } else {
        setResult('incorrect');
        onIncorrectAnswer();
      }
  };

  return (
    <View style={sharedStyles.container}>
        <QuestionText question={question} />
        <Image
             source={{ uri: questionImageUrl }}
            style={sharedStyles.imageQuestion}
        />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}>
        {answers.map((answer, index) => {
          // Xác định màu nền của từng đáp án
          let backgroundColor = sharedStyles.MCBoxAnswer.backgroundColor;
          if (userAnswer === index && result === null) {
            backgroundColor = '#0077CC'; // Màu khi đang chọn trước khi check answer
          } else if (result === 'correct' && userAnswer === index) {
            backgroundColor = correctColor; // Màu xanh lá khi đúng
          } else if (result === 'incorrect' && userAnswer === index) {
            backgroundColor = incorrectAnswerColor; // Màu đỏ khi sai
          }
          return (
            <View key={index} style={sharedStyles.BoxOfMCBoxSmall}>
                <TouchableOpacity
                style={[sharedStyles.MCBoxAnswerSmall, {backgroundColor}]}
                onPress={() => setUserAnswer(index)}
                activeOpacity={0.75}
                disabled={result !== null}
                >
                <Text style={sharedStyles.textCheckAnswerButton}>{answer}</Text>
                </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <ResultBox result={result} content={<ResultContent result={result} answer={answers[correctAnswerIndex]} />} />

      <CheckAnswerButton onPress={checkAnswer} onNext={onNext} result={result} />
    </View>
  );
};

export default ExVocabType1;
