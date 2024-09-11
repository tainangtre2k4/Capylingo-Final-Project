import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Platform } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/src/components/(news)/Header'
import SearchBar from '@/src/components/(news)/SearchBar'
import axios from 'axios'
import { NewsDataType } from '@/constants/types'
import BreakingNews from '@/src/components/(news)/BreakingNews'
import Categories from '@/src/components/(news)/Categories'
import NewsList from '@/src/components/(news)/NewsList'
import Loading from '@/src/components/(news)/Loading'
import { router, useNavigation } from 'expo-router'
import BackButton from "@/src/components/BackButton";

type Props = {}

const News = (props: Props) => {
  const navigation = useNavigation();
  const {top: safeTop} = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(()=> {
    getBreakingNews();
    getNews();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <Text style={styles.headerTitle}>News</Text>
          <View style={styles.headerFillerContainer} />
        </View>
      ),
      ...Platform.select({
        android: {
          statusBarColor: 'white',
          statusBarStyle: 'dark',
        }
      })
    });
  }, [navigation]);

  const getBreakingNews = async() => {
    try {
      const URL = 'https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&country=us&language=en&image=1&removeduplicate=1&size=5'
      const response = await axios .get(URL);

      //console.log("News Data: ", response.data);
      if (response && response.data){
        setBreakingNews(response.data.results);
        setIsLoading(false);
      }
    } catch (err: any){
      console.log('Error Message: ', err.message);
    }
  }
  const getNews = async(category:string = '') => {
    try {
      let categoryString = '';
      if (category.length !== 0){
        categoryString = `&category=${category}`
      }
      const URL = `https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&country=us&language=en&image=1&removeduplicate=1&size=10${categoryString}`      
      const response = await axios .get(URL);

      //console.log("News Data: ", response.data);
      if (response && response.data){
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (err: any){
      console.log('Error Message: ', err.message);
    }
  }

  const onCatChanged = (category: string) => {
    console.log('Category: ', category)
    setNews([]);
    getNews(category);
  }
  return (
    <ScrollView style = {[styles.container, {paddingTop: 10}]}>
      <Header />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.discoverButton}
          onPress={() => router.push('/news/discover')}
        >
          <Text style={styles.discoverButtonText}>Discover</Text>
        </TouchableOpacity>

        {/* Saved Button */}
        <TouchableOpacity
          style={styles.savedButton}
          onPress={() => router.push('/news/saved')}  
        >
          <Text style={styles.savedButtonText}>Saved</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <Loading size = {'large'} />
      ) : (
      <BreakingNews newsList={breakingNews} />
    )}
    <Categories onCategoryChanged={onCatChanged}/>
    <NewsList newsList={news}/>
    </ScrollView>
  )
}

export default News

const styles = StyleSheet.create(
  {
    container: {
      //flex:1,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      backgroundColor: '#3DB2FF',
      paddingHorizontal: 20,
    },
    headerFillerContainer: {
      height: 42,
      width: 42,
      backgroundColor: 'transparent',
    },
    headerTitle: {
      fontSize: 24,
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row', // Aligns buttons in a row
      justifyContent: 'center',
      marginVertical: 10,
    },
    discoverButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 20,
      marginRight: 10, // Space between buttons
    },
    discoverButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    savedButton: {
      backgroundColor: '#FF6347',
      padding: 10,
      borderRadius: 20,
    },
    savedButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  }
)
