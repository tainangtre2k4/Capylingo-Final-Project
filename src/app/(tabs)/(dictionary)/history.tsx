import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { DictionaryContext, WordData } from "@/src/app/(tabs)/_layout";

const { width, height } = Dimensions.get("window");

const History = ({setPage}: {setPage: () => void}) => {
  const navigation = useNavigation();
  const router = useRouter();
  const [checkedWord, setCheckedWord] = useState<string>("");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [data, setData] = useState<WordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { history, favorite, cache, setHistory, handleFavorite, setCache } =
    useContext(DictionaryContext);

  const handleHistorydeleteAll = () => {
    Alert.alert(
      "Delete All History",
      "All History entries will be deleted! Still proceed?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            setHistory([]);
          },
          style: "destructive",
        },
      ],
    );
  };

  const getInfo = async (item: string) => {
    if (!item.trim()) {
      return;
    }

    // Check if the word is in the cache
    if (cache[item]) {
      setData(cache[item]);
      setCheckedWord(item);
      setError(null);
      return;
    }

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${item}`;

    try {
      const response = await fetch(url);
      const fetchedData = await response.json();

      if (response.status === 200) {
        const wordData: WordData = fetchedData[0];
        setData(wordData);
        setCheckedWord(wordData.word);

        // Add the word data to the cache
        setCache((prevCache) => ({ ...prevCache, [wordData.word]: wordData }));

        setError(null);
      } else {
        setError("Word not found in the database");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data");
      setTimeout(() => setError(null), 3000);
    }
  };

  const playAudio = async () => {
    if (data && data.phonetics[0]?.audio) {
      if (sound) {
        await sound.unloadAsync();
      }

      const audioUri = data.phonetics[0].audio;
      const { sound: newSound, status } = await Audio.Sound.createAsync({
        uri: audioUri,
      });

      if (status.isLoaded) {
        setSound(newSound);
        await newSound.playAsync();
      }
    }
  };

  const renderHistoryItem = ({ item }: { item: string }) => {
    const isExpanded = expandedItem === item;

    const handleToggle = () => {
      if (isExpanded) {
        setExpandedItem(null);
      } else {
        setExpandedItem(item);
        getInfo(item);
      }
    };

    return (
      <View style={isExpanded ? styles.historyItemsExpanded : {}}>
        {!isExpanded && (
          <TouchableOpacity
            onPress={handleToggle}
            activeOpacity={0.6}
            style={styles.historyItem}
          >
            <Text style={styles.historyText}>{item}</Text>
          </TouchableOpacity>
        )}
        {isExpanded && checkedWord === item && !error && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultHeaderContainer}>
              <TouchableOpacity onPress={handleToggle} activeOpacity={0.6}>
                <Text style={styles.word}>{checkedWord}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardButton} onPress={playAudio}>
                <Ionicons name="volume-high" size={24} color="#0693F1" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={() => handleFavorite(checkedWord)}
              >
                <Ionicons
                  name={
                    favorite.includes(checkedWord) ? "star" : "star-outline"
                  }
                  size={24}
                  color="#0693F1"
                />
              </TouchableOpacity>
            </View>
            <ScrollView overScrollMode="never" style={{ height: height * 0.3 }}>
              {data?.meanings.map((meaning, index) => (
                <View key={index}>
                  <Text style={styles.partOfSpeech}>
                    {meaning.partOfSpeech}
                  </Text>
                  {meaning.definitions.map((definition, defIndex) => (
                    <View key={defIndex}>
                      <Text style={styles.resultText}>
                        Definition: {definition.definition}
                      </Text>
                      {definition.example && (
                        <Text style={styles.resultText}>
                          Example: {definition.example}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
      <FlatList
        data={[...history].reverse()}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
        overScrollMode="never"
      />
  );
};

export default History;

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "#3DB2FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop:
      Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },
  headerIconsContainer: {
    flexDirection: "row",
  },
  headerIcon: {
    padding: 9,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "black",
  },
  container: {
    backgroundColor: "#F3F3F3",
    paddingTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#0693F1",
    padding: 8,
    marginRight: 4,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  resultsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    padding: 10,
  },
  resultHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  word: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginRight: 4,
  },
  cardButton: {
    padding: 4,
    marginLeft: 6,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 10,
  },
  historyItemsExpanded: {
    flexDirection: "row",
    flex: 1,
    padding: 10,
  },
  historyItem: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "black",
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
  },
  historyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  partOfSpeech: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
});
