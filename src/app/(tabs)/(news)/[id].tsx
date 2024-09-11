// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { router, Stack, useLocalSearchParams } from 'expo-router'
// import { Ionicons } from '@expo/vector-icons'
// import { NewsDataType } from '@/constants/types'
// import axios from 'axios'
// import Loading from '@/components/(news)/Loading'

// type Props = {}

// const NewsDetail = (props: Props) => {
//     const {id} = useLocalSearchParams<{id: string} > ();
//     const [news, setNews] = useState<NewsDataType[]>([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         getNews();
//     }, []);

//     const getNews = async() => {
//         try {
//           const URL = `https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&id=${id}`
//           const response = await axios .get(URL);
    
//           //console.log("News Data: ", response.data);
//           if (response && response.data){
//             setNews(response.data.results);
//             setIsLoading(false);
//           }
//         } catch (err: any){
//           console.log('Error Message: ', err.message);
//         }
//       }

//   return (
//     <>
//     <Stack.Screen options = {{
//         headerLeft: () => (
//             <TouchableOpacity onPress={() => router.back()}>
//                 <Ionicons name='arrow-back' size = {22} />
//             </TouchableOpacity>
//         ),
//         headerRight: () => (
//             <TouchableOpacity onPress={() => {}}>
//                 <Ionicons name='heart-outline' size = {22} />
//             </TouchableOpacity>
//         ),
//         title: ''
//     }} />
//     {isLoading ? (
//         <Loading size = {'large'} />
//     ): (   
//     <View>
//       <Text>{news[0].title} </Text>
//       <Text>{news[0].content} </Text>
//     </View>
//     )}
//     </>
//   )
// }

// export default NewsDetail

// const styles = StyleSheet.create({})
// WebViewScreen.tsx
// app/news/[id].tsx
// app/news/[id].tsx
// WebViewScreen.tsx
import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, StyleSheet, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsDataType } from '@/constants/types';
import axios from 'axios';
import Loading from '@/src/components/(news)/Loading';
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

  const saveBookmark = async(newsId:string) => {
    setBookmark(true);
    await AsyncStorage.getItem("bookmark").then((token) => {
      const res = JSON.parse(token);
      if( res !== null) {
        let data = res.find((value: string) => value === newsId);
        if (data == null) {
          res.push(newsId);
          AsyncStorage.setItem("bookmark", JSON.stringify(res));
          alert("News Saved!");
        }
      } else {
        let bookmark = [];
        bookmark.push(newsId);
        AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
        alert("News Saved!");
      }
    })
  }

  const removeBookmark = async(newsId:string) => {
    setBookmark(false);
    const bookmark = await AsyncStorage.getItem("bookmark").then((token) => {
      const res = JSON.parse(token);
      return res.filter((id: string) => id !== newsId);
    });
    await AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
    alert("News unsaved!")
  }

  const renderBookmark = async(newsId:string) => {
    await AsyncStorage.getItem("bookmark").then((token) => {
      const res = JSON.parse(token);
      if(res != null) {
        let data = res.find((value: string)=> value === newsId);
        return data == null ? setBookmark(false) : setBookmark(true);
      }
    });
  }

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
