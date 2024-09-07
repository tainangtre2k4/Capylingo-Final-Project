import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import PostListItem from '@/src/components/community/PostListItem';
import Header from '@/src/components/community/Header';
import { useFocusEffect } from '@react-navigation/native';

type User = {
  id: string;
  username: string;
  avatar_url: string;
};

type Post = {
  id: number; // Ensure `id` is a number
  media_type: 'image' | 'video';
  image: string;
  caption: string;
  user: User,
  my_likes: { id: string }[];
  likesPost?: { count: number }[];
};


const SavedPostsScreen: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadSavedPosts();
    }, [])
  );

  const loadSavedPosts = async () => {
    setLoading(true);
    try {
      const savedPosts = await AsyncStorage.getItem('savedPosts');
      const savedPostsArray = savedPosts ? JSON.parse(savedPosts) : [];
      setSavedPosts(savedPostsArray);
    } catch (error) {
      console.error('Error loading saved posts:', error);
      Alert.alert('Error', 'Failed to load saved posts.');
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
      const updatedPosts = savedPosts.filter(post => post.id !== postId);
      await AsyncStorage.setItem('savedPosts', JSON.stringify(updatedPosts));
      setSavedPosts(updatedPosts);
    } catch (error) {
      console.error('Error removing saved post:', error);
      Alert.alert('Error', 'Failed to remove saved post.');
    }
  };

  const commentHandler = (post: Post) => {
    router.push(`/comment?postId=${post.id}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title='Saved Posts'
        backHandler={() => { router.back(); }}
        search={false}
      />
      
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
    backgroundColor: 'white',
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default SavedPostsScreen;
