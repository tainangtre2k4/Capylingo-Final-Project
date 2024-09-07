import { View, FlatList, Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '@/src/components/community/Header';
import PostListItem from '@/src/components/community/PostListItem';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons'; // Import icon for Saved posts
import { useAuth } from '@/src/providers/AuthProvider';

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


const FeedScreen = () => {
  const { user } = useAuth(); // Get authenticated user from Clerk
  const [posts, setPosts] = useState<Post[]>([]); // Define the type of posts as Post[]
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from('posts')
      .select('*,user:profiles(*),my_likes:likesPost(*),likesPost(count),comments(count)')
      .eq('my_likes.user_id', user?.id);
  
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
      <Header
        title='Community'
        backHandler={() => {router.back()}}
        navigateHandler={() => { router.push('/(resources)/community/create') }}
        search={false}
        create={true}
      />

      {/* Navigation to Saved Posts */}
      <View style={styles.savedPostsContainer}>
        <TouchableOpacity style={styles.savedPostsButton} onPress={() => router.push('/(resources)/community/saved-post')}>
          <Ionicons name="bookmark-outline" size={24} color="white" />
          <Text style={styles.savedPostsText}>Saved Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.savedPostsButton} onPress={() => router.push('/(resources)/community/my-post')}>
          <Ionicons name="document-outline" size={24} color="white" />
          <Text style={styles.savedPostsText}>My Posts</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} commentHandler={commentHandler} />}
        contentContainerStyle={{
          gap: 10,
          maxWidth: 512,
          alignSelf: 'center',
          width: '100%',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  savedPostsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF2442',
    padding: 10,
    borderRadius: 16,
    width: 150,
    justifyContent: 'center',
  },
  savedPostsText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
