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
import { useUserLearn } from "@/src/app/(tabs)/(learn)/ UserLearnContext";
import { useNavigation, useRouter } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";
import { fetchUserLevel, getGrammarTopicList, getVocabTopicList } from "@/src/fetchData/fetchLearn";
import ProgressCard from "@/src/components/learn/ProgressCard";
import React, { useState, useEffect } from "react";
import QuickSearch from "@/src/components/learn/QuickSearch";

const { width, height } = Dimensions.get("window");

const Learn = () => {
  const router = useRouter();
  const user = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const {
    level,
    totalPercent: percent,
    vocabPercent: percentVocab,
    grammarPercent: percentGrammar,
    updateLevel,
    setTopicsVocab,
    setTopicsGrammar,
  } = useUserLearn();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = user.user?.id;
        if (!userId) throw new Error("User ID not found");

        const userLevel = await fetchUserLevel(userId);
        updateLevel(userLevel.level);

        const vocabTopics = await getVocabTopicList(userId, userLevel.level);
        const grammarTopics = await getGrammarTopicList(userId, userLevel.level);
  
        // Chuyển đổi dữ liệu thành định dạng Topic[]
        const newVocabTopics = vocabTopics.map((topic: any) => ({
          id: topic.id,
          title: topic.title, // Thêm thuộc tính title nếu cần
          ImageUrl: topic.ImageUrl, // Thêm thuộc tính ImageUrl nếu cần
          isLearned: topic.CompletedTopicVocab.length > 0 ? topic.CompletedTopicVocab[0].completedLearning : false,
          isPracticed: topic.CompletedTopicVocab.length > 0 ? topic.CompletedTopicVocab[0].completedPracticing : false
        }));
  
        const newGrammarTopics = grammarTopics.map((topic: any) => ({
          id: topic.id,
          title: topic.title, // Thêm thuộc tính title nếu cần
          ImageUrl: topic.ImageUrl, // Thêm thuộc tính ImageUrl nếu cần
          lectureLink: topic.lectureLink,
          isLearned: topic.CompletedTopicGrammar.length > 0 ? topic.CompletedTopicGrammar[0].completedLearning : false,
          isPracticed: topic.CompletedTopicGrammar.length > 0 ? topic.CompletedTopicGrammar[0].completedPracticing : false
        }));
        
        // Gọi hàm set để thay thế toàn bộ dữ liệu
        setTopicsVocab(newVocabTopics);
        setTopicsGrammar(newGrammarTopics);
        

        setLoading(false); // Kết thúc quá trình loading
      } catch (error) {
        console.error("Failed to load data", error);
        setError("Failed to load data");
        setLoading(false); // Kết thúc loading nếu có lỗi
      }
    };

    loadData();
  }, []);

  if (loading) {
    // Hiển thị hình ảnh loading full màn hình khi đang fetch
    return (
      <View style={styles.container}>
        <Image source={require("@/assets/splash.png")} style={{width: width, height: height, resizeMode: 'contain'}} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 16, color: "red"}}>Sorry, there is an error. Please try again later.</Text>
      </View>
    );
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
            level={level}
            percent={percentVocab}
          />
          <SubjectCard
            type="grammar"
            level={level}
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
