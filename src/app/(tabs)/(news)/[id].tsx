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
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, StyleSheet, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const WebViewScreen = () => {
  // Use useLocalSearchParams to access the URL
  const { url } = useLocalSearchParams<{ url: string }>();
  const [favourite, setFavourite] = useState('');

  return (
    <>
    <Stack.Screen options = {{
        headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name= "arrow-back" size = {22} />
            </TouchableOpacity>
    ),
    title: "News Detail"
}
    } />
    <View style={styles.container}>
    <WebView
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
