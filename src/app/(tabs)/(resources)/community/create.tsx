import { View, Text, Image, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/src/components/community/Button';
import { uploadImage } from '@/src/lib/cloudinary';
import { supabase } from '@/src/lib/supabase';
import { Video, ResizeMode } from 'expo-av';
import { useAuth } from '@/src/providers/AuthProvider';
import React from 'react';
import BackButton from '@/src/components/BackButton';

const create = () => {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | undefined>();
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();
  const navigation = useNavigation();

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
      setMediaType(result.assets[0].type);
    }
  };

  useEffect(() => {
    if (!media) pickMedia();
  }, [media]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton iconColor="black" />
          <View style={{ marginHorizontal: 8 }} />
          <Text style={styles.headerTitle}>New Post</Text>
        </View>
      ),
    });
  }, [navigation]);

  const createPost = async () => {
    if (!media) return;
    setLoading(true); // Start loading
    try {
      const response = await uploadImage(media);
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            caption,
            image: response?.public_id,
            user_id: user?.id,
            media_type: mediaType,
          },
        ])
        .select();

      if (!error) {
        router.back();
      } else {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View style={styles.container}>
      <View className="p-3 items-center">
        {!media ? (
          <View className="w-52 aspect-[3/4] rounded-lg bg-slate-300" />
        ) : mediaType === 'image' ? (
          <Image
            source={{ uri: media }}
            className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
          />
        ) : (
          <Video
            className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
            style={{ width: '100%', aspectRatio: 16 / 9 }}
            source={{ uri: media }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay
          />
        )}
        <Text onPress={pickMedia} className="text-blue-500 font-semibold m-5">
          Change
        </Text>

        {/* Caption */}
        <TextInput
          value={caption}
          onChangeText={(newValue) => setCaption(newValue)}
          placeholder="What is on your mind"
          className="w-full p-3"
        />

        <View className="w-full mt-40 items-center bg-blue-200">
          {loading ? ( // Show loading indicator while creating the post
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Share" onPress={createPost} />
          )}
        </View>
      </View>
    </View>
  );
};

export default create;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flex: 1,
    backgroundColor: 'white',
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