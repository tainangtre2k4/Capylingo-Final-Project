import React, { useEffect, useState } from 'react';
import { useNavigation, router } from "expo-router";
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, Dimensions, Platform, StatusBar as RNStatusBar, TouchableOpacity } from 'react-native';
import { getVocabTopicList } from '@/src/fetchData/fetchLearn';
import CloudHeader from '@/src/components/CloudHeader';

const level = 1;
const { width, height } = Dimensions.get('screen');
const cardColors = ['#9BD2FC', '#F1C40F', '#16A085', '#2980B9'];

const TopicList = () => {
  const navigation = useNavigation();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const topicList = await getVocabTopicList(level);
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

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: cardColors[index % cardColors.length] }]}
            onPress={() => router.push({
              pathname: './learnTopic',
              params: { title: item.title, topicID: item.id }
            })}
          >
            <View style={styles.iconBackground}>
              <Image
                source={item.ImageUrl ? { uri: item.ImageUrl } : require('@/assets/images/learn/learn-greeter.png')}
                style={styles.image}
              />
            </View>
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
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
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 20 : 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.85,
    height: height * 0.105,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  iconBackground: {
    backgroundColor: 'orange',
    borderRadius: 33,
    width: 66,
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    flexShrink: 1,
  },
});

export default TopicList;
