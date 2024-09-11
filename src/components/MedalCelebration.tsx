import { StyleSheet, Text, View, Animated, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

interface MedalProps {
  imageMedal: any;
  completedLevel: number;
}

const MedalCelebration: React.FC<MedalProps> = ({ imageMedal, completedLevel }) => {
  const [showNextLevel, setShowNextLevel] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowNextLevel(true);
    }, 3000);


    return () => clearTimeout(timer);
  }, []);

  const scaleAnim = useRef(new Animated.Value(0)).current; // Animated value for scaling

  useEffect(() => { 
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/images/level/celebration1.json')}
        autoPlay
        loop
        style={styles.animation1}
      />
      <Text style={styles.congratulationText}> Congratulations!</Text>
      
      <Animated.Image
        source={imageMedal}
        style={[styles.medalImage, { transform: [{ scale: scaleAnim }] }]}
      />
      <Text style={styles.completeText}> You've completed Level {completedLevel} !</Text>
      <LottieView
        source={require('@/assets/images/level/celebration2.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      {showNextLevel && completedLevel+1 < 5  &&(
        <>
            <View style={styles.nextLevel}>
            <LottieView
                source={require('@/assets/images/level/unlock.json')}
                autoPlay
                loop={false}
                style={styles.unlock}
            />
            <Text style={{ fontSize: 24, fontWeight: '500', marginLeft: width * 0.2 }}>
                Level {completedLevel + 1}
            </Text>
            </View>
        </>
      )}
      <Image source={require('@/assets/images/level/capyCelebrating.jpeg')} style={styles.capyImage} />
    </View>
  );
}

export default MedalCelebration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width*0.85,
    alignItems: 'center',
  },
  congratulationText: {
    marginTop: height * 0.15,
    fontSize: 30,
    fontWeight: '500',
  },
  capyImage: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'contain',
    position: 'absolute',
    right: -width * 0.05,
    top: height * 0.1,
    backgroundColor: 'red',
    zIndex: 100,
  },
  completeText: {
    marginTop: height * 0.037,
    fontSize: 26,
    fontWeight: '500',
  },
  medalImage: {
    marginTop: height * 0.1,
    width: width * 0.47,
    height: width * 0.47,
    resizeMode: 'contain',
  },
  animation1: {
    position: 'absolute',
    top: 0,
    width: width * 0.6,
    height: width * 0.6,
  },
  animation: {
    position: 'absolute',
    bottom: height * 0.43,
    width: width * 0.85,
    height: width * 0.85,
  },
  nextLevel: {
    flexDirection: 'row',
    marginTop: width * 0.18,
    height: height * 0.105,
    width: width * 0.8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 25,
    borderColor: '#707070',
  },
  unlock: {
    marginLeft: width * 0.05,
    width: width * 0.2,
    height: width * 0.2,
  },
});
