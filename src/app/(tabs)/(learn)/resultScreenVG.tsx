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
import { useUserLearn } from "@/src/app/(tabs)/(learn)/ UserLearnContext";

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
  backTo: string;
  part: string;
};

const ResultScreenVG = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { correct, all, backTo, part } = useLocalSearchParams<SearchParams>();

  const {
    level,
  } = useUserLearn();

  const correctNum = parseInt(correct, 10); 
  const allNum = parseInt(all, 10);

  const getHeading = (percent: number) => {
    if (percent < 70) return headings[0];
    if (percent >= 70 && percent < 80) return headings[1];
    if (percent >= 80 && percent < 90) return headings[2];
    return headings[3];
  };

  const percentage = Math.round((correctNum / allNum) * 100);
  const heading = getHeading(percentage);


  const getResultText = () => {
    if (percentage >= 70) {
      if (backTo === 'vocabulary' && part === 'learning') {
        return "Congratulations on completing the vocabulary section!";
      }
      if (backTo === 'vocabulary' && part === 'practicing') {
        return "Well done! You've passed the vocabulary exercises for this topic!";
      }
      if (backTo === 'grammar' && part === 'learning') {
        return "Congratulations on completing the grammar section!";
      }
      if (backTo === 'grammar' && part === 'practicing') {
        return "Great job! You've passed the grammar exercises for this topic!";
      }
    } else {
      if (backTo === 'vocabulary') {
        return "Keep going! Review the vocabulary and try again!";
      }
      if (backTo === 'grammar') {
        return "Don't give up! Practice the grammar exercises once more!";
      }
    }
    return 'Capylingo';
  };

  const resultText = getResultText();

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
        <View style={{ flexDirection: "row", marginTop: height*0.05 }}>
          <Image
            source={require("@/assets/images/resources/capyNews.png")}
            style={styles.image}
          />
          <View style={styles.chillingContainer}>
            <Text style={styles.chillingText}>{resultText}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.6}
          onPress={() => {
            if (backTo === 'vocabulary') {
              router.navigate(`/vocabulary?level=${level}`)
            } else if (backTo === 'grammar') {
              router.navigate(`/grammar?level=${level}`)
            }
          }}
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

export default ResultScreenVG;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 24,
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
    width: width*0.35,
    height: width*0.35,
    marginLeft: width*0.05,
  },
  chillingContainer: {
    width: width*0.5,
    marginTop: 20,
    marginLeft: width*0.05,
  },
  chillingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: "#0693F1",
    width: width*0.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center',
    position: 'absolute',
    bottom: height*0.08,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: "500",
    color: "white",
  },
});
