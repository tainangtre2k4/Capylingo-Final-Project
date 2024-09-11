import React, { useState } from 'react';
import { FlatList, Image, ImageProps, View, StyleSheet, TouchableOpacity,Text } from 'react-native';
import { CircularCarouselListItem, ListItemWidth } from './list-item';
import { useSharedValue } from 'react-native-reanimated';
import { router } from 'expo-router';

type CircularCarouselProps = {
  data: ImageProps['source'][];
};

const imageData=[
  require('@/assets/OB/1.png'),
  require('@/assets/OB/2.png'),
  require('@/assets/OB/3.png'),
  require('@/assets/OB/4.png'),
  require('@/assets/OB/5.png'),
];

const CircularCarousel: React.FC<CircularCarouselProps> = ({ data }) => {
  const contentOffset = useSharedValue(0);
  const [selectedIndex, setSelectedIndex] = useState(0); // State for selected image

  return (
    <View style={styles.carouselContainer}>
      <View style={{marginTop: 180}}>
        <Text style={{fontSize:28,color:'#039fff',fontWeight:'bold'}}>WHAT'S INSIDE THIS APP</Text>
      </View>
      {/* Image rendered above the carousel */}
      <Image
        source={imageData[selectedIndex]} // Show the currently selected image
        style={styles.selectedImage}
      />

      {/* Circular Carousel FlatList */}
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        scrollEventThrottle={16}
        onScroll={(event) => {
          contentOffset.value = event.nativeEvent.contentOffset.x;

          // Update selected index based on scroll position
          const currentIndex = Math.round(
            event.nativeEvent.contentOffset.x / ListItemWidth
          );
          setSelectedIndex(currentIndex);
        }}
        pagingEnabled
        snapToInterval={ListItemWidth}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContentContainer}
        style={{
          position: 'absolute',
          bottom: 0,
          height: 400,
        }}
        horizontal
        renderItem={({ item, index }) => {
          return (
            <CircularCarouselListItem
              contentOffset={contentOffset}
              imageSrc={item}
              index={index}
            />
          );
        }}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={()=>{router.push('/(auth)')}}>
        <Text style={{fontSize: 24,color:'white',fontWeight:'bold'}}>LET'S START!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: 500, // Adjust this size as necessary
    height: 500,
    resizeMode: 'contain',
    marginBottom: 100,
  },
  flatListContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1.5 * ListItemWidth,
  },
  buttonContainer:{
    marginBottom: 200,
    padding: 16,
    backgroundColor:'#039dfc',
    marginTop: 40,
    paddingHorizontal: 60,
    borderRadius: 16
  }
});

export { CircularCarousel };
