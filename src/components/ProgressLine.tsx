import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface ProgressLineProps {
  percentage: number;
}

const { width, height } = Dimensions.get('screen');

const ProgressLine: React.FC<ProgressLineProps> = ({ percentage }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage, { duration: 900 });
  }, [percentage]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <>
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, animatedStyle]} />
    </View>
    <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '78%',
    height: height*0.0125,
    backgroundColor: '#e5e5e5', // Màu nền của thanh chưa hoàn thành
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginTop: height*0.0145,
    marginLeft: width*0.03
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2FDB81',
    borderRadius: 10,
  },
  percentageText: {
    position: 'absolute',
    right: 0,
    top: height*0.0405,
    fontSize: 15,
    fontWeight: '300',
    color: '#000',
  },
});

export default ProgressLine;
