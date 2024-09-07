import React from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { sharedStyles, correctColor, incorrectColor } from '../styles/sharedStyles';

const { width, height } = Dimensions.get('window');

interface ResultContentProps {
  result: 'correct' | 'incorrect' | null;
}

const ResultContent: React.FC<ResultContentProps> = ({ result }) => {
  if (!result) return null;

  return (
        <View style={sharedStyles.answerBox}>
            <Text style={[
                sharedStyles.resultTitle,
                {textAlign: 'center', fontWeight: '600', color: result === 'correct' ? correctColor : incorrectColor,}
            ]}>
                {result === 'correct' ? 'Correct!' : 'Incorrect!'}
            </Text>
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
