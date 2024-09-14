import {
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar as RNStatusBar,
  Platform,
  Modal,
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
  const [postToDelete, setPostToDelete] = useState<number | null>(null); // Track the post to delete
  const [isAlertVisible, setIsAlertVisible] = useState(false); // Alert visibility

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

  const onRemovePost = (postId: number) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

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

  const deletePost = async (postId: number) => {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      Alert.alert("Error deleting post");
    } else {
      onRemovePost(postId); // Call onRemovePost to update UI
    }
    setIsAlertVisible(false); // Hide the custom alert
  };

  const confirmDelete = () => {
    if (postToDelete !== null) {
      deletePost(postToDelete); // Delete the post
    }
  };

  const handleDeletePress = (postId: number) => {
    setPostToDelete(postId); // Set the post ID to be deleted
    setIsAlertVisible(true); // Show custom alert modal
  };
  const commentHandler = (post: Post) => {
    // Logic for handling comments goes here
    router.push(`/(resources)/community/comment?postId=${post.id}`);
  };
  
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostListItem
            post={item}
            commentHandler={commentHandler}
            onRemove={() => handleDeletePress(item.id)} // Show custom alert
          />
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

      {/* Custom Alert Modal */}
      <Modal
        transparent={true}
        visible={isAlertVisible}
        animationType="fade"
        onRequestClose={() => setIsAlertVisible(false)}
      >
        <View style={styles.customAlertContainer}>
          <View style={styles.customAlertBox}>
            <Text style={styles.customAlertText}>
              Are you sure you want to delete this post?
            </Text>
            <View style={styles.customAlertButtonContainer}>
              <TouchableOpacity
                style={styles.customAlertButton}
                onPress={confirmDelete}
              >
                <Text style={styles.customAlertButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.customAlertButton}
                onPress={() => setIsAlertVisible(false)}
              >
                <Text style={styles.customAlertButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  customAlertContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  customAlertBox: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  customAlertText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  customAlertButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  customAlertButton: {
    padding: 10,
    backgroundColor: "#3DB2FF",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  customAlertButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FeedScreen;
