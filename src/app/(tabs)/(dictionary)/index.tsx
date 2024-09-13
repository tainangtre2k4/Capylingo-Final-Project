import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Dictionary from "./dictionary";
import History from "./history";
import Favorite from "./favorite";
import { DictionaryContext } from "@/src/app/(tabs)/_layout";

const DictionaryHeader = ({
  setPageHistory,
  setPageFavorite,
}: {
  setPageHistory: () => void;
  setPageFavorite: () => void;
}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Dictionary</Text>
      <View style={styles.headerIconsContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.6}
          onPress={setPageHistory}
        >
          <Ionicons name="timer-outline" size={20} color="#0693F1" />
        </TouchableOpacity>
        <View style={{ marginHorizontal: 8 }} />
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.6}
          onPress={setPageFavorite}
        >
          <Ionicons name="star-outline" size={20} color="#0693F1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FavoriteHeader = ({ setPage }: { setPage: () => void }) => {
  const { setFavorite } = useContext(DictionaryContext);
  const handleFavoriteDeleteAll = () => {
    Alert.alert(
      "Delete All Favorites",
      "All Favorite entries will be deleted! Still proceed?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            setFavorite([]);
          },
          style: "destructive",
        },
      ]
    );
  };
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Favorite</Text>
      <View style={styles.headerIconsContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.6}
          onPress={setPage}
        >
          <Ionicons name="star" size={20} color="#0693F1" />
        </TouchableOpacity>
        <View style={{ marginHorizontal: 8 }} />
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.6}
          onPress={handleFavoriteDeleteAll}
        >
          <Ionicons name="trash" size={20} color="#0693F1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HistoryHeader = ({ setPage }: { setPage: () => void }) => {
  const { setHistory } = useContext(DictionaryContext);
  const handleHistoryDeleteAll = () => {
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
      ]
    );
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>History</Text>
      <View style={styles.headerIconsContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.6}
          onPress={setPage}
        >
          <Ionicons name="timer" size={20} color="#0693F1" />
        </TouchableOpacity>
        <View style={{ marginHorizontal: 8 }} />
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.6}
          onPress={handleHistoryDeleteAll}
        >
          <Ionicons name="trash" size={20} color="#0693F1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Index = () => {
  const navigation = useNavigation();
  const [page, setPage] = useState("dictionary");

  const setPageDictionary = useCallback(() => {
    setPage("dictionary");
  }, []);

  const setPageHistory = useCallback(() => {
    setPage("history");
  }, []);

  const setPageFavorite = useCallback(() => {
    setPage("favorite");
  }, []);

  useEffect(() => {
    navigation.setOptions({
      header: () =>
        page === "dictionary" ? (
          <DictionaryHeader
            setPageHistory={setPageHistory}
            setPageFavorite={setPageFavorite}
          />
        ) : page === "history" ? (
          <HistoryHeader setPage={setPageDictionary} />
        ) : (
          <FavoriteHeader setPage={setPageDictionary} />
        ),
    });
  }, [navigation, page, setPageDictionary, setPageHistory, setPageFavorite]);

  return (
    <View style={[styles.container, page === "dictionary" && { padding: 0, paddingBottom: 200 }]}>
      {page === "dictionary" && (
        <Dictionary page={page} setPage={setPageDictionary} />
      )}
      {page === "history" && <History setPage={setPageDictionary} />}
      {page === "favorite" && <Favorite setPage={setPageDictionary} />}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop:
      Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 8,
    paddingBottom: 8,
    paddingHorizontal: 20,
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
    backgroundColor: "#F3F3F3",
    padding: 10
  },
});
