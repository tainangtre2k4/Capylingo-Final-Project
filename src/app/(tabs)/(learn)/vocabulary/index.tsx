import React, { useEffect, useState } from 'react';
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, StyleSheet, Dimensions, Platform, StatusBar as RNStatusBar, TouchableOpacity, Image } from 'react-native';
import { getVocabTopicList } from '@/src/fetchData/fetchLearn';
import { AdvancedImage } from "cloudinary-react-native";
import { cld } from "@/src/lib/cloudinary";
import { fit } from "@cloudinary/url-gen/actions/resize";
import CloudHeader from '@/src/components/CloudHeader';
import { useAuth } from '@/src/providers/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';

type CompletedTopic = {
  completedLearning: number;
  completedPracticing: number;
};
const { width, height } = Dimensions.get('screen');
const cardColors = ['#9BD2FC', '#F1C40F', '#16A085', '#2980B9'];

const TopicList = () => {
  const navigation = useNavigation();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const level = Number(params.level);
  const user = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const topicList = await getVocabTopicList(user.user?.id, level);
        setTopics(topicList);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <CloudHeader title='Vocabulary'/>
        </View>
      ),
    });
  }, [navigation]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Sorry! Failed to load Vocabulary</Text>;
  }
  console.log(topics);
  topics.forEach((topic) => {
    console.log('Topic:', topic.title);
    console.log('CompletedTopicVocab:', topic.CompletedTopicVocab);
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        renderItem={({ item, index }) => {
          let imageContent;

          if (item.ImageUrl) {
            const image = cld.image(item.ImageUrl);
            image.resize(fit().width(100).height(100)); // Resize ảnh Cloudinary
            imageContent = (
              <AdvancedImage
                cldImg={image}
                style={styles.image}
                accessibilityLabel={item.title}
              />
            );
          } else {
            imageContent = (
              <Image
                source={require('@/assets/images/learn/learnVocab/topicDefault.png')}
                style={styles.image}
              />
            );
          }
          // Kiểm tra completedLearning và completedPracticing
          const isCompleted = item.CompletedTopicVocab?.some((completed: CompletedTopic) =>
            completed.completedLearning && completed.completedPracticing
          );
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: cardColors[index % cardColors.length] }]}
              onPress={() => router.push(`/(learn)/vocabulary/learnTopic?title=${item.title}&topicID=${item.id}&imageUrl=${item.ImageUrl}`)}
            >
              <View style={styles.textBox}>
                <Text style={styles.cardText}>{item.title}</Text>
              </View>

              {imageContent}

              {isCompleted && (
                <>
                <Text>{item.topic}</Text>
                <Icon 
                  name="checkmark-circle" 
                  size={32} 
                  color="white" 
                  style={styles.checkIcon} 
                />
                </>
              )}
           
              
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: height*0.0246,
    paddingTop: height*0.031,
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 20 : 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.85,
    height: height * 0.113,
    padding: height * 0.01,
    marginVertical: 8,
    borderRadius: 16,
  },
  image: {
    width: height * 0.095,
    height: height * 0.095,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  textBox: {
    marginTop: width*0.02,
    marginLeft: width*0.064,
    width: width*0.53,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
  },
  checkIcon: {
    position: 'absolute',
    top: width*0.015,
    left: width*0.03,
  },
});

export default TopicList;
