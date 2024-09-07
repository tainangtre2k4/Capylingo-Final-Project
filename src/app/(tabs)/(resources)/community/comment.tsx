import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert, ActivityIndicator, BackHandler } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import Header from '@/src/components/community/Header';
import PostListItem from '@/src/components/community/PostListItem';
import { useAuth } from '@/src/providers/AuthProvider';
// Define types for the search params, comments, post, and user
type SearchParams = {
  postId: string;
};

type User = {
  id: string;
  username: string;
  avatar_url: string;
};
type Comment = {
  id: number;
  content: string;
  user: {
    id: string;
    username: string;
  };
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


const CommentScreen: React.FC = () => {
  const { user } = useAuth(); // Get authenticated user from Clerk
  const router = useRouter();
  const { postId } = useLocalSearchParams<SearchParams>(); // Use the type for search params
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:profiles(*), my_likes:likesPost(*), likesPost(count)')
      .eq('id', postId)
      .single();

    if (error) {
      Alert.alert("Error fetching post");
    } else if (data) {
      setPost(data as Post);
    }
    setLoadingPost(false);
  };

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:profiles(*)')
      .eq('post_id', postId);

    if (error) {
      Alert.alert("Error fetching comments");
    } else if (data) {
      setComments(data as Comment[]); // Cast data to Comment[]
    }
    setLoading(false);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .insert([{ content: newComment, user_id: user?.id, post_id: postId }])
      .select('*, user:profiles(*)');

    if (error) {
      Alert.alert("Error adding comment");
    } else if (data) {
      setComments((prevComments) => [...prevComments, ...(data as Comment[])]);
      setNewComment('');
    }
    setLoading(false);
  };


  
  return (
    <View style={{ flex: 1 }}>
      <Header title='Comments' backHandler={()=>{router.back()}} search={false}/>
      
      {loadingPost ? (
        <ActivityIndicator size="large" color='#3DB2FF' />
      ) : post ? (
        <PostListItem post={post} commentHandler={() => {}} show={false}/> // Rendering PostListItem with the post data
      ) : (
        <Text style={{ padding: 16 }}>Post not found</Text>
      )}
      
      <View className='bg-white ml-5'>
        <Text className='text-2xl font-bold'>Comments</Text>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderWidth: 1, borderBottomColor: '#ccc',borderRadius: 16, margin: 6, }}>
            <Text style={{ fontWeight: 'bold' }}>{item.user.username}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ padding: 16 }}>No comments yet.</Text>}
        refreshing={loading}
        onRefresh={fetchComments}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16,backgroundColor:'white' }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <TextInput
          style={{ flex: 1, borderColor: 'gray', borderWidth: 1, padding: 8, marginRight: 8 }}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
        />
        <Button title="Send" onPress={addComment} disabled={loading} />
      </View>
    </View>
  );
};

export default CommentScreen;
