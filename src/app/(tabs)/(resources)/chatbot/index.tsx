import React, { useState, useEffect, useCallback } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StatusBar as RNStatusBar,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
  IMessage,
  InputToolbarProps,
  BubbleProps,
  SendProps,
} from "react-native-gifted-chat";
import { FontAwesome } from "@expo/vector-icons";
import GlobalApi from "@/src/utils/globalApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";
import BackButton from "@/src/components/BackButton";
interface ChatUser {
  _id: string | number; // Adjusted to match IMessage type
  name: string;
  avatar: string;
}

interface ChatMessage extends IMessage {
  user: ChatUser;
}

const CHAT_BOT_FACE_DEFAULT =
  "https://res.cloudinary.com/dnfxraert/image/upload/v1725883301/k2sqmmubwd2ampt9co0j.png";

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkFaceId();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton iconColor="black" />
          <View style={{ marginHorizontal: 8 }} />
          <Text style={styles.headerTitle}>AI Chatbot</Text>
        </View>
      ),
    });
  }, [navigation]);

  const checkFaceId = async () => {
    try {
      setMessages([
        {
          _id: 1,
          text: `Hello, I am Raichu, How Can I help you?
          \nThe first message can be longer, please wait a minute.
          \nIf any error occurs, please reopen the chat bot, and I'll be back to assist you.`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: CHAT_BOT_FACE_DEFAULT, // Directly use faceData.image here
          },
        } as ChatMessage,
      ]);
    } catch (error) {
      console.error("Failed to retrieve chat face id:", error);
    }
  };

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages as ChatMessage[]),
    );
    if (messages[0]?.text) {
      getBardResp(messages[0].text);
    }
  }, []); // Add chatBotFace as a dependency here

  const getBardResp = async (msg: string, retries = 3) => {
    setLoading(true);
    for (let i = 0; i < retries; i++) {
      try {
        const resp = await GlobalApi.getGeminiApi(msg);
        const responseContent =
          resp.data.response || "Sorry, I cannot help with it";
        const chatAIResp: ChatMessage[] = [
          {
            _id: Math.random() * (9999999 - 1),
            text: responseContent,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "ChatBot", // You can change this name as needed
              avatar: CHAT_BOT_FACE_DEFAULT, // Ensure avatar is the current chatBotFace
            },
          },
        ];
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, chatAIResp),
        );
        break; // Exit loop if successful
      } catch (error) {
        if (i < retries - 1) {
          await new Promise((res) => setTimeout(res, 1000)); // Wait before retrying
        } else {
          console.error("Failed to fetch response:", error);

          let errorMessage = "An error occurred. Please try again later.";
          if (error instanceof Error) {
            // Check if it's an Axios error (or any error with `response`)
            const axiosError = (error as any)?.response?.data?.message;
            errorMessage = axiosError || error.message;
          }

          const errorResponse: ChatMessage[] = [
            {
              _id: Math.random() * (9999999 - 1),
              text: errorMessage,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: "ChatBot",
                avatar: CHAT_BOT_FACE_DEFAULT,
              },
            },
          ];
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, errorResponse),
          );
        }
      }
    }
    setLoading(false);
  };

  const renderBubble = (props: BubbleProps<ChatMessage>) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "blue" || "#671ddf" }, // Use chatFaceColor for bubble color
        left: {},
      }}
      textStyle={{
        right: { padding: 2 },
        left: { color: "blue" || "#671ddf", padding: 2 },
      }}
    />
  );

  const renderInputToolbar = (props: InputToolbarProps<ChatMessage>) => (
    <InputToolbar
      {...props}
      containerStyle={{
        padding: 3,
      }}
    />
  );

  const renderSend = (props: SendProps<ChatMessage>) => (
    <Send {...props}>
      <View style={{ marginRight: 10, marginBottom: 5 }}>
        <FontAwesome name="send" size={24} color="black" />
      </View>
    </Send>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingBottom: 10 }}>
      <GiftedChat
        messages={messages}
        isTyping={loading}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  },
});
