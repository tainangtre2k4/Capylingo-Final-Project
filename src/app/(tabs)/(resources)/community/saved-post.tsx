import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import PostListItem from "@/src/components/community/PostListItem";
import Header from "@/src/components/community/Header";
import { useFocusEffect } from "@react-navigation/native";
import BackButton from "@/src/components/BackButton";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

type User = {
  id: string;
  username: string;
  avatar_url: string;
};

type Post = {
  id: number; // Ensure `id` is a number
  media_type: "image" | "video";
  image: string;
  caption: string;
  user: User;
  my_likes: { id: string }[];
  likesPost?: { count: number }[];
};

const SavedPostsScreen: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadSavedPosts();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton iconColor="black" />
          <View style={{ marginHorizontal: 8 }} />
          <Text style={styles.headerTitle}>Saved Posts</Text>
        </View>
      ),
    });
  }, [navigation]);

  const loadSavedPosts = async () => {
    setLoading(true);
    try {
      const savedPosts = await AsyncStorage.getItem("savedPosts");
      const savedPostsArray = savedPosts ? JSON.parse(savedPosts) : [];
      setSavedPosts(savedPostsArray);
    } catch (error) {
      console.error("Error loading saved posts:", error);
      Alert.alert("Error", "Failed to load saved posts.");
    }
    setLoading(false);
  };

  const confirmRemovePost = (postId: number) => {
    Alert.alert(
      "Remove Bookmark",
      "Are you sure you want to remove this post from your saved posts?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removePost(postId),
        },
      ]
    );
  };

  const removePost = async (postId: number) => {
    try {
      const updatedPosts = savedPosts.filter((post) => post.id !== postId);
      await AsyncStorage.setItem("savedPosts", JSON.stringify(updatedPosts));
      setSavedPosts(updatedPosts);
    } catch (error) {
      console.error("Error removing saved post:", error);
      Alert.alert("Error", "Failed to remove saved post.");
    }
  };

  const commentHandler = (post: Post) => {
    router.push(`/comment?postId=${post.id}`);
  };

  return (
    <View style={styles.container}>
      {savedPosts.length === 0 ? (
        <Text style={styles.noPostsText}>No saved posts available.</Text>
      ) : (
        <FlatList
          data={savedPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostListItem
              post={item}
              commentHandler={commentHandler}
              show={true}
              onRemove={() => confirmRemovePost(item.id)} // Add onRemove prop
              savePost={true}
            />
          )}
          refreshing={loading}
          onRefresh={loadSavedPosts}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "white",
    paddingHorizontal: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "black",
  },
  headerTitle: {
    fontSize: 22,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  }
});

export default SavedPostsScreen;
