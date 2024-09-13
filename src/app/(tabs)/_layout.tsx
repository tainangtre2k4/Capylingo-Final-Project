import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Tabs, useSegments } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import STORAGE_KEYS from "@/assets/data/storage-keys.json";

export interface WordData {
  word: string;
  phonetics: { audio: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
  }[];
}

export interface DictionaryContextType {
  history: string[];
  favorite: string[];
  cache: Record<string, WordData>;
  setHistory: Dispatch<SetStateAction<string[]>>;
  setFavorite: Dispatch<SetStateAction<string[]>>;
  setCache: Dispatch<SetStateAction<Record<string, WordData>>>;
  updateHistory: (word: string) => void;
  handleFavorite: (word: string) => void;
}

const defaultContextValue: DictionaryContextType = {
  history: [],
  favorite: [],
  cache: {},
  setHistory: () => {},
  setFavorite: () => {},
  setCache: () => {},
  updateHistory: () => {},
  handleFavorite: () => {},
};

export const DictionaryContext =
  createContext<DictionaryContextType>(defaultContextValue);

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }
  const segment = useSegments();

  const page = segment.join("/");
  const pagesToHideTabBar = [
    "skillcheck/reading",
    "skillcheck/listening",
    "resultScreen",
    "vocabulary/learnVocab",
    "vocabulary/exercises",
    "grammar/learnGrammar",
    "grammar/exercises",
    "news",
    "community",
    "chatbot",
    "playgame",
  ];

  const checkPageToHideTabBar = (): boolean => {
    for (const s of pagesToHideTabBar) if (page.includes(s)) return true;
    return false;
  };

  const [history, setHistory] = useState<string[]>([]);
  const [favorite, setFavorite] = useState<string[]>([]);
  const [cache, setCache] = useState<Record<string, WordData>>({});

  // Load saved data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem(STORAGE_KEYS.history);
        const savedFavorite = await AsyncStorage.getItem(STORAGE_KEYS.favorite);
        const savedCache = await AsyncStorage.getItem(STORAGE_KEYS.cache);

        if (savedHistory) setHistory(JSON.parse(savedHistory));
        if (savedFavorite) setFavorite(JSON.parse(savedFavorite));
        if (savedCache) setCache(JSON.parse(savedCache));
      } catch (error) {
        console.error("Failed to load data from storage", error);
      }
    };

    loadPersistedData();
  }, []);

  // Save history, favorite, and cache to AsyncStorage whenever they change
  useEffect(() => {
    const saveToStorage = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.history,
          JSON.stringify(history),
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.favorite,
          JSON.stringify(favorite),
        );
        await AsyncStorage.setItem(STORAGE_KEYS.cache, JSON.stringify(cache));
      } catch (error) {
        console.error("Failed to save data to storage", error);
      }
    };

    saveToStorage();
  }, [history, favorite, cache]);

  const handleFavorite = (word: string) => {
    if (word) {
      setFavorite((prevFavorites) => {
        if (prevFavorites.includes(word)) {
          // Remove the word if it already exists in favorites
          return prevFavorites.filter((entry) => entry !== word);
        } else {
          // Add the word if it does not exist in favorites
          return [...prevFavorites, word];
        }
      });
    }
  };

  const updateHistory = (word: string) => {
    setHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter((w) => w !== word);
      return [word, ...filteredHistory];
    });
  };

  return (
    <GestureHandlerRootView>
      <DictionaryContext.Provider
        value={{
          history,
          favorite,
          cache,
          setHistory,
          setFavorite,
          setCache,
          updateHistory,
          handleFavorite,
        }}
      >
        <Tabs
          initialRouteName="(learn)"
          screenOptions={{ tabBarHideOnKeyboard: true, headerShown: false }}
        >
          <Tabs.Screen
            name="(learn)"
            options={{
              headerTransparent: true,
              headerTitle: "",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="book-open-page-variant-outline"
                  size={size}
                  color="3DB2FF"
                />
              ),
              tabBarLabel: "Learn",
              tabBarStyle: {
                display: checkPageToHideTabBar() ? "none" : "flex",
              },
            }}
          />
          <Tabs.Screen
            name="(dictionary)"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="file-tray-full" size={size} color="3DB2FF" />
              ),
              tabBarLabel: "Dictionary",
            }}
          />
          <Tabs.Screen
            name="(resources)"
            options={{
              headerTransparent: true,
              headerTitle: "",
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="folder-open-outline"
                  size={size}
                  color="3DB2FF"
                />
              ),
              tabBarLabel: "Resources",
              tabBarStyle: {
                display: checkPageToHideTabBar() ? "none" : "flex",
              },
            }}
          />

          <Tabs.Screen
            name="(profile)"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color="3DB2FF" />
              ),
              tabBarLabel: "My Profile",
            }}
          />
        </Tabs>
      </DictionaryContext.Provider>
    </GestureHandlerRootView>
  );
}
