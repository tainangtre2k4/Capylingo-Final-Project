import { ActivityIndicator, StatusBar as RNStatusBar, StyleSheet, Text, View, Platform, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import BackButton from "@/src/components/BackButton";
import CircularProgress from '@/src/components/learn/CircularProgress';

const { width, height } = Dimensions.get('screen');

const LearnTopic: React.FC = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const router = useRouter();

  const level = Number(params.level);
  const vocabPercent = Number(params.vocabPercent);
  const grammarPercent = Number(params.grammarPercent);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <Text style={styles.headerTitle}>Level {level}</Text>
          <View style={styles.headerFillerContainer} />
        </View>
      ),
    });
  }, [navigation]);


  return (
      <View style={styles.container}>

          <View style={styles.buttonContainer}>
              <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#9BD2FC'}]}
                  onPress={() => router.push(`/vocabulary?level=${level}`)}
              >
                  <Image source={require('@/assets/images/level/vocab.png')} style={styles.imageBox}/>
                  <View style={styles.underline}>
                      <Text style={styles.buttonText}>Vocabulary</Text>
                  </View>
                  <View style={styles.circularProgress}>
                    <CircularProgress size={52} percentage={vocabPercent}/>
                  </View>
              </TouchableOpacity>

              <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#2980B9'}]}
                  onPress={() => router.push(`/grammar?level=${level}`)}
              >
                  <Image source={require('@/assets/images/level/grammar.png')} style={styles.imageBox}/>
                  <View style={styles.underline}>
                      <Text style={styles.buttonText}>Grammar</Text>
                  </View>
                  <View style={styles.circularProgress}>
                    <CircularProgress size={52} percentage={grammarPercent}/>
                  </View>
              </TouchableOpacity>
          </View>
          <Image
            source={require('@/assets/images/level/bottomDecore.png')}
            style={{width: width, height: width*0.275779, resizeMode: 'contain', position: 'absolute', bottom: 0}}
          />
      </View>
  );
};


export default LearnTopic;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 20 : 0,
        alignItems: 'center',
        height: height * 0.1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#3DB2FF',
    },
    headerTitle: {
        fontSize: 27,
        fontWeight: '600',
        color: '#fff',
        shadowColor: '#000',
    },
    headerFillerContainer: {
        height: 42,
        width: 42,
        backgroundColor: 'transparent',
    },
    buttonContainer: {
        marginTop: height * 0.03,
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#3DB2FF',
        width: width * 0.86,
        height: height * 0.17,
        marginTop: height * 0.05,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 4,
          height: 6,
        },
        borderWidth: 1,
        borderColor: '#EBEBEB',
        shadowOpacity: 0.3,
        shadowRadius: 3,

        elevation: 5,
    },
    imageBox: {
        width: height * 0.12,
        height: height * 0.12,
        borderRadius: height * 0.06,
        resizeMode: 'contain',

        marginLeft: 16,
        borderWidth: 3.5,
        borderColor: '#FF8504',
    },
    underline: {
        paddingVertical: width*0.015,
        marginLeft: width*0.05,
        borderBottomWidth: 2,
        width: width* 0.4,
        justifyContent: 'flex-start',
        borderColor: '#fff',
    },
    buttonText: {
        fontSize: 27,
        fontWeight: 'bold',
        color: '#fff',
    },
    circularProgress: {
        position: 'absolute',
        top: -13,
        right: -13,
    },
});
