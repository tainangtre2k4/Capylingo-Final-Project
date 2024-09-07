import React from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { sharedStyles, correctColor, incorrectColor } from '../styles/sharedStyles';

const { width, height } = Dimensions.get('window');

interface ResultContentProps {
  result: 'correct' | 'incorrect' | null;
  answer: string;
}

const ResultContent: React.FC<ResultContentProps> = ({ result, answer }) => {
  if (!result) return null;

  return (
        <View style={[sharedStyles.answerBox, {alignItems: 'center'}]}>
            <Text style={[
                sharedStyles.resultTitle,
                {color: result === 'correct' ? correctColor : incorrectColor, marginLeft: 0.042*width}
            ]}>
                {result === 'correct' ? 'Amazing!' : 'Ups.. that’s wrong'}
            </Text>
        
            <View style={{ flexDirection: 'row', marginLeft: 0.042 * width }}>
                <Text style={[
                    sharedStyles.answerText,
                    { color: result === 'correct' ? correctColor : incorrectColor }
                ]}>
                    Answer:
                </Text>
                <Text style={[
                    sharedStyles.answerText,
                    { color: result === 'correct' ? correctColor : incorrectColor, marginLeft: 5, fontWeight: '500' }
                ]}>
                    {answer}
                </Text>
            </View>
        </View>

  );
};

const styles = StyleSheet.create({
  correctText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  incorrectText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ResultContent;
