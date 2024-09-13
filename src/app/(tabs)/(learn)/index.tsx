import {
  Dimensions,
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import WOTDCard from "@/src/components/learn/WOTDCard";
import SubjectCard from "@/src/components/learn/SubjectCard";
import { useNavigation, useRouter } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";
import { fetchUserLevel } from "@/src/fetchData/fetchLearn";
import {
  fetchVocabLevelPercent,
  fetchGrammarLevelPercent,
} from "@/src/fetchData/fetchProgress";
import ProgressCard from "@/src/components/learn/ProgressCard";
import React, { useState, useEffect } from "react";
import QuickSearch from "@/src/components/learn/QuickSearch";

const { width, height } = Dimensions.get("window");

const Learn = () => {
  const router = useRouter();
  const user = useAuth();
  const [level, setLevel] = useState<any>(null);
  const [percent, setPercent] = useState<number | 0>(0);
  const [percentVocab, setPercentVocab] = useState<number | 0>(0);
  const [percentGrammar, setPercentGrammar] = useState<number | 0>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userLevel = await fetchUserLevel(user.user?.id);
        const percentV = await fetchVocabLevelPercent(
          user.user?.id,
          userLevel.level + 1
        );
        const percentG = await fetchGrammarLevelPercent(
          user.user?.id,
          userLevel.level + 1
        );
        const totalPercent = Math.round((percentV + percentG) / 2);
        setLevel(userLevel.level);
        setPercentVocab(Math.round(percentV));
        setPercentGrammar(Math.round(percentG));
        setPercent(totalPercent);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" color="#2980B9" />
        <Text
          style={{
            marginTop: 10,
            fontSize: 20,
            fontWeight: "500",
            color: "#0693F1",
          }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  if (error) {
    return <Text>Failed to load user's level {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headBanner}>
        <View style={styles.GreetingContainer}>
          <Text style={styles.greeting}>Welcome, New User!</Text>
          <Text style={styles.dictionaryLabel}>Capybara Dictionary</Text>
          <QuickSearch />
        </View>
        <Image
          source={require("@/assets/images/learn/learn-greeter.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.bodyContainer}>
        {/*<View style={styles.indicator} />*/}
        <Text style={styles.bodyTitle}>Your Learning Progress</Text>
        <View style={styles.trackingCardsContainer}>
          <WOTDCard />
          <TouchableOpacity onPress={() => router.push("/level")}>
            <ProgressCard level={level} percentage={percent} />
          </TouchableOpacity>
        </View>
        <View style={styles.SubjectCardsContainer}>
          <SubjectCard
            type="vocabulary"
            level={level + 1}
            percent={percentVocab}
          />
          <SubjectCard
            type="grammar"
            level={level + 1}
            percent={percentGrammar}
          />
          <SubjectCard type="skillcheck" />
        </View>
      </View>
    </View>
  );
};

export default Learn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3DB2FF",
    paddingTop: Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0,
  },
  headBanner: {
    backgroundColor: "#3DB2FF",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  GreetingContainer: {
    paddingTop: height * 0.025,
    paddingBottom: height * 0.04,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    marginBottom: height * 0.02,
    marginHorizontal: 10,
  },
  dictionaryLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: height * 0.02,
    marginLeft: 10,
    marginRight: 30,
  },
  image: {
    marginTop: height * 0.034,
    height: height * 0.17,
    width: width * 0.33,
    resizeMode: "contain",
  },
  bodyContainer: {
    flex: 1,
    borderTopRightRadius: width * 0.08,
    borderTopLeftRadius: width * 0.08,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bodyTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: height * 0.02,
    alignSelf: "center",
  },
  trackingCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  SubjectCardsContainer: {
    flex: 1,
    marginVertical: 30,
    justifyContent: "space-between",
  },
});
