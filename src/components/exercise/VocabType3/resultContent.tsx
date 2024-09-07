import React from 'react';
import { Text, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { sharedStyles, correctColor, incorrectColor } from '../styles/sharedStyles';

const { width, height } = Dimensions.get('window');

interface ResultContentProps {
  result: 'correct' | 'incorrect' | null;
  toggleModal: () => void;
}

const ResultContent: React.FC<ResultContentProps> = ({ result, toggleModal }) => {
  if (!result) return null;

  return (
        <View style={sharedStyles.answerBox}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Text style={[
                sharedStyles.resultTitle,
                {textAlign: 'center', fontWeight: '600', color: result === 'correct' ? correctColor : incorrectColor,}
            ]}>
                {result === 'correct' ? 'Correct!' : 'Incorrect!'}
            </Text>
            <TouchableOpacity onPress={toggleModal} style={[styles.viewAnswersButton, {backgroundColor: result === 'correct' ? correctColor : '#FF8383'}]}>
              <Text style={[sharedStyles.textCheckAnswerButton, {color: '#fff'}]}>View Answer</Text>
            </TouchableOpacity>
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
  viewAnswersButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a0c0ff',
    borderRadius: width*0.0213,
    marginTop: 4,
    height: height*0.04,
    width: '40%',
    alignSelf: 'center',
  },
});

export default ResultContent;
