import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, StyleSheet, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsDataType } from '@/constants/types';
import axios from 'axios';
import { colors } from 'react-native-elements';

const WebViewScreen = () => {
  // Use useLocalSearchParams to access the URL
  const { url } = useLocalSearchParams<{ url: string }>();
  const { id } = useLocalSearchParams<{id: string} > ();
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [bookmark, setBookmark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    getNews();
  }, []);

  useEffect(()=> {
    if (!isLoading) {
    renderBookmark(news[0].article_id);
    }
  }, [isLoading]);

  const getNews = async() => {
    try {
      const URL2 = `https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&id=${id}`;
      const response = await axios .get(URL2);

      //console.log("News Data: ", response.data);
      if (response && response.data){
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (err: any){
      console.log('Error Message: ', err.message);
    }
  }

  const saveBookmark = async (newsId: string) => {
    setBookmark(true);
    const token = await AsyncStorage.getItem("bookmark");
    if (token !== null) {
      const res = JSON.parse(token);
      let data = res.find((value: string) => value === newsId);
      if (data == null) {
        res.push(newsId);
        await AsyncStorage.setItem("bookmark", JSON.stringify(res));
        alert("News Saved!");
      }
    } else {
      let bookmark = [newsId];
      await AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
      alert("News Saved!");
    }
  };
  
  const removeBookmark = async (newsId: string) => {
    setBookmark(false);
    const token = await AsyncStorage.getItem("bookmark");
    if (token !== null) {
      const res = JSON.parse(token);
      const newBookmark = res.filter((id: string) => id !== newsId);
      await AsyncStorage.setItem("bookmark", JSON.stringify(newBookmark));
      alert("News unsaved!");
    }
  };
  
  const renderBookmark = async (newsId: string) => {
    const token = await AsyncStorage.getItem("bookmark");
    if (token !== null) {
      const res = JSON.parse(token);
      const data = res.find((value: string) => value === newsId);
      setBookmark(data != null);
    }
  };

  return (
    <>
   <Stack.Screen options={{
    headerLeft: () => (
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} />
      </TouchableOpacity>
    ),
    headerRight: () => (
      !isLoading ? (
        <TouchableOpacity onPress={() => bookmark ? removeBookmark(news[0].article_id) : saveBookmark(news[0].article_id)}>
          <Ionicons
            name={bookmark ? "heart" : "heart-outline"}
            size={22}
            color={bookmark ? "red" : colors.black}
          />
        </TouchableOpacity>
      ) : null 
    //   <TouchableOpacity onPress={() => bookmark ? removeBookmark(news[0].article_id) : saveBookmark(news[0].article_id)}>
    //   <Ionicons
    //     name={bookmark ? "heart" : "heart-outline"}
    //     size={22}
    //     color={bookmark ? "red" : colors.black}
    //   />
    // </TouchableOpacity>
    ),
    title: "News Detail",
  }} />

    <View style={styles.container}>
      <WebView
      originWhitelist={['*']}
      style = {{marginTop: 0}}
      source={{ uri: url }}
    />
    </View>
   

  </>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  container: {
    flex: 1,
    padding: 0,
    margin: 0
  },
  button: {
    marginVertical: 10,
  },
});
