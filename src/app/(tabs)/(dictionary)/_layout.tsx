import React, {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet, Platform } from "react-native";
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
}

const defaultContextValue: DictionaryContextType = {
  history: [],
  favorite: [],
  cache: {},
  setHistory: () => {},
  setFavorite: () => {},
  setCache: () => {},
};

export const DictionaryContext =
  createContext<DictionaryContextType>(defaultContextValue);

const DictionaryStack = () => {
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
          JSON.stringify(history)
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.favorite,
          JSON.stringify(favorite)
        );
        await AsyncStorage.setItem(STORAGE_KEYS.cache, JSON.stringify(cache));
      } catch (error) {
        console.error("Failed to save data to storage", error);
      }
    };

    saveToStorage();
  }, [history, favorite, cache]);

  // Recheck storage every 3 seconds for differences
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const savedHistory = await AsyncStorage.getItem(STORAGE_KEYS.history);
        const savedFavorite = await AsyncStorage.getItem(STORAGE_KEYS.favorite);
        const savedCache = await AsyncStorage.getItem(STORAGE_KEYS.cache);

        if (savedHistory && JSON.stringify(history) !== savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
        if (savedFavorite && JSON.stringify(favorite) !== savedFavorite) {
          setFavorite(JSON.parse(savedFavorite));
        }
        if (savedCache && JSON.stringify(cache) !== savedCache) {
          setCache(JSON.parse(savedCache));
        }
      } catch (error) {
        console.error("Failed to load data from storage", error);
      }
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [history, favorite, cache]);

  return (
    <SafeAreaView style={styles.container}>
      <DictionaryContext.Provider
        value={{ history, favorite, cache, setHistory, setFavorite, setCache }}
      >
        <Stack
          screenOptions={{
            animation: "none",
            statusBarColor: "transparent",
            statusBarTranslucent: true,
            statusBarStyle: "light",
          }}
          initialRouteName="dictionary"
        />
      </DictionaryContext.Provider>
    </SafeAreaView>
  );
};

export default DictionaryStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3DB2FF",
  },
});
