import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressTrackerProps {
  current: number;
  all: number;
}

const { width } = Dimensions.get('screen');
const widthBar = width * 0.71;

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ current = 0, all = 1 }) => {
  const progressWidth = (current / all) * widthBar;


  return (
    <View style={{height: 40, justifyContent: 'center', width: width}}>
    <View style={styles.container}>
      <LinearGradient
        colors={['#00c6ff', '#0072ff']}
        start={[0, 0]}
        end={[1, 0]}
        style={[styles.progressBar, { width: progressWidth }]}
      />
      <View style={[styles.remainingBar, { width: widthBar - progressWidth }]} />

    </View>
      <Image
        source={require('@/assets/images/capyMoving.png')} // Replace with your image URL or local source
        style={[styles.image, { left: progressWidth + 3 }]} // Adjust the left position based on progressWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 17,
    width: widthBar,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginLeft: 16,
    position: 'relative', // Make sure the container is positioned relative
  },
  progressBar: {
    height: '100%',
  },
  remainingBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  image: {
    position: 'absolute', // Position the image absolutely within the container
    top: -10, // Adjust the vertical position if needed
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});

export default ProgressTracker;
