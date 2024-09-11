import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { DictionaryContext } from "./_layout";

type Meaning = {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
};

type WordData = {
  word: string;
  phonetics: { audio: string }[];
  meanings: Meaning[];
};

const Dictionary = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [newWord, setNewWord] = useState<string>("");
  const [checkedWord, setCheckedWord] = useState<string>("");
  const [lastSearchedWord, setLastSearchedWord] = useState<string>("");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [data, setData] = useState<WordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput | null>(null);
  const { favorite, cache, setHistory, setFavorite, setCache } =
    useContext(DictionaryContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Dictionary</Text>
          <View style={styles.headerIconsContainer}>
            <TouchableOpacity
              style={styles.headerIcon}
              activeOpacity={0.6}
              onPress={() => {
                router.push("/history");
              }}
            >
              <Ionicons name="timer-outline" size={20} color="#0693F1" />
            </TouchableOpacity>
            <View style={{ marginHorizontal: 8 }} />
            <TouchableOpacity
              style={styles.headerIcon}
              activeOpacity={0.6}
              onPress={() => {
                router.push("/favorite");
              }}
            >
              <Ionicons name="star-outline" size={20} color="#0693F1" />
            </TouchableOpacity>
          </View>
        </View>
      ),
      headerTitleStyle: {
        color: "white",
      },
    });
  }, [navigation]);

  const getInfo = async () => {
    if (!newWord.trim() || newWord === lastSearchedWord) {
      return;
    }

    const lowerCaseWord = newWord.toLowerCase();

    // Check if the word is in the cache
    if (cache[lowerCaseWord]) {
      setData(cache[lowerCaseWord]);
      setCheckedWord(cache[lowerCaseWord].word);
      setLastSearchedWord(lowerCaseWord);
      updateHistory(cache[lowerCaseWord].word);
      return;
    }

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${lowerCaseWord}`;

    try {
      const response = await fetch(url);
      const fetchedData = await response.json();

      if (response.status === 200) {
        const wordData: WordData = fetchedData[0];
        setData(wordData);
        setCheckedWord(wordData.word);
        setLastSearchedWord(lowerCaseWord);

        // Update cache
        setCache((prevCache) => ({ ...prevCache, [lowerCaseWord]: wordData }));

        updateHistory(wordData.word);
        setError(null);
      } else {
        setError("Word not found!");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data");
      setTimeout(() => setError(null), 3000);
    }
  };

  const updateHistory = (word: string) => {
    setHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter((w) => w !== word);
      return [word, ...filteredHistory];
    });
  };

  const playAudio = async () => {
    if (!data || !data.phonetics) {
      console.log("No phonetics data available");
      return;
    }

    let audioUri = data.phonetics[0]?.audio || data.phonetics[1]?.audio;

    if (!audioUri) {
      console.log("No audio available for this word");
      return;
    }

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      console.log("Audio URI:", audioUri);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      setSound(newSound);
      console.log("Audio played successfully");
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const clear = async () => {
    setCheckedWord("");
    setNewWord("");
    setData(null);
    setLastSearchedWord(""); // Reset the last searched word
    inputRef.current?.clear(); // Clear the input field

    if (sound) {
      await sound.unloadAsync();
    }
  };

  const handleFavorite = () => {
    if (checkedWord) {
      setFavorite((prevFavorites) => {
        if (prevFavorites.includes(checkedWord)) {
          // Remove the word if it already exists in favorites
          return prevFavorites.filter((word) => word !== checkedWord);
        } else {
          // Add the word if it does not exist in favorites
          return [...prevFavorites, checkedWord];
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search..."
          value={newWord}
          onChangeText={setNewWord}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={getInfo}
          activeOpacity={0.6}
        >
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {checkedWord && !error && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultHeaderContainer}>
            <View style={styles.headerIconsContainer}>
              <Text style={styles.word}>{checkedWord}</Text>
              <TouchableOpacity style={styles.cardButton} onPress={playAudio}>
                <Ionicons name="volume-high" size={24} color="#0693F1" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={handleFavorite}
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
            {newWord ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clear}
                activeOpacity={0.6}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <ScrollView overScrollMode="never" style={{ flexGrow: 0 }}>
            {data?.meanings.map((meaning, index) => (
              <View key={index}>
                <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
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

export default Dictionary;

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    // marginTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 20) : 0,
    backgroundColor: "#3DB2FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },
  headerIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    padding: 10,
    paddingBottom: 70,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "black",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    padding: 8,
    paddingLeft: 12,
    fontSize: 16,
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
    justifyContent: "space-between",
    marginHorizontal: 10,
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
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    color: "#FF4B4C",
    fontWeight: "500",
    fontSize: 16,
  },
  partOfSpeech: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
});
