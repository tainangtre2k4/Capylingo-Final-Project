import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "@/src/components/(news)/SearchBar";
import { colors } from "react-native-elements";
import newsCategoryList from "@/constants/types/Categories";
import CheckBox from "@/src/components/(news)/CheckBox";
import { useNewsCategories } from "@/src/hooks/useNewsCategories";
import { useNewsCountries } from "@/src/hooks/useNewsCountry";
import { Link, router, Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/src/components/BackButton";

type Props = {};

const Discover = (props: Props) => {
  const { newsCategories, toggleNewsCategory } = useNewsCategories();
  const { newsCountries, toggleNewsCountry } = useNewsCountries();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCatergory] = useState("");
  const [country, setCountry] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BackButton iconColor="black" />
            <View style={{ marginHorizontal: 8 }} />
            <Text style={styles.headerTitle}>Discover</Text>
          </View>
          <TouchableOpacity
            style={styles.headerRightIcon}
            onPress={() => router.push("/news/saved")}
          >
            <Ionicons name="bookmark-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      ),
      statusBarColor: "transparent",
      statusBarTranslucent: false,
      statusBarStyle: "dark",
    });
  }, [navigation]);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { paddingTop: 10 }]}>
        <SearchBar
          withHorizonalPadding={false}
          setSearchQuery={setSearchQuery}
        />
        <Text style={styles.title}>Categories</Text>
        <View style={styles.listContainer}>
          {newsCategories.map((item) => (
            <CheckBox
              key={item.id}
              label={item.title}
              checked={item.selected}
              onPress={() => {
                toggleNewsCategory(item.id);
                setCatergory(item.slug);
              }}
            />
          ))}
        </View>

        <Text style={styles.title}>Country</Text>
        <View style={styles.listContainer}>
          {newsCountries.map((item, index) => (
            <CheckBox
              key={index}
              label={item.name}
              checked={item.selected}
              onPress={() => {
                toggleNewsCountry(index);
                setCountry(item.code);
              }}
            />
          ))}
        </View>

        <Link
          href={{
            pathname: `/news/search`,
            params: { query: searchQuery, category, country },
          }}
          asChild
        >
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
};

export default Discover;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  headerFillerContainer: {
    height: 42,
    width: 42,
    backgroundColor: "transparent",
  },
  headerRightIcon: {
    padding: 9,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "black",
  },
  headerTitle: {
    fontSize: 22,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 10,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#3DB2FF",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
