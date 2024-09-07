import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { sharedStyles } from '../styles/sharedStyles';

interface CheckAnswerButtonProps {
  onPress: () => void;
  onNext: () => void;
  result: 'correct' | 'incorrect' | null;
}

const CheckAnswerButton: React.FC<CheckAnswerButtonProps> = ({ onPress, onNext, result }) => {
  const getBackgroundColor = () => {
    if (result === 'correct') return '#99CC29';
    if (result === 'incorrect') return '#FF4B4C';
    return '#007bff';
  };

  const handlePress = () => {
    if (result) {
      onNext();
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity style={[sharedStyles.checkAnswerButton, { backgroundColor: getBackgroundColor() }]} onPress={handlePress}>
        <Text style={sharedStyles.textCheckAnswerButton}>
          {result ? 'Next Question' : 'Check Answer'}
        </Text>
    </TouchableOpacity>
  );
};

export default CheckAnswerButton;
