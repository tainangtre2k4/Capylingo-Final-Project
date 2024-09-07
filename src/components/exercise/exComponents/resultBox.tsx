import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { sharedStyles } from '../styles/sharedStyles';

interface ResultBoxProps {
  result: 'correct' | 'incorrect' | null;
  content: React.ReactNode;
}

const ResultBox: React.FC<ResultBoxProps> = ({ result, content }) => {
  if (!result) return null;

  return (
    <View style={[sharedStyles.resultBox, {backgroundColor: result === 'correct' ? '#F5FFD8' : '#FFDDD8'}]}>
      {content}
    </View>
  );
};

export default ResultBox;
