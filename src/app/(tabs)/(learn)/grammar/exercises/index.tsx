import { ActivityIndicator, Platform, Image, Modal, TouchableOpacity, Text, StyleSheet, Dimensions, ScrollView, View, StatusBar as RNStatusBar } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation, useLocalSearchParams } from "expo-router";
import ProgressTracker from '@/src/components/ProgressTracker';
import { StatusBar } from "expo-status-bar";
import { useRouter } from 'expo-router';
import { getGrammarExType1List, getGrammarExType2List, getGrammarExType3List } from '@/src/fetchData/fetchLearn'
import BackButton from "@/src/components/BackButton";
import ExGrammarType1 from '@/src/components/exercise/GrammarType1/GrammarType1';
import ExGrammarType2 from '@/src/components/exercise/GrammarType2/GrammarType2';
import ExGrammarType3 from '@/src/components/exercise/VocabType2/VocabType2';
import { completedPracticingGrammar } from '@/src/updateData/updateLearningProgress';
import { useAuth } from '@/src/providers/AuthProvider';

const { width, height } = Dimensions.get('screen');

const GrammarExercises = () => {
  const navigation = useNavigation();
  const user = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numberCorrectAnswers, setNumberCorrectAnswers] = useState(0);
  const [numberIncorrectAnswers, setNumberIncorrectAnswers] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [grammarType1Exercises, setGrammarType1Exercises] = useState<any[]>([]);
  const [grammarType2Exercises, setGrammarType2Exercises] = useState<any[]>([]);
  const [grammarType3Exercises, setGrammarType3Exercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const { topicID } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const type1Data = await getGrammarExType1List(topicID);
        const type2Data = await getGrammarExType2List(topicID);
        const type3Data = await getGrammarExType3List(topicID);

        setGrammarType1Exercises(type1Data);
        setGrammarType2Exercises(type2Data);
        setGrammarType3Exercises(type3Data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exerciseLength = grammarType1Exercises.length + grammarType2Exercises.length + grammarType3Exercises.length;

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
      ...Platform.select({
        android: {
          statusBarColor: 'white',
          statusBarStyle: 'dark',
        }
      })
    });
  }, [navigation, currentIndex, exerciseLength]);

  useEffect(() => {
    if (exerciseLength === 0 && !loading && !error) {
      completedPracticingGrammar(user.user?.id, topicID);
      router.push(`/(tabs)/(learn)/resultScreen?correct=${0}&all=${0}`);
    }
  }, [exerciseLength, loading, error]);

  if (loading) {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <ActivityIndicator size="large" color="#2980B9" />
            <Text style={{ marginTop: 10,fontSize: 20, fontWeight: '500', color: '#0693F1',}}>Loading...</Text>
        </View>
    );
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

        if (numberCorrectAnswers/exerciseLength >= 0.8){
          completedPracticingGrammar(user.user?.id, topicID);
        }

        router.push(`/(tabs)/(learn)/resultScreen?correct=${numberCorrectAnswers}&all=${exerciseLength}`);
      } else {
        setModalVisible(true);
      }
    }
  };

  const handleModalSubmit = () => {
    setModalVisible(false);
    router.push(`/(tabs)/(learn)/resultScreen?correct=${numberCorrectAnswers}&all=${exerciseLength}`);
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
          {grammarType1Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type1-${index}`}>
              <ExGrammarType1
                key={index}
                onNext={goToNextExercise}
                question={exercise.question}
                answer={exercise.answer}
                onCorrectAnswer={() => setNumberCorrectAnswers(prev => prev + 1)}
                onIncorrectAnswer={() => setNumberIncorrectAnswers(prev => prev + 1)}
              />
            </View>
          ))}

          {grammarType2Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type2-${index}`}>
              <ExGrammarType2
                key={index}
                onNext={goToNextExercise}
                words={exercise.words}
                correctAnswer={exercise.correctAnswer}
                onCorrectAnswer={() => setNumberCorrectAnswers(prev => prev + 1)}
                onIncorrectAnswer={() => setNumberIncorrectAnswers(prev => prev + 1)}
              />
            </View>
          ))}
          {grammarType3Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type3-${index}`}>
              <ExGrammarType3
                key={index}
                onNext={goToNextExercise}
                question={exercise.question}
                correctAnswerIndex={exercise.correctAnswerIndex - 1}
                answers={exercise.answers}
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
    width: width * 0.14,
    height: width * 0.14,
    resizeMode: 'contain',
    position: 'absolute',
    top: -0.08 * width,
    right: -2,
  },
  modalContent: {
    width: '82%',
    padding: 0.066 * width,
    backgroundColor: 'white',
    borderRadius: 0.04 * width,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: height * 0.025,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonCancel: {
    backgroundColor: '#A9A9A9',
    padding: 0.026 * width,
    borderRadius: 0.026 * width,
    flex: 1,
    marginRight: 0.026 * width,
    alignItems: 'center',
  },
  modalButtonSubmit: {
    backgroundColor: '#4095F1',
    padding: 0.026 * width,
    borderRadius: 0.026 * width,
    flex: 1,
    marginLeft: 0.026 * width,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
  },
});

export default GrammarExercises;