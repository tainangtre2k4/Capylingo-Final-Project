import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatFaceData from '@/constants/ChatFaceData';
import Header from '@/src/components/community/Header';
import { useRouter } from 'expo-router';

interface ChatFace {
  id: number;
  name: string;
  image: string;
  primary: string;
  secondary: string;
}

export default function HomeScreen() {
  const [chatFaceData, setChatFaceData] = useState<ChatFace[]>([]);
  const [selectedChatFace, setSelectedChatFace] = useState<ChatFace | null>(null);
  const router = useRouter(); // Place useRouter inside the component

  useEffect(() => {
    setChatFaceData(ChatFaceData);
    checkFaceId();
  }, []);

  const checkFaceId = async () => {
    const id = await AsyncStorage.getItem('chatFaceId');
    id ? setSelectedChatFace(ChatFaceData[parseInt(id)]) : setSelectedChatFace(ChatFaceData[0]);
  };

  const onChatFacePress = async (id: number) => {
    setSelectedChatFace(ChatFaceData[id - 1]);
    await AsyncStorage.setItem('chatFaceId', (id - 1).toString());
  };

  if (!selectedChatFace) return null;

  return (
    <View>
      <Header title={'Chat Bot'} backHandler={() => {router.back();}} search={false} />

      <View className="items-center pt-5">
        <Text className={`text-2xl`} style={{ color: selectedChatFace.primary }}>
          Hello,
        </Text>
        <Text className={`text-2xl font-bold`} style={{ color: selectedChatFace.primary }}>
          I am {selectedChatFace.name}
        </Text>
        <Image source={{ uri: selectedChatFace.image }} className="h-36 w-36 mt-5" />
        <Text className="mt-8 text-xl">How Can I help you?</Text>

        <View className="mt-5 bg-gray-100 items-center h-28 p-2.5 rounded-lg">
          <FlatList
            data={chatFaceData}
            horizontal={true}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              if (item.id === selectedChatFace.id) {
                return null;
              }
              return (
                <TouchableOpacity className="m-3.5" onPress={() => onChatFacePress(item.id)}>
                  <Image source={{ uri: item.image }} className="w-10 h-10" />
                </TouchableOpacity>
              );
            }}
          />
          <Text className="mt-1.5 text-lg text-gray-400">Choose Your Fav ChatBuddy</Text>
        </View>

        <TouchableOpacity
          className="mt-10 py-4 w-3/5 rounded-full items-center"
          style={{ backgroundColor: selectedChatFace.primary }}
          onPress={() => {router.push('/chatbot/chatScreen')}}
        >
          <Text className="text-base text-white">Let's Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
