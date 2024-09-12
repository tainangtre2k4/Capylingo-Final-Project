import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import PostListItem from '@/src/components/community/PostListItem';
import Header from '@/src/components/community/Header';
import { router, useNavigation } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import BackButton from '@/src/components/BackButton';

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
  const navigation = useNavigation();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton iconColor="black" />
          <View style={{ marginHorizontal: 8 }} />
          <Text style={styles.headerTitle}>My Posts</Text>
        </View>
      ),
    });
  }, [navigation]);

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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
  },
  headerTitle: {
    fontSize: 22,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  }
});

export default MyPostsScreen;
