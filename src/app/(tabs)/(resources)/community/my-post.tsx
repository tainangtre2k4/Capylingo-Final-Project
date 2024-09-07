import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import PostListItem from '@/src/components/community/PostListItem';
import Header from '@/src/components/community/Header';
import { router } from 'expo-router';
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


const MyPostsScreen: React.FC = () => {
  const { user } = useAuth(); // Get authenticated user from Clerk
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, user:profiles(*), my_likes:likesPost(*), likesPost(count)')
        .eq('user_id', user?.id); // Filter posts by the current user

      if (error) {
        Alert.alert('Error', 'Failed to load your posts.');
      } else {
        setMyPosts(data);
      }
    } catch (error) {
      console.error('Error fetching my posts:', error);
    }
    setLoading(false);
  };

  const commentHandler = (post: Post) => {
    router.push(`/(resources)/community/comment?postId=${post.id}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Posts"
        backHandler={() => router.back()}
        search={false}
      />

      {myPosts.length === 0 ? (
        <Text style={styles.noPostsText}>You have not posted anything yet.</Text>
      ) : (
        <FlatList
          data={myPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostListItem
              post={item}
              commentHandler={commentHandler}
              show={true}
            />
          )}
          refreshing={loading}
          onRefresh={fetchMyPosts}
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

export default MyPostsScreen;
