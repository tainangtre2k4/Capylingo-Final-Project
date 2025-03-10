import React, { useEffect, useState } from 'react';
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View, Text, FlatList, StyleSheet, Dimensions, Platform, StatusBar as RNStatusBar, TouchableOpacity, Image } from 'react-native';
import { getVocabTopicList } from '@/src/fetchData/fetchLearn';
import { AdvancedImage } from "cloudinary-react-native";
import { cld } from "@/src/lib/cloudinary";
import { fit } from "@cloudinary/url-gen/actions/resize";
import CloudHeader from '@/src/components/CloudHeader';
import { useAuth } from '@/src/providers/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserLearn } from "@/src/app/(tabs)/(learn)/ UserLearnContext";


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

  const {
    level: userLevel,
    TopicsVocab,
  } = useUserLearn();

  useEffect(() => {
    if (userLevel != level){
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const topicList = await getVocabTopicList(user.user?.id, level);
          const newVocabTopics = topicList.map((topic: any) => ({
            id: topic.id,
            title: topic.title,
            ImageUrl: topic.ImageUrl,
            isLearned: topic.CompletedTopicVocab.length > 0 ? topic.CompletedTopicVocab[0].completedLearning : false,
            isPracticed: topic.CompletedTopicVocab.length > 0 ? topic.CompletedTopicVocab[0].completedPracticing : false
          }));
          setTopics(newVocabTopics);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setTopics(TopicsVocab);
      setLoading(false);
    }
  }, [userLevel, TopicsVocab]);
  

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
           <CloudHeader title={`Vocabulary Lv${level}`} />
        </View>
      ),
    });
  }, [navigation]);

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

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        showsVerticalScrollIndicator = {false}
        renderItem={({ item, index }) => {
          let imageContent;

          if (item.ImageUrl) {
            const image = cld.image(item.ImageUrl);
            image.resize(fit().width(100).height(100));
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
        
          const isCompleted = item.isLearned && item.isPracticed
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: cardColors[index % cardColors.length] }]}
              onPress={() => {         
                router.push(`/(learn)/vocabulary/learnTopic?title=${item.title}&topicID=${item.id}&imageUrl=${item.ImageUrl}&completedLearning=${item.isLearned ? 'true' : 'false'}&completedPracticing=${item.isPracticed ? 'true' : 'false'}`);
              }}
            >
              <View style={styles.textBox}>
                <Text style={styles.cardText}>{item.title}</Text>
              </View>

              {imageContent}

              {isCompleted && (
                <Icon 
                  name="checkmark-circle" 
                  size={30} 
                  color="white" 
                  style={styles.checkIcon} 
                />
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
    paddingTop: height*0.03,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: "#3DB2FF",
    paddingTop: Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0,
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
    top: width*0.02,
    left: width*0.028,
  },
});

export default TopicList;