import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useLocalSearchParams } from "expo-router";
import BackButton from "@/src/components/BackButton";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Platform, View, Text, StyleSheet, Dimensions, StatusBar as RNStatusBar } from 'react-native';
import Flashcard from '@/src/components/learnVocab/flashcard';
import RewriteVocab from '@/src/components/learnVocab/rewriteVocab';
import { getVocabList } from '@/src/fetchData/fetchLearn';
import ProgressTracker from '@/src/components/ProgressTracker';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import { completeLearningGrammar } from '@/src/updateData/updateLearningProgress';

const { width, height } = Dimensions.get('screen');

const LearnGrammar = () => {
  const router = useRouter();
  const user = useAuth();
  const navigation = useNavigation();
  const [vocabs, setVocabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incorrectVocabs, setIncorrectVocabs] = useState<any[]>([]);

  const { topicID } = useLocalSearchParams();



  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <Text>Learn Grammar</Text>
          <View style={styles.headerFillerContainer} />
        </View>
      ),
    });
  }, [navigation]);


  completeLearningGrammar(user.user?.id, topicID);
  router.push(`/(tabs)/(learn)/resultScreen?correct=${0}&all=${0}`);


  return (
    <>
      <StatusBar style="dark" backgroundColor='#f5f5f5' />
      <View style={styles.container}>
        <Text>Hello I am learn Grammar screen!</Text>
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
    paddingVertical: height * 0.01477,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: width * 0.0533,
  },
  headerFillerContainer: {
    height: height * 0.05,
    width: height * 0.05,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default LearnGrammar;
