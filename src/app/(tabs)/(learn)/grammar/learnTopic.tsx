import { ActivityIndicator, StatusBar as RNStatusBar, StyleSheet, Text, View, Platform, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import CloudHeader from '@/src/components/CloudHeader';
import { AdvancedImage } from "cloudinary-react-native";
import { cld } from "@/src/lib/cloudinary";
import { fit } from "@cloudinary/url-gen/actions/resize";

const { width, height } = Dimensions.get('screen');

const LearnTopic: React.FC = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const router = useRouter();

  const title = params.title as string;
  const topicID = Number(params.topicID);
  const imageUrl = params.imageUrl as string;
  const lectureLink = params.lectureLink as string;
  const completedLearning = params.completedLearning === 'true';
  const completedPracticing = params.completedPracticing === 'true';

  const [loading, setLoading] = useState(true);
  useEffect(() => {
      navigation.setOptions({
        headerShown: true,
        header: () => (
          <View style={styles.headerContainer}>
            <CloudHeader title={title}/>
          </View>
        ),
      });
  }, [navigation]);

  let imageContent;
  if (imageUrl !== 'null') {
      const image = cld.image(imageUrl);
      image.resize(fit().width(160).height(160)); // Resize ảnh Cloudinary
      imageContent = (
        <AdvancedImage
          cldImg={image}
          style={styles.image}
          onLoad={() => setLoading(false)}
        />
      );
  } else {
      imageContent = (
        <Image
          source={require('@/assets/images/learn/learnVocab/topicDefault.png')}
          style={styles.image}
          onLoad={() => setLoading(false)}
        />
      );
  }

  return (
      <View style={styles.container}>
          {loading && (
              <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#2980B9" />
                  <Text style={styles.loadingText}>Loading...</Text>
              </View>
          )}

          {imageContent}

          <View style={styles.buttonContainer}>
              <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#9BD2FC'}]}
                  onPress={() => router.push(`/(learn)/grammar/learnGrammar?topicID=${topicID}&lectureLink=${lectureLink}`)}
              >
                  {completedLearning && (
                    <Icon 
                      name="checkmark-circle" 
                      size={32} 
                      color="white" 
                      style={styles.checkIcon} 
                    />
                  )}
                  <Image source={require('@/assets/images/learn/learnVocab/learnVocabulary.png')} style={styles.imageBox}/>
                  <View style={styles.underline}>
                      <Text style={styles.buttonText}>Learn Grammar</Text>
                  </View>
              </TouchableOpacity>

              <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#2980B9'}]}
                  onPress={() => router.push(`/(learn)/grammar/exercises?topicID=${topicID}`)}
              >
                   {completedPracticing && (
                    <Icon 
                      name="checkmark-circle" 
                      size={32} 
                      color="white" 
                      style={styles.checkIcon} 
                    />
                  )}
                  <Image source={require('@/assets/images/learn/learnVocab/practiceExercises.png')} style={styles.imageBox}/>
                  <View style={styles.underline}>
                      <Text style={styles.buttonText}>Practice Exercises</Text>
                  </View>
              </TouchableOpacity>
          </View>
      </View>
  );
};


export default LearnTopic;

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 18,
      color: '#2980B9',
  },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
    },
    image: {
        width: height * 0.11,
        height: height * 0.11,
        resizeMode: 'contain',
        position: 'absolute',
        top: 0.019*height,
        right: 0.019*height,
    },
    buttonContainer: {
        marginTop: height * 0.12,
        alignItems: 'center',
    },
    button: {
      flexDirection: 'row',
      backgroundColor: '#3DB2FF',
      width: width * 0.86,
      height: height * 0.15,
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
      width: height * 0.1,
      height: height * 0.1,
      borderRadius: height * 0.05,
      resizeMode: 'contain',

      marginLeft: 16,
      borderWidth: 3.5,
      borderColor: '#FF8504',
    },
    underline: {
      paddingVertical: width*0.015,
      marginLeft: width*0.05,
      borderBottomWidth: 2,
      width: width* 0.47,
      justifyContent: 'center',
      borderColor: '#fff',
    },
    buttonText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
    },
    checkIcon: {
      position: 'absolute',
      top: width*0.022,
      right: width*0.028,
    },
});
