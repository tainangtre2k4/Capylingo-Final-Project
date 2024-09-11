import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useLocalSearchParams } from "expo-router";
import { WebView } from 'react-native-webview';
import BackButton from "@/src/components/BackButton";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Platform, View, Text, StyleSheet, Dimensions, StatusBar as RNStatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import { completeLearningGrammar } from '@/src/updateData/updateLearningProgress';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

const { width, height } = Dimensions.get('screen');

const LearnGrammar = () => {
  const router = useRouter();
  const user = useAuth();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const topicID = Number(params.topicID);
  const lectureLink = params.lectureLink as string;

  useEffect(() => {
    if (lectureLink === 'null' || !lectureLink) {
      completeLearningGrammar(user.user?.id, topicID);
      router.push(`/(tabs)/(learn)/resultScreen?correct=${1}&all=${1}`);
    }
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <Text style={styles.headerTitle}>Grammar</Text>
          <TouchableOpacity 
            style={styles.doneButton} activeOpacity={0.6}
            onPress={()=> {
              completeLearningGrammar(user.user?.id, topicID);
              router.push(`/(tabs)/(learn)/resultScreen?correct=${1}&all=${1}`);
            }}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  if (lectureLink === 'null' || !lectureLink) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor='#f5f5f5' />
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          style = {{marginTop: 0}}
          source={{ uri: lectureLink }}
        />
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
    paddingVertical: height * 0.013,
    backgroundColor: '#3DB2FF',
    paddingHorizontal: width * 0.0533,
  },
  headerFillerContainer: {
    height: 42,
    width: 42,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  doneButton: {
    width: width*0.24,
    height: height * 0.045,
    borderRadius: 10,
    backgroundColor: '#99CC29',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700'
  },
  doneText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700'
  },
});

export default LearnGrammar;
