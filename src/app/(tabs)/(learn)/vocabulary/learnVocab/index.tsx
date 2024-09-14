import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useLocalSearchParams } from "expo-router";
import BackButton from "@/src/components/BackButton";
import { ActivityIndicator, ScrollView, Platform, View, Text, StyleSheet, Dimensions, StatusBar as RNStatusBar } from 'react-native';
import Flashcard from '@/src/components/learnVocab/flashcard';
import RewriteVocab from '@/src/components/learnVocab/rewriteVocab';
import { getVocabList } from '@/src/fetchData/fetchLearn';
import ProgressTracker from '@/src/components/ProgressTracker';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import { useUserLearn } from "@/src/app/(tabs)/(learn)/ UserLearnContext";
import { completeLearningVocab } from '@/src/updateData/updateLearningProgress';

const { width, height } = Dimensions.get('screen');

const LearnVocab = () => {
  const router = useRouter();
  const user = useAuth();
  const navigation = useNavigation();
  const [vocabs, setVocabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incorrectVocabs, setIncorrectVocabs] = useState<any[]>([]);

  const {
    updateTopicVocab,
  } = useUserLearn();

  const params = useLocalSearchParams();
  const topicID = Number(params.topicID);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const vocabList = await getVocabList(topicID);
        setVocabs(vocabList);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const vocabsLength = vocabs.length;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <ProgressTracker
            current={currentIndex}
            all={Math.max(vocabs.length * 2 + incorrectVocabs.length - 1, 1)}
          />
          <View style={styles.headerFillerContainer} />
        </View>
      ),
      statusBarStyle: "dark",
    });
  }, [navigation, currentIndex, incorrectVocabs.length]);

  useEffect(() => {
    if (vocabsLength === 0 && !loading && !error) {
      completeLearningVocab(user.user?.id, topicID);
      updateTopicVocab(topicID, true, undefined);
      router.navigate(`/(tabs)/(learn)/resultScreenVG?correct=${0}&all=${0}&backTo=${'vocabulary'}&part=${'learning'}`);
    }
  }, [vocabsLength, loading, error]);


  if (loading) {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <ActivityIndicator size="large" color="#2980B9" />
            <Text style={{ marginTop: 10,fontSize: 20, fontWeight: '500', color: '#0693F1',}}>Loading...</Text>
        </View>
    );
  }

  if (error) {
    return <Text>Sorry! Failed to load Vocabulary</Text>;
  }

  const goToNextVocab = () => {
    if (currentIndex < vocabs.length * 2 + incorrectVocabs.length - 1) {
      const nextIndex = currentIndex + 1;
      //setCurrentIndex(nextIndex);npm 
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }
    else {
      completeLearningVocab(user.user?.id, topicID);
      updateTopicVocab(topicID, true, undefined);
      router.navigate(`/(tabs)/(learn)/resultScreenVG?correct=${vocabs.length}&all=${vocabs.length}&backTo=${'vocabulary'}&part=${'learning'}`);
    }
  };

  const handleIncorrectAnswer = (vocab: any) => {
    setIncorrectVocabs((prev) => [...prev, vocab]);
  };

  return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          onScroll={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            if (newIndex !== currentIndex) {
              setCurrentIndex(newIndex);
            }
          }}
          scrollEventThrottle={32}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          pagingEnabled
        >
          {vocabs.map((vocab, index) => (
            <View key={index} style={{ flexDirection: "row" }}>
              <Flashcard
                word={vocab.word}
                ipa={vocab.ipa}
                type={vocab.type}
                definition={vocab.definition}
                example={vocab.example}
                onNext={goToNextVocab}
              />
              <RewriteVocab
                word={vocab.word}
                ipa={vocab.ipa}
                type={vocab.type}
                definition={vocab.definition}
                example={vocab.example}
                onNext={goToNextVocab}
                onIncorrectAnswer={() => handleIncorrectAnswer(vocab)}
              />
            </View>
          ))}
          {/* Render các từ vựng sai */}
          {incorrectVocabs.map((vocab, index) => (
            <View key={`incorrect-${index}`} style={{ flexDirection: "row" }}>
              <RewriteVocab
                word={vocab.word}
                ipa={vocab.ipa}
                type={vocab.type}
                definition={vocab.definition}
                example={vocab.example}
                onNext={goToNextVocab}
                onIncorrectAnswer={() => handleIncorrectAnswer(vocab)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.0533,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 10 : 10,
    paddingBottom: 8,
  },
  headerFillerContainer: {
    height: height * 0.05,
    width: height * 0.05,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginTop: height*0.02,
  },
});

export default LearnVocab;
