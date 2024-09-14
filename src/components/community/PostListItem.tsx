import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { AdvancedImage } from 'cloudinary-react-native';
import { cld } from '@/src/lib/cloudinary';
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/src/lib/supabase';
import PostContent from './PostContent';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/src/providers/AuthProvider';
import { fit } from "@cloudinary/url-gen/actions/resize";


// Define types for Post, User, and the handler functions
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
  comments?: {count: number}[];
};


type PostListItemProps = {
  post: Post;
  commentHandler: (post: Post) => void;
  show?: boolean;
  onRemove?: () => void;
  savePost?: boolean;
};

export default function PostListItem({ post, commentHandler, show = true, onRemove = () => {}, savePost = false }: PostListItemProps) {
  const { user } = useAuth(); // Current authenticated user
  const [isLiked, setIsLiked] = useState(false);
  const [likeRecord, setLikeRecord] = useState<{ id: string } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Only show delete button for the user's own post and if the post is not saved
  const canDelete = post.user.id === user?.id && !isSaved;

  useEffect(() => {
    if (post.my_likes.length > 0) {
      setLikeRecord(post.my_likes[0]);
      setIsLiked(true);
    }
  }, [post.my_likes]);

  useEffect(() => {
    if (isLiked) {
      saveLike();
    } else {
      deleteLike();
    }
  }, [isLiked]);

  useFocusEffect(
    useCallback(() => {
      checkIfSaved();
    }, [])
  );

  const checkIfSaved = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('savedPosts');
      const savedPostsArray: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
      const isPostSaved = savedPostsArray.some((savedPost) => savedPost.id === post.id);
      setIsSaved(isPostSaved);
    } catch (error) {
      console.error('Error checking if post is saved:', error);
    }
  };

  const toggleSave = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('savedPosts');
      let savedPostsArray: Post[] = savedPosts ? JSON.parse(savedPosts) : [];

      if (isSaved) {
        savedPostsArray = savedPostsArray.filter((savedPost) => savedPost.id !== post.id);
      } else {
        savedPostsArray.push(post);
      }

      await AsyncStorage.setItem('savedPosts', JSON.stringify(savedPostsArray));
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving/removing post:', error);
    }
  };

  const saveLike = async () => {
    if (likeRecord) return;
    const { data, error } = await supabase.from('likesPost').insert([
      {
        user_id: user?.id,
        post_id: post.id,
      },
    ]).select('*');
    if (error) console.log(error);
    if (data) {
      setLikeRecord(data[0]);
    }
  };

  const deleteLike = async () => {
    if (likeRecord) {
      const { error } = await supabase.from('likesPost').delete().eq('id', likeRecord.id);
      if (!error) setLikeRecord(null);
    }
  };

  const avatarUrl = post.user.avatar_url;
  const avatar = cld.image(
    avatarUrl 
      ? avatarUrl
      : 'user_ynfjc7'
  );
  avatar.resize(fit().width(48).height(48));

  return (
    <View className='bg-white'>
      <View className='p-3 flex-row items-center gap-2'>
        <AdvancedImage
          cldImg={avatar}
          className='w-12 aspect-square rounded-full'
        />
        <Text className='font-semibold'>{post.user.username || 'New User'}</Text>
      </View>

      <PostContent post={post} />

      <Text className='m-3'>
          <Text className='font-semibold'>{post.user.username} </Text>
          {post.caption}
      </Text>

      {/* Icons */}
      {show && (
        <View className="flex-row gap-3 p-3">
          <AntDesign
            onPress={() => setIsLiked(!isLiked)}
            name={isLiked ? 'heart' : 'hearto'}
            size={20}
            color={isLiked ? 'crimson' : 'black'}
          />
          <Ionicons onPress={() => commentHandler(post)} name="chatbubble-outline" size={20} />
          <Feather name="send" size={20} />
          <TouchableOpacity onPress={() => {
            if (!isSaved) {
              toggleSave();
            } else if (savePost) {
              onRemove();
            } else {
              toggleSave();
            }
          }}>
            <Feather
              name="bookmark"
              size={20}
              color={isSaved ? 'crimson' : 'black'}
              className="ml-auto"
            />
          </TouchableOpacity>

          {/* Show delete button only if the user owns the post and the post is not saved */}
          {canDelete && (
            <TouchableOpacity onPress={onRemove}>
              <AntDesign name="delete" size={20} color="red" className="ml-auto" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View className='px-3 gap-1'>
        {show && 
        <View className='flex-row gap-5'>
        <Text className='font-semibold'>{post.likesPost?.[0]?.count || 0} likes</Text>
        <Text className='font-semibold'>{post.comments?.[0]?.count || 0} comments</Text>
        </View>
        }
      </View>
    </View>
  );
}
