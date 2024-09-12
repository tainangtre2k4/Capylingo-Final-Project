import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Platform,
    NativeSyntheticEvent,
    NativeScrollEvent,
  } from "react-native";
  import React, { useState, useContext, useRef, useEffect } from "react";
  import { useNavigation } from "expo-router";
  import { RenderHTML } from "react-native-render-html";
  import {Ionicons} from "@expo/vector-icons";
  import { ReadingContext } from "./_layout";
  
  const { width, height } = Dimensions.get("window");
  
  const Passage = () => {
    const MIN_FONT_SIZE = 14;
    const MAX_FONT_SIZE = 28;
    const DEFAULT_FONT_SIZE = 14;
    const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
    const {
      curIndex,
      maxIndex,
      passages,
      setCurrentIndex,
    } = useContext(ReadingContext);
  
    const scrollViewRef = useRef<ScrollView | null>(null);

    useEffect(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: curIndex * width, // Assuming width is the width of each page
          animated: false, // Set to true for a smooth animation
        });
      }
    }, [curIndex, width]);
  
    const increaseFontSize = () => {
      if (fontSize < MAX_FONT_SIZE) {
        setFontSize((prevSize) => prevSize + 2);
      }
    };
  
    const decreaseFontSize = () => {
      if (fontSize > MIN_FONT_SIZE) {
        setFontSize((prevSize) => prevSize - 2);
      }
    };
  
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(contentOffsetX / width);
      setCurrentIndex(newIndex);
      console.log("newIndex: ", newIndex);
    };
    
    const scrollToPassage = (index: number) => {
      setCurrentIndex(index);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: index * width, animated: true });
      }
    };
  
    return (
      <>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          style={styles.horizontalScrollView}
          onMomentumScrollEnd={handleScroll}
        >
          {passages.map((passageItem, index) => (
            <ScrollView key={index} style={styles.verticalScrollView}>
              <RenderHTML
                defaultTextProps={{ selectable: true, style: { fontSize } }}
                source={passageItem}
                contentWidth={width}
              />
            </ScrollView>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerIconContainer}
            onPress={increaseFontSize}
          >
            <Image
              source={require("@/assets/images/skillcheck/text_up.png")}
              style={styles.footerText}
            />
            <Text style={styles.footerLabel}>Zoom in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerIconContainer}
            onPress={decreaseFontSize}
          >
            <Image
              source={require("@/assets/images/skillcheck/text_down.png")}
              style={styles.footerText}
            />
            <Text style={styles.footerLabel}>Zoom out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerIconContainer}
            onPress={() => {
              if (curIndex > 0) {
                scrollToPassage(curIndex - 1);
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text style={styles.footerLabel}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerIconContainer}
            onPress={() => {
              if (curIndex < maxIndex) {
                scrollToPassage(curIndex + 1);
              }
            }}
          >
            <Ionicons name="arrow-forward" size={24} color="black" />
            <Text style={styles.footerLabel}>Next</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };
  
  export default Passage;
  
  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: "white",
    },
    horizontalScrollView: {
      flex: 1,
      backgroundColor: "white",
    },
    verticalScrollView: {
      width: width,
      paddingHorizontal: 20,
    },
    headerRightIconContainer: {
      padding: 9,
      borderRadius: 12,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      elevation: 4,
    },
    footer: {
      flexDirection: "row",
      paddingVertical: 14,
      backgroundColor: "white",
      borderTopWidth: 1,
      borderColor: "#A0A0A0",
    },
    footerIconContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
    },
    footerText: {
      height: 14,
      width: 24,
    },
    footerHighlight: {
      height: 18,
      width: 16,
      resizeMode: "contain",
      },
    footerLabel: {
      fontSize: 12,
    },
  });