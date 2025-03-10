import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRouter, useLocalSearchParams, Href } from "expo-router";
import React, { useEffect } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const { width, height } = Dimensions.get("window");

const headings = [
  "Better luck next time!",
  "Congratulations!",
  "Well done",
  "Excellent",
];

type SearchParams = {
  correct: string;
  all: string;
  backPage: string;
};

const ResultScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { correct, all, backPage } = useLocalSearchParams<SearchParams>();

  const correctNum = parseInt(correct, 10); 
  const allNum = parseInt(all, 10);

  const getHeading = (percent: number) => {
    if (percent < 50) return headings[0];
    if (percent >= 50 && percent < 70) return headings[1];
    if (percent >= 70 && percent < 80) return headings[2];
    return headings[3];
  };

  const percentage = Math.round((correctNum / allNum) * 100);
  const heading = getHeading(percentage);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleStyle: {
        color: "white",
      },
      ...Platform.select({
        android: {
          statusBarColor: "white",
          statusBarStyle: "dark",
        },
      }),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <View style={{ marginVertical: 20 }} />
        <Text style={styles.heading}>{heading}</Text>
        <View style={{ marginVertical: 10 }} />
        <Text style={styles.scoreText}>Your Score</Text>
      </View>
      <View style={styles.lowerBackground}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("@/assets/images/resources/capyNews.png")}
            style={styles.image}
          />
          <View style={styles.chillingContainer}>
            <Text style={styles.chillingText}>Keep on studying!</Text>
            <View style={{ marginVertical: 4 }} />
            <Text style={styles.chillingText}>I'm just chilling here tho'</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.6}
          onPress={() => router.navigate(backPage)}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <AnimatedCircularProgress
        size={width * 0.6}
        width={width * 0.05}
        backgroundWidth={width * 0.05}
        fill={percentage}
        tintColor="#0074CE"
        backgroundColor="#FC9A9A"
        rotation={0}
        lineCap="round"
        style={styles.scoreCircle}
        childrenContainerStyle={{ backgroundColor: "white" }}
      >
        {() => (
          <Text style={styles.resultText}>
            {correct}/{all}
          </Text>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  heading: {
    fontSize: 24,
    fontWeight: "400",
  },
  headingContainer: {
    flex: 2,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0074CE",
  },
  lowerBackground: {
    flex: 3,
    borderTopLeftRadius: width * 0.16,
    borderTopRightRadius: width * 0.16,
    backgroundColor: "#F3F3F3",
    paddingTop: height * 0.2,
    alignItems: "center",
  },
  resultText: {
    fontSize: 32,
    fontWeight: "700",
  },
  scoreCircle: {
    position: "absolute",
    zIndex: 1,
    left: width * 0.2,
    top: width * 0.4,
  },
  image: {
    width: 200,
    height: 208,
  },
  chillingContainer: {
    marginVertical: 20,
    marginLeft: -20,
  },
  chillingText: {
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#0693F1",
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: height * 0.06,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
});
