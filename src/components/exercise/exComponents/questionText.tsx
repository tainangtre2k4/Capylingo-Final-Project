import React from 'react';
import { Text } from 'react-native';
import { sharedStyles } from '../styles/sharedStyles';

interface QuestionTextProps {
  question: string;
}

const QuestionText: React.FC<QuestionTextProps> = ({ question }) => {
  return (
    <Text style={sharedStyles.question}>{question}</Text>
  );
};

export default QuestionText;
