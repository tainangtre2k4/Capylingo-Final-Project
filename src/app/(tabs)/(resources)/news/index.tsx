import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/src/components/(news)/Header";
import SearchBar from "@/src/components/(news)/SearchBar";
import axios from "axios";
import { NewsDataType } from "@/constants/types";
import BreakingNews from "@/src/components/(news)/BreakingNews";
import Categories from "@/src/components/(news)/Categories";
import NewsList from "@/src/components/(news)/NewsList";
import Loading from "@/src/components/(news)/Loading";
import { router, useNavigation } from "expo-router";
import BackButton from "@/src/components/BackButton";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const News = (props: Props) => {
  const navigation = useNavigation();
  const { top: safeTop } = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBreakingNews();
    getNews();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BackButton iconColor="black"/>
            <View style={{ marginHorizontal: 4 }} />
            <Text style={styles.headerTitle}>News</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.headerRightIcon}
              onPress={() => router.push("/news/discover")}
            >
              <Ionicons name="search-outline" size={20} color="black" />
            </TouchableOpacity>
            <View style={{ marginHorizontal: 4 }} />
            <TouchableOpacity
              style={styles.headerRightIcon}
              onPress={() => router.push("/news/saved")}
            >
              <Ionicons name="bookmark-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      ),
      ...Platform.select({
        android: {
          statusBarColor: "white",
          statusBarStyle: "dark",
        },
      }),
    });
  }, [navigation]);

  const getBreakingNews = async () => {
    try {
      const URL =
        "https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&country=us&language=en&image=1&removeduplicate=1&size=5";
      const response = await axios.get(URL);

      //console.log("News Data: ", response.data);
      if (response && response.data) {
        setBreakingNews(response.data.results);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.log("Error Message: ", err.message);
    }
  };
  const getNews = async (category: string = "") => {
    try {
      let categoryString = "";
      if (category.length !== 0) {
        categoryString = `&category=${category}`;
      }
      const URL = `https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&country=us&language=en&image=1&removeduplicate=1&size=10${categoryString}`;
      const response = await axios.get(URL);

      //console.log("News Data: ", response.data);
      if (response && response.data) {
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.log("Error Message: ", err.message);
    }
  };

  const onCatChanged = (category: string) => {
    console.log("Category: ", category);
    setNews([]);
    getNews(category);
  };
  return (
    <ScrollView style={[styles.container, { paddingTop: 10 }]}>
      {isLoading ? (
        <Loading size={"large"} />
      ) : (
        <BreakingNews newsList={breakingNews} />
      )}
      <Categories onCategoryChanged={onCatChanged} />
      <NewsList newsList={news} />
    </ScrollView>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    //flex:1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    textAlign: "center",
    // color: 'black',
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row", // Aligns buttons in a row
    justifyContent: "center",
    marginVertical: 10,
  },
  headerRightIcon: {
    padding: 9,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "black",
  },
  // discoverButton: {
  //   backgroundColor: "#007BFF",
  //   padding: 10,
  //   borderRadius: 20,
  //   marginRight: 10, // Space between buttons
  // },
  discoverButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // savedButton: {
  //   backgroundColor: "#FF6347",
  //   padding: 10,
  //   borderRadius: 20,
  // },
  savedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
