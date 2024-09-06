import { useState } from "react";
import { Text, View, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import CustomTextInput from "@/src/components/community/CustomTextInput";
import Button from "@/src/components/community/Button";
import { supabase } from "@/src/lib/supabase";

export default function ProfileScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState('');

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
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
    return (
      <View className="p-3">
      { image ? (
        <Image source={{ uri: image }}
        className="w-52 aspect-square self-center rounded-full bg-slate-300"/>
      ) :  (
        <View className="w-52 aspect-square  self-center rounded-full bg-slate-300" />
      )}

      <Text
      onPress={pickImage}
      className="text-blue-500 font-semibold m-5 self-center">
        Change
      </Text>

      <View className="gap-5">
        <CustomTextInput
          label="Username"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

      </View>

      {/* Button */}
      <View className="gap-2 mt-auto">
        <Button title="Update profile" onPress={() =>{}} />
        <Button title="Sign out" onPress={() => {supabase.auth.signOut()}} />
      </View>
      </View>
    )
}