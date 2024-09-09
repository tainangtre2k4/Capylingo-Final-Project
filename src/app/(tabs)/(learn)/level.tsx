import { StatusBar as RNStatusBar, StyleSheet, Text, View, Platform, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import BackButton from "@/src/components/BackButton";

const { width, height } = Dimensions.get('screen');

const levels = [
  {
    title: 'Level 1',
    backgroundColor: '#9BD2FC',
    image: require('@/assets/images/level/medal1.png'),
    levelNumber: 1,
  },
  {
    title: 'Level 2',
    backgroundColor: '#F1C40F',
    image: require('@/assets/images/level/medal2.png'),
    levelNumber: 2,
  },
  {
    title: 'Level 3',
    backgroundColor: '#16A085',
    image: require('@/assets/images/level/medal3.png'),
    levelNumber: 3,
  },
  {
    title: 'Level 4',
    backgroundColor: '#2980B9',
    image: require('@/assets/images/level/medal4.png'),
    levelNumber: 4,
  },
];

const Level: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <Text style={styles.headerTitle}>Capy's Levels</Text>
          <View style={styles.headerFillerContainer} />
        </View>
      ),
    });
  }, [navigation]);

  return (
      <View style={styles.container}>
          <View style={styles.buttonContainer}>
              {levels.map((level, index) => (
                  <TouchableOpacity
                      key={index}
                      style={[styles.button, { backgroundColor: level.backgroundColor }]}
                      onPress={() => router.push(`/learnLevel?level=${level.levelNumber}`)}
                  >
                      <Image source={level.image} style={styles.imageBox} />
                      <View style={styles.underline}>
                          <Text style={styles.buttonText}>{level.title}</Text>
                      </View>
                  </TouchableOpacity>
              ))}
          </View>
          <Image
            source={require('@/assets/images/level/bottomDecore.png')}
            style={{width: width, height: width*0.275779, resizeMode: 'contain', position: 'absolute', bottom: 0}}
          />
      </View>
  );
};

export default Level;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 20 : 0,
    alignItems: 'center',
    height: height * 0.1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#3DB2FF',
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: '600',
    color: '#fff',
    shadowColor: '#000',
    // shadowOffset: {
    //   width: -2,
    //   height: 4,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
    // elevation: 3,
  },
  headerFillerContainer: {
    height: 42,
    width: 42,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginTop: height*0.01,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    width: width * 0.85,
    height: height * 0.1134,
    marginTop: height * 0.0265,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  imageBox: {
    width: height * 0.088,
    height: height * 0.088,
    borderRadius: height * 0.044,
    resizeMode: 'contain',
    marginLeft: width*0.045,
    borderWidth: 3.5,
    borderColor: '#FF8504',
  },
  underline: {
    padding: 8,
    marginLeft: width*0.13,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
});
