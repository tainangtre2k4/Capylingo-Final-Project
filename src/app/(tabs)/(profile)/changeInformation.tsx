import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { supabase } from '../../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { AdvancedImage } from 'cloudinary-react-native';
import colors from '@/constants/Colors';
import { cld, uploadImage } from '@/src/lib/cloudinary';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';

const Profile = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // State for managing update loading
  const [image, setImage] = useState<string | null>(null);
  const [remoteImage, setRemoteImage] = useState<string | null>(null);
  const defaultPizzaImage = 'https://wyudvuxiilqxhorovjcn.supabase.co/storage/v1/object/public/ProfileImage/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg';
  const router = useRouter();
  const { width } = useWindowDimensions();
  const user = useAuth();
  useEffect(() => {
      fetchUserData();
  }, []);

  // Fetch user data from Supabase
  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setFullName(data.full_name)
        setUserName(data.username);
        setRemoteImage(data.avatar_url)
      }
    } catch (error: any) {
      console.log('Error fetching user data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user data in Supabase
  const onSaveUser = async () => {
    setUpdating(true); // Start the loading indicator
    try {
      const updatedProfile = {
        id: user.user?.id,
        full_name: fullName,
        username: username,
        avatar_url: '',
      };
      if (image) {
        const response = await uploadImage(image);
        updatedProfile.avatar_url = response.public_id;
      }
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.user?.id);

      if (error) {
        throw error;
      }

      console.log('User data updated:', data);
      console.log('User data updated:', updatedProfile);
    } catch (e: any) {
      console.log('Error updating user data:', e.message);
    } finally {
      setUpdating(false); // Stop the loading indicator
      router.back();
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary.primary80} />;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Generate the Cloudinary image URL (without using hooks inside conditional statements)
  const remoteCldImage = remoteImage
    ? cld.image(remoteImage).resize(thumbnail().width(width).height(width))
    : null;

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 16 }}>
        {image ? (
          <Image
            source={{ uri: image || defaultPizzaImage }}
            className='w-52 aspect-square self-center rounded-full bg-slate-300'
          />
        ) : remoteCldImage ? (
          <AdvancedImage
            cldImg={remoteCldImage}
            className="w-52 aspect-square self-center rounded-full bg-slate-300"
          />
        ) : (
          <Image
            source={{ uri: defaultPizzaImage }}
            className='w-52 aspect-square self-center rounded-full bg-slate-300'
          />
        )}
        <Text onPress={pickImage}>
          Select Image
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 16 }}>Full Name</Text>
        <TextInput
          placeholder="Last Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.inputField}
        />
      </View>
      <View>
        <Text style={{ fontSize: 16 }}>User Name</Text>
        <TextInput
          placeholder="User Name"
          value={username}
          onChangeText={setUserName}
          style={styles.inputField}
        />
      </View>
      {updating ? (
        <ActivityIndicator size="large" color={colors.primary.primary80} />
      ) : (
        <TouchableOpacity onPress={onSaveUser} style={styles.button}>
          <Text style={{ fontSize: 20, color: '#fff' }}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
  },
  inputField: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    borderRadius: 40,
    padding: 18,
    fontSize: 16,
    height: 55,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  button: {
    marginTop: 16,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary.primary80,
    borderRadius: 40,
  },
});

export default Profile;
