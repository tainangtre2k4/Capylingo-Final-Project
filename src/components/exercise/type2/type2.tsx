import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import CheckAnswerButton from '../exComponents/checkAnswerButton';
import QuestionText from '../exComponents/questionText';
import ResultBox from '../exComponents/resultBox';
import { sharedStyles } from '../styles/sharedStyles';
import ResultContent from './resultContent';
import {Styles} from './styles'

const { width, height } = Dimensions.get('window');

const words = ['What’s', 'Your', 'Name', '?', 'I', 'Am', 'Ujang'];
const correctAnswer = ['I', 'Am', 'Ujang', 'What’s', 'Your', 'Name', '?'];


interface Type1Props {
  onNext: () => void;
}

const type2: React.FC<Type1Props> = ({ onNext }) => {
    const [selectedWords, setSelectedWords] = useState<string[]>(Array(correctAnswer.length).fill(''));
    const [availableWords, setAvailableWords] = useState<string[]>(words);
    
    const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  
    const handleWordPress = (word: string) => {
      // Tìm vị trí trống đầu tiên trong selectedWords
      const emptyIndex = selectedWords.findIndex(w => w === '');
  
      // Nếu có vị trí trống thì thêm từ vào
      if (emptyIndex !== -1) {
        const newSelectedWords = [...selectedWords];
        newSelectedWords[emptyIndex] = word;
        setSelectedWords(newSelectedWords);
        setAvailableWords(availableWords.filter(w => w !== word));
      }
    };
  
    const handleRemoveWord = (index: number) => {
      const word = selectedWords[index];
      if (word !== '') {
        const newSelectedWords = [...selectedWords];
        newSelectedWords[index] = '';
        setSelectedWords(newSelectedWords);
        setAvailableWords([...availableWords, word]);
      }
    };
  
    const handleCheckAnswer = () => {
      if (selectedWords.join(' ') === correctAnswer.join(' ')) {
        setResult('correct');
      } else {
        setResult('incorrect');
      }
    }

    return (
        <View style={sharedStyles.container}>
            <QuestionText question='Rearrange the words below to form a meaningful sentence!' />
            
            <View style={Styles.sentenceContainer}>
                {selectedWords.map((word, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRemoveWord(index)}
                  style={Styles.selectedWordButton}
                  disabled={!!result}
                >
                    <Text style={Styles.selectedWordText}>{word}</Text>
                </TouchableOpacity>
                ))}
            </View>

            <View style={styles.wordsContainer}>
                {availableWords.map((word, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.wordButton}
                    onPress={() => handleWordPress(word)}
                    disabled={!!result}
                >
                    <Text style={styles.wordButtonText}>{word}</Text>
                </TouchableOpacity>
                ))}
            </View>
            
            <ResultBox result={result} content={<ResultContent result={result} answers={correctAnswer} />} />

            <CheckAnswerButton onPress={handleCheckAnswer} onNext={onNext} result={result}/>

        </View>

    );
}

const styles = StyleSheet.create({
    wordsContainer: {
      //marginHorizontal: width * 0.03,
      marginTop: height * 0.07,
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    wordButton: {
      backgroundColor: '#3DB2FF',
      borderRadius: width * 0.0267,
      padding: width*0.0266,
      margin: width*0.0266,
      minWidth: width * 0.15,
  
      // Thuộc tính đổ bóng cho iOS
      shadowColor: '#000', // Màu đổ bóng đen
      shadowOffset: {
        width: 2.5, // Độ lệch ngang
        height: 5, // Độ lệch dọc
      },
      shadowOpacity: 0.2, // Độ mờ đổ bóng (20%)
      shadowRadius: 1, // Độ mờ của đổ bóng (blur)
  
      // Thuộc tính đổ bóng cho Android
      elevation: 5,
    },
    wordButtonText: {
        fontSize: width*0.042,
        color: "#FFF",
        textAlign: 'center',
      },
    message: {
        fontSize: 18,
        color: 'green',
        marginTop: 10,
    },
  });


export default type2;
