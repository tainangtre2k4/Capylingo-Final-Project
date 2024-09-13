import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { playPronunciation } from "@/utils/audioUtils";
import STORAGE_KEYS from "@/assets/data/storage-keys.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

type Meaning = {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
};

type WordData = {
  word: string;
  phonetics: { audio: string }[];
  meanings: Meaning[];
};

const QuickSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<WordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [favorite, setFavorite] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedFavorite = await AsyncStorage.getItem(STORAGE_KEYS.favorite);
        if (savedFavorite) setFavorite(JSON.parse(savedFavorite));
        const savedHistory = await AsyncStorage.getItem(STORAGE_KEYS.history);
        if (savedHistory) setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to load data from storage", error);
      }
    };

    loadPersistedData();
  }, []);

  useEffect(() => {
    const saveToStorage = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.favorite,
          JSON.stringify(favorite),
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.history,
          JSON.stringify(history),
        );
      } catch (error) {
        console.error("Failed to save data to storage", error);
      }
    };

    saveToStorage();
  }, [favorite, history]);

  const checkAndUpdateStorage = useCallback(async () => {
    try {
      const savedFavorite = await AsyncStorage.getItem(STORAGE_KEYS.favorite);
      const savedHistory = await AsyncStorage.getItem(STORAGE_KEYS.history);

      const parsedFavorite = savedFavorite ? JSON.parse(savedFavorite) : [];
      const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];

      if (JSON.stringify(parsedFavorite) !== JSON.stringify(favorite)) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.favorite,
          JSON.stringify(favorite),
        );
        setFavorite(parsedFavorite);
      }

      if (JSON.stringify(parsedHistory) !== JSON.stringify(history)) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.history,
          JSON.stringify(history),
        );
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to check and update storage", error);
    }
  }, [favorite, history]);

  const isFavorite = () => {
    return favorite.includes(searchTerm);
  };

  const addFavorite = () => {
    setFavorite((prev) => [...prev, searchTerm]);
  };

  const updateHistory = () => {
    setHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter((w) => w !== searchTerm);
      return [searchTerm, ...filteredHistory];
    });
  };

  const removeFavorite = () => {
    setFavorite((prev) => prev.filter((fav) => fav !== searchTerm));
  };

  const toggleFavorite = () => {
    if (isFavorite()) {
      removeFavorite();
    } else {
      addFavorite();
    }
  };

  const fetchWordData = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`;
      const response = await fetch(url);
      const fetchedData = await response.json();

      if (response.status === 200) {
        setData(fetchedData[0]);
        updateHistory();
      } else {
        setError("Word not found. Please try another word.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const handleSearch = useCallback(async () => {
    setModalVisible(true);
    await checkAndUpdateStorage(); // Check and update history and favorites
    await fetchWordData();
    if (!history.includes(searchTerm) && error === null) {
      updateHistory();
    }
  }, [
    searchTerm,
    fetchWordData,
    updateHistory,
    checkAndUpdateStorage,
    history,
    error,
  ]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setData(null);
    setError(null);
  }, []);

  const maxHeight = height * 0.7;

  return (
    <>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Quick Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            if (searchTerm.trim() !== "") {
              handleSearch();
            }
          }}
        >
          <Ionicons name="search-outline" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={[styles.modalContent, { maxHeight }]}>
            {loading ? (
              <ActivityIndicator size="large" color="#0693F1" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : data ? (
              <View style={styles.resultsContainer}>
                <View style={styles.resultHeaderContainer}>
                  <Text style={styles.word}>{data.word}</Text>
                  <TouchableOpacity
                    style={styles.cardButton}
                    onPress={() => playPronunciation(data.word)}
                  >
                    <Ionicons name="volume-high" size={24} color="#0693F1" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cardButton}
                    onPress={toggleFavorite}
                  >
                    <Ionicons
                      name={isFavorite() ? "star" : "star-outline"}
                      size={24}
                      color="#0693F1"
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView overScrollMode="never" style={{ flexGrow: 0 }}>
                  {data.meanings.map((meaning, index) => (
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
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    elevation: 4,
  },
  searchButton: {
    backgroundColor: "#3DB2FF",
    padding: 4,
    borderRadius: 8,
  },
  searchInput: {
    flexDirection: "row",
    flex: 1,
    fontSize: 16,
    fontStyle: "italic",
    paddingLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  resultsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
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
  partOfSpeech: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 10,
  },
});

export default QuickSearch;
