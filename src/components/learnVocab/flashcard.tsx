import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
const { width, height } = Dimensions.get("screen");
import NextButton from "@/src/components/learnVocab/nextButton";
import { playPronunciation } from "@/utils/audioUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import STORAGE_KEYS from "@/assets/data/storage-keys.json";

interface FlashcardProps {
  word: string;
  ipa: string;
  type: string;
  definition: string;
  example: string;
  onNext: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  word,
  ipa,
  type,
  definition,
  example,
  onNext,
}) => {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  // resolve add and remove favorite
  const [favorite, setFavorite] = useState<string[]>([]);

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedFavorite = await AsyncStorage.getItem(STORAGE_KEYS.favorite);
        if (savedFavorite) setFavorite(JSON.parse(savedFavorite));
      } catch (error) {
        console.error("Failed to load data from storage", error);
      }
    };

    loadPersistedData();
  }, []);

  // Save favorite to AsyncStorage whenever they change
  useEffect(() => {
    const saveToStorage = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.favorite,
          JSON.stringify(favorite)
        );
      } catch (error) {
        console.error("Failed to save data to storage", error);
      }
    };

    saveToStorage();
  }, [favorite]);

  const isFavorite = (word: string) => {
    return favorite.includes(word);
  };

  const addFavorite = (word: string) => {
    setFavorite((prev) => [...prev, word]);
  };

  const removeFavorite = (word: string) => {
    setFavorite((prev) => prev.filter((fav) => fav !== word));
  };

  const toggleFavorite = () => {
    if (isFavorite(word)) {
      removeFavorite(word);
    } else {
      addFavorite(word);
    }
  };

  const flipCard = () => {
    if (flipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => setFlipped(!flipped));
    } else {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start(() => setFlipped(!flipped));
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    zIndex: flipped ? 0 : 1, // Mặt trước chỉ có thể nhận sự kiện khi không bị lật
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    zIndex: flipped ? 1 : 0, // Mặt sau chỉ có thể nhận sự kiện khi đã lật
  };

  type Phonetic = {
    audio: string;
  };

  type WordData = {
    phonetics: Phonetic[];
  };

  async function playAudio(word: string) {
    try {
      // Fetch word data from the API
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );
      const data: WordData[] = await response.json();

      if (!response.ok) {
        throw new Error("Word not found");
      }

      const wordData = data[0];
      console.log("Word data:", wordData);

      // Find the first available audio URL
      const audioUrl = wordData.phonetics.find(
        (phonetic) => phonetic.audio
      )?.audio;

      if (!audioUrl) {
        console.log("No audio available for this word");
        return;
      }

      // Play the audio
      const audio = new Audio(audioUrl);
      audio.play();

      console.log("Audio played successfully");
    } catch (error) {
      // Ensure error is of type Error before accessing its message
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flipCard} activeOpacity={1}>
        <View>
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.ipa}>/{ipa}/</Text>
            <Text style={styles.type}>[{type}]</Text>
            <Text style={styles.definition}>{definition}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.iconCell}
                onPress={() => {
                  playPronunciation(word);
                }}
              >
                <Ionicons name="volume-medium-outline" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconCell}
                onPress={toggleFavorite}
              >
                <Ionicons
                  name={isFavorite(word) ? "star" : "star-outline"}
                  size={32}
                  color={isFavorite(word) ? "#FFD700" : "#fff"}
                />
              </TouchableOpacity>
            </View>
            <Image
              source={require("@/assets/images/learn/learnVocab/clickCapyLogo.png")}
              style={styles.clickLogo}
            />
          </Animated.View>

          <Animated.View
            style={[styles.card, styles.cardBack, backAnimatedStyle]}
          >
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.ipa}>/{ipa}/</Text>
            <Text style={styles.type}>Example:</Text>
            <Text style={styles.definition}>{example}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.iconCell}
                onPress={() => {
                  playPronunciation(word);
                }}
              >
                <Ionicons name="volume-medium-outline" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconCell}
                onPress={toggleFavorite}
              >
                <Ionicons
                  name={isFavorite(word) ? "star" : "star-outline"}
                  size={32}
                  color={isFavorite(word) ? "#FFD700" : "#fff"}
                />
              </TouchableOpacity>
            </View>
            <Image
              source={require("@/assets/images/learn/learnVocab/clickCapyLogo.png")}
              style={styles.clickLogo}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>
      <NextButton result={null} onNext={onNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    alignItems: "center",
  },
  card: {
    width: width * 0.85,
    height: height * 0.58,
    marginTop: height * 0.007,
    paddingHorizontal: width * 0.06,
    backgroundColor: "#fff",
    borderRadius: width * 0.072,
    alignItems: "center",
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    //elevation: 6,
  },
  cardBack: {
    position: "absolute",
    top: 0,
  },
  word: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.01143,
  },
  ipa: {
    fontSize: 24,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: height * 0.02057,
  },
  type: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#4095F1",
    marginBottom: height * 0.02515,
  },
  definition: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    color: "#333",
    marginBottom: height * 0.013,
  },
  clickLogo: {
    width: width * 0.22,
    position: "absolute",
    bottom: -height * 0.12,
    right: 0.058 * width,
    resizeMode: "contain",
    tintColor: "#0279D6",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.38,
    marginTop: height * 0.025,
  },
  iconCell: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    backgroundColor: "#5DB2FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
});

export default Flashcard;
