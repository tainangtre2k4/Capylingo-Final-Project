import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, FlatList} from 'react-native';
import CheckAnswerButton from '../exComponents/checkAnswerButton';
import QuestionText from '../exComponents/questionText';
import ResultBox from '../exComponents/resultBox';
import { correctColor, incorrectColor, sharedStyles } from '../styles/sharedStyles';
import ResultContent from './resultContent';
import AnswerModal from './answerModal';

// Hàm đảo thứ tự ngẫu nhiên mảng
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
};

const generateColors = (numColors: number) => {
    const colors = [];
    const hueStep = 360 / numColors; // Đảm bảo mỗi màu sẽ có sự khác biệt về hue
    
    for (let i = 0; i < numColors; i++) {
      const hue = i * hueStep; // Điều chỉnh độ hue để tạo sự khác biệt
      const color = `hsl(${hue}, 70%, 70%)`; // Bạn có thể điều chỉnh giá trị saturation và lightness
      colors.push(color);
    }
    
    return shuffleArray(colors);
  };

interface VocabType3Props {
  question: string;
  synonyms: string[][];
  onNext: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
}
const VocabType3: React.FC<VocabType3Props> = ({ question, synonyms, onNext, onCorrectAnswer, onIncorrectAnswer })  => {
  // const question = 'Matching synonyms ';
  // const synonyms = [
  //   ['Happy', 'Joyful'],
  //   ['Sad', 'Unhappy'],
  //   ['Fast', 'Quick'],
  //   ['Hello', 'Hi'],
  //   // ['Big', 'Large'],
  //   // ['Smart', 'Intelligent'],
  //   // ['Strong', 'Powerful'],
  //   // ['Easy', 'Simple'],
  //   // ['Begin', 'Start'],
  //   // ['Rich', 'Wealthy'],
  //   // ['Quiet', 'Silent'],
  //   // ['Brave', 'Courageous'],
  //  ];

  const [leftColumn, setLeftColumn] = useState<{ word: string, index: number }[]>([]);
  const [rightColumn, setRightColumn] = useState<{ word: string, index: number }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[][]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const colors = useMemo(() => generateColors(synonyms.length), [synonyms.length]);
  //const colors = ['#3DB2FF', '#FFAFBD', '#85D4B5', '#4275DB', '#7AD47A', '#ff9800', '#4caf50', '#F08792'];
  

  // Randomize the order of the synonyms in the columns
  useEffect(() => {
    let shuffledSynonyms = [...synonyms].map((pair, index) => ({
      left: { word: pair[0], index },
      right: { word: pair[1], index },
    }));
  
    shuffledSynonyms = shuffleArray(shuffledSynonyms);
  
    const left = shuffledSynonyms.map(item => item.left);
    const right = shuffledSynonyms.map(item => item.right);
  
    const shuffledRight = shuffleArray(right);

    setLeftColumn(left);
    setRightColumn(shuffledRight);
  }, []);

  const handleMatch = () => {
    if (selectedLeft !== null && selectedRight !== null) {
      // Find the indices of the pairs to remove
      const leftIndex = selectedLeft;
      const rightIndex = selectedRight;

      const updatedMatchedPairs = matchedPairs.filter(([leftPairIndex, rightPairIndex]) => {
        return leftPairIndex !== leftIndex && rightPairIndex !== rightIndex;
      });

      // Add the new pair
      setMatchedPairs([...updatedMatchedPairs, [leftIndex, rightIndex]]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const checkAnswer = () => {
    const results = matchedPairs.map(([leftIndex, rightIndex]) => {
        return leftColumn[leftIndex].index === rightColumn[rightIndex].index;
      });
    setResults(results);

    if (results.every(result => result === true)){
        setResult('correct');
        onCorrectAnswer();
    } else {
         setResult('incorrect');
         onIncorrectAnswer();
      }
  };
  
  const renderItem = (isRight: 0 | 1) => ({ item, index }: { item: { word: string, index: number }, index: number }) => {
    const isMatched = matchedPairs.some(pair => pair[isRight] === index);
    const isSelected = isRight === 0 ? selectedLeft === index : selectedRight === index;
    const handlePress = () => {
        if (isRight === 0) {
          setSelectedLeft(selectedLeft === index ? null : index);
        } else {
          setSelectedRight(selectedRight === index ? null : index);
        }
    };

    // Determine the background color based on the state

    let backgroundColor = '#A2B7CC'; //BDCEDF
    if (results.length){
        const matchIndex = matchedPairs.findIndex(pair => pair[isRight] === index);
        const isCorrect = results[matchIndex];
        backgroundColor = isCorrect ? correctColor : incorrectColor;
    }
    else{
        if (isSelected) {
        backgroundColor = '#a0c0ff'; // Color when selected
        } else if (isMatched) {
        // Determine the color for matched pairs
        const matchColor = matchedPairs.findIndex(pair => pair[isRight] === index);
        backgroundColor = colors[matchColor % colors.length];
        }
    }

    return (
      <TouchableOpacity
        style={[
          sharedStyles.MCBoxAnswerSmall,
          { backgroundColor,
            borderColor: '#A0A0A0',
            borderWidth: isSelected ? 3 : 0,
            //borderRadius: 5, 
          }
        ]}
        onPress={handlePress}
        disabled={!!results.length}
      >
        <Text style={[sharedStyles.textCheckAnswerButton, {color: results.length ? '#fff' : isMatched ? '#444444' : '#fff'}]}>{item.word}</Text>
      </TouchableOpacity>
    );
  };

  const buttonColor = (selectedLeft === null || selectedRight === null)
                        ? '#A2B7CC' // Gray
                        : '#a0c0ff'; // color for "Match
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={[sharedStyles.container]}>
        <QuestionText question={question} />
        <View style={sharedStyles.TwoFlatListBox}>
            <FlatList
                data={leftColumn}
                renderItem={renderItem(0)}
                keyExtractor={(item) => item.index.toString()}
                contentContainerStyle={{alignItems: 'center'}}             
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            />

            <FlatList
                data={rightColumn}
                renderItem={renderItem(1)}
                keyExtractor={(item) => item.index.toString()}
                contentContainerStyle={{alignItems: 'center'}}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            />
        </View>

        <ResultBox result={result} content={<ResultContent result={result} toggleModal={toggleModal}/>} />

        {(matchedPairs.length === synonyms.length && selectedLeft === null && selectedRight === null)
        ? <CheckAnswerButton onPress={checkAnswer} onNext={onNext} result={result} />
        : <TouchableOpacity
            style={[sharedStyles.checkAnswerButton, { backgroundColor: buttonColor }]}
            onPress={handleMatch}
            disabled={selectedLeft === null || selectedRight === null}
          >
              <Text style={sharedStyles.textCheckAnswerButton}>Match</Text>
          </TouchableOpacity>
        }

      <AnswerModal
        visible={isModalVisible}
        onClose={toggleModal}
        leftColumn={leftColumn}
        rightColumn={rightColumn}
        colors={colors}
      />

    </View>
  );
};
export default VocabType3;
