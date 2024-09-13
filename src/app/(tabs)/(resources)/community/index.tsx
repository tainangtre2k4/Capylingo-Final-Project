import {
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar as RNStatusBar,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostListItem from "@/src/components/community/PostListItem";
import { useNavigation, useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"; // Import icon for Saved posts
import { useAuth } from "@/src/providers/AuthProvider";
import BackButton from "@/src/components/BackButton";

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

const FeedScreen = () => {
  const { user } = useAuth(); // Get authenticated user from Clerk
  const [posts, setPosts] = useState<Post[]>([]); // Define the type of posts as Post[]
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BackButton iconColor="black" />
            <View style={{ marginHorizontal: 8 }} />
            <Text style={styles.headerTitle}>Community</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.headerRightIcon}
              onPress={() => router.push("/community/saved-post")}
            >
              <Ionicons name="bookmark-outline" size={20} color="black" />
            </TouchableOpacity>
            <View style={{ marginHorizontal: 6 }} />
            <TouchableOpacity
              style={styles.headerRightIcon}
              onPress={() => router.push("/community/my-post")}
            >
              <MaterialCommunityIcons
                name="post-outline"
                size={20}
                color="black"
              />
            </TouchableOpacity>
            <View style={{ marginHorizontal: 6 }} />
            <TouchableOpacity
              style={styles.headerRightIcon}
              onPress={() => router.push("/community/create")}
            >
              <MaterialIcons name="post-add" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
  }, [navigation]);

  const fetchPosts = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from("posts")
      .select(
        "*,user:profiles(*),my_likes:likesPost(*),likesPost(count),comments(count)",
      )
      .eq("my_likes.user_id", user?.id);

    if (error) {
      Alert.alert("Something went wrong!");
      setLoading(false);
      return;
    }

    if (!data) {
      Alert.alert("No posts found");
      setLoading(false);
      return;
    }

    // Sort posts by id (numerically)
    const sortedPosts = data.sort((a: Post, b: Post) => b.id - a.id);
    setPosts(sortedPosts); // Set sortedPosts to posts
    setLoading(false);
  };

  const commentHandler = (post: Post) => {
    router.push(`/(resources)/community/comment?postId=${post.id}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostListItem post={item} commentHandler={commentHandler} />
        )}
        contentContainerStyle={{
          gap: 10,
          maxWidth: 512,
          alignSelf: "center",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchPosts}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  savedPostsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-around",
    backgroundColor: "white",
  },
  savedPostsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF2442",
    padding: 10,
    borderRadius: 16,
    width: 150,
    justifyContent: "center",
  },
  savedPostsText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "black",
    paddingTop:
      Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
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
});

export default FeedScreen;
