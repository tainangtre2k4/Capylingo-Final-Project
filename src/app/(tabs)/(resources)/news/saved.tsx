import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Link, router, Stack, useNavigation } from "expo-router";
import Loading from "@/src/components/(news)/Loading";
import { NewsItem } from "@/src/components/(news)/NewsList";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import BackButton from "@/src/components/BackButton";

type Props = {};

const Saved = (props: Props) => {
  const [bookmarkNews, setBookmarkNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    fetchBookmark();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton iconColor="black" />
          <View style={{ marginHorizontal: 8 }} />
          <Text style={styles.headerTitle}>Saved</Text>
        </View>
      ),
    });
  }, [navigation]);

  const fetchBookmark = async () => {
    await AsyncStorage.getItem("bookmark").then(async (token) => {
      const res = JSON.parse(token);
      if (res) {
        console.log("Bookmark res: ", res);
        let query_string = res.join(",");
        console.log("Query string: ", query_string);

        const response = await axios.get(
          `https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&id=${query_string}`
        );
        const news = response.data.results;
        setBookmarkNews(news);
        setIsLoading(false);
      } else {
        setBookmarkNews([]);
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <Loading size={"large"} />
        ) : (
          <FlatList
            data={bookmarkNews}
            keyExtractor={(_, index) => `list_item${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Link
                href={`/news/${item.article_id}?url=${encodeURIComponent(
                  item.link
                )}`}
                asChild
              >
                <TouchableOpacity>
                  <NewsItem item={item} />
                </TouchableOpacity>
              </Link>
            )}
          />
        )}
      </View>
    </>
  );
};

export default Saved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  },
});
