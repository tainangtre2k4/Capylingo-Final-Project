import { Platform, Image, Modal, TouchableOpacity, Text, StyleSheet, Dimensions, ScrollView, View, StatusBar as RNStatusBar } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from "expo-router";
import ProgressTracker from '@/src/components/ProgressTracker';
import { StatusBar } from "expo-status-bar";
import { useRouter } from 'expo-router';
import { getVocabExType1List, getVocabExType2List, getVocabExType3List} from '@/src/fetchData/fetchLearn'
import BackButton from "@/src/components/BackButton";
import ExVocabType1 from '@/src/components/exercise/VocabType1/VocabType1';
import ExVocabType2 from '@/src/components/exercise/VocabType2/VocabType2';
import ExVocabType3 from '@/src/components/exercise/VocabType3/VocabType3';


const { width, height } = Dimensions.get('screen');

const topicID = 1;

const VocabExercises = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numberCorrectAnswers, setNumberCorrectAnswers] = useState(0);
  const [numberIncorrectAnswers, setNumberIncorrectAnswers] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [vocabType1Exercises, setVocabType1Exercises] = useState<any[]>([]);
  const [vocabType2Exercises, setVocabType2Exercises] = useState<any[]>([]);
  const [vocabType3Exercises, setVocabType3Exercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const type1Data = await getVocabExType1List(topicID);
        const type2Data = await getVocabExType2List(topicID);
        const type3Data = await getVocabExType3List(topicID);

        setVocabType1Exercises(type1Data);
        setVocabType2Exercises(type2Data);
        setVocabType3Exercises(type3Data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exerciseLength = vocabType1Exercises.length + vocabType2Exercises.length + vocabType3Exercises.length;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <ProgressTracker current={currentIndex} all={Math.max(exerciseLength, 1)} />
          <View style={styles.headerFillerContainer} />
        </View>
      ),
    });
  }, [navigation, currentIndex, exerciseLength]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Failed to load exercises: {error}</Text>;
  }

  const goToNextExercise = () => {
    if (currentIndex < exerciseLength - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      const totalAnswered = numberCorrectAnswers + numberIncorrectAnswers;
      if (totalAnswered === exerciseLength) {
        router.push({
          pathname: '@/src/(tabs)/(learn)/vocabulary/exercises/resultScreen',
          params: {
            correctAnswers: numberCorrectAnswers,
            wrongAnswers: numberIncorrectAnswers,
            totalQuestions: exerciseLength,
          },
        });
      } else {
        setModalVisible(true);
      }
    }
  };

  const handleModalSubmit = () => {
    setModalVisible(false);
    router.push({
      pathname: './exercises/resultScreen',
      params: {
        correctAnswers: numberCorrectAnswers,
        wrongAnswers: numberIncorrectAnswers,
        totalQuestions: exerciseLength,
      },
    });
  };
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    
    <>
      <StatusBar style="dark" backgroundColor="white" />
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          onScroll={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            if (newIndex !== currentIndex) {
              setCurrentIndex(newIndex);
            }
          }}
          scrollEventThrottle={32}
          showsHorizontalScrollIndicator={false}
        >
          {vocabType1Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type1-${index}`}>
              <ExVocabType1
                key={index}
                onNext={goToNextExercise}
                questionImageUrl={exercise.questionImage}
                correctAnswerIndex={exercise.correctAnswerIndex-1}
                answers={exercise.answers}
                onCorrectAnswer={() => setNumberCorrectAnswers(prev => prev + 1)}
                onIncorrectAnswer={() => setNumberIncorrectAnswers(prev => prev + 1)}
              />
            </View>
          ))}

          {vocabType2Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type2-${index}`}>
              <ExVocabType2
                key={index}
                onNext={goToNextExercise}
                question={exercise.question}
                correctAnswerIndex={exercise.correctAnswerIndex-1}
                answers={exercise.answers}
                onCorrectAnswer={() => setNumberCorrectAnswers(prev => prev + 1)}
                onIncorrectAnswer={() => setNumberIncorrectAnswers(prev => prev + 1)}
              />
            </View>
          ))}
          {vocabType3Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type3-${index}`}>
              <ExVocabType3
                key={index}
                onNext={goToNextExercise}
                question={exercise.question}
                synonyms={exercise.synonyms}
                onCorrectAnswer={() => setNumberCorrectAnswers(prev => prev + 1)}
                onIncorrectAnswer={() => setNumberIncorrectAnswers(prev => prev + 1)}
              />
            </View>
          ))}
        </ScrollView>

        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={handleModalCancel}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={require('@/assets/images/capyDecoreBox.png')} style={styles.capyModal} />
              <Text style={styles.modalText}>You haven't completed all the questions. Are you sure you want to submit?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleModalCancel} style={styles.modalButtonCancel}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleModalSubmit} style={styles.modalButtonSubmit}>
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 20 : 0,
    paddingVertical: 12,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  headerFillerContainer: {
    height: 42,
    width: 42,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  capyModal: {
    width: width*0.14,
    height: width*0.14,
    resizeMode: 'contain',
    position: 'absolute',
    top: -0.08*width,
    right: -2,
  },
  modalContent: {
    width: '82%',
    padding: 0.066*width,
    backgroundColor: 'white',
    borderRadius: 0.04*width,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: height*0.025,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonCancel: {
    backgroundColor: '#A9A9A9',
    padding: 0.026*width,
    borderRadius: 0.026*width,
    flex: 1,
    marginRight: 0.026*width,
    alignItems: 'center',
  },
  modalButtonSubmit: {
    backgroundColor: '#4095F1',
    padding: 0.026*width,
    borderRadius: 0.026*width,
    flex: 1,
    marginLeft: 0.026*width,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
  },
});

export default VocabExercises;