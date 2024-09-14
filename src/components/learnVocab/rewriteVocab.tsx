import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import NextButton from "@/src/components/learnVocab/nextButton";
import { playPronunciation } from "@/utils/audioUtils";
import { DictionaryContext } from "@/src/app/(tabs)/_layout";

const { width, height } = Dimensions.get("screen");

interface RewriteVocabProps {
  word: string;
  ipa: string;
  type: string;
  definition: string;
  example: string;
  onNext: () => void;
  onIncorrectAnswer: () => void;
}

const RewriteVocab: React.FC<RewriteVocabProps> = ({
  word,
  ipa,
  type,
  definition,
  example,
  onNext,
  onIncorrectAnswer,
}) => {
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { favorite, handleFavorite } = useContext(DictionaryContext);

  const checkAnswer = () => {
    if (input.trim().toLowerCase() === word.trim().toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      onIncorrectAnswer();
    }
    setShowResult(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={[styles.title, { flexShrink: 1 }]}>
            Rewrite the word you just learned
          </Text>
          <Image
            source={require("@/assets/images/capySmallNote.png")}
            style={styles.capyImage}
          />
        </View>

        <View
          style={{
            width: width * 0.85,
            marginTop: height * 0.01,
            marginBottom: height * 0.026,
          }}
        >
          <Text style={styles.definition}>{definition}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Type the word here"
          value={input}
          multiline={true}
          textAlignVertical="top"
          onChangeText={setInput}
          editable={!showResult}
        />

        {showResult && (
          <View
            style={[
              styles.resultBox,
              isCorrect ? styles.correct : styles.incorrect,
            ]}
          >
            <Text
              style={[
                styles.word,
                { color: isCorrect ? "#99CC29" : "#FF2442" },
              ]}
            >
              {word}
            </Text>
            <Text
              style={[styles.ipa, { color: isCorrect ? "#99CC29" : "#FF2442" }]}
            >
              /{ipa}/
            </Text>
            <Text
              style={[
                styles.example,
                { color: isCorrect ? "#669303" : "#FF2442" },
              ]}
            >
              Example: {example}
            </Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={[
                  styles.iconCell,
                  { backgroundColor: isCorrect ? "#99CC29" : "#EB5757" },
                ]}
                onPress={() => playPronunciation(word)}
              >
                <Ionicons name="volume-medium-outline" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconCell,
                  { backgroundColor: isCorrect ? "#99CC29" : "#EB5757" },
                ]}
                onPress={() => handleFavorite(word)}
              >
                <Ionicons name={favorite.includes(word) ? "star" : "star-outline"} size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!showResult ? (
          <TouchableOpacity
            style={styles.checkButtonContainer}
            onPress={checkAnswer}
          >
            <LinearGradient
              colors={["#5DB2FF", "#0074CE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.checkButton}
            >
              <Text style={styles.checkNextButton}>Check Answer</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <NextButton result={isCorrect} onNext={onNext} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width,
    marginBottom: 20,
    paddingHorizontal: width * 0.1,
  },
  capyImage: {
    width: width * 0.2,
    height: height * 0.1,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    width: width * 0.7,
    textAlign: "center",
    marginTop: 16,
  },
  input: {
    width: width * 0.75,
    height: height * 0.1,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: width * 0.053,
    padding: width * 0.042,
    fontSize: 18,
    marginBottom: 20,
  },
  definition: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    color: "#333",
  },
  word: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
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
    fontWeight: "bold",
    textAlign: "center",
    color: "#4095F1",
    marginBottom: height * 0.02515,
  },
  example: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    color: "#333",
  },
  checkButtonContainer: {
    position: "absolute",
    bottom: height * 0.04,
    width: "60%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.33,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 2,
  },
  checkButton: {
    width: "100%",
    height: width * 0.128,
    borderRadius: width * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkNextButton: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "500",
  },
  resultBox: {
    height: height * 0.42,
    width: width,
    padding: 24,
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: "center",
  },
  correct: {
    backgroundColor: "#F5FFD8",
  },
  incorrect: {
    backgroundColor: "#FFDDD8",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.38,
    marginTop: height * 0.01,
  },
  iconCell: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: "#fff",
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

export default RewriteVocab;
