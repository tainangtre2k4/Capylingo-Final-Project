import { Modal, ActivityIndicator, StatusBar as RNStatusBar, StyleSheet, Text, View, Platform, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import BackButton from "@/src/components/BackButton";
import { fetchUserLevel } from '@/src/fetchData/fetchLearn';
import { fetchVocabLevelPercent, fetchGrammarLevelPercent } from '@/src/fetchData/fetchProgress';
import { updateUserLevel } from '@/src/updateData/updateLearningProgress';
import CircularProgress from '@/src/components/learn/CircularProgress';
import MedalCelebration from '@/src/components/MedalCelebration';
import Ionicons from '@expo/vector-icons/Ionicons';

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
  const user = useAuth();
  const [level, setLevel] = useState<any>(null);
  const [percentVocab, setPercentVocab] = useState<number | 0>(0);
  const [percentGrammar, setPercentGrammar] = useState<number | 0>(0);
  const [percent, setPercent] = useState<number | 0>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy level hiện tại của người dùng
        const userLevel = await fetchUserLevel(user.user?.id);
        setLevel(userLevel.level);
  
        // Lấy phần trăm từ các nguồn
        const percentV = await fetchVocabLevelPercent(user.user?.id, userLevel.level + 1);
        const percentG = await fetchGrammarLevelPercent(user.user?.id, userLevel.level + 1);
        const totalPercent = Math.round((percentV + percentG) / 2);
  
        setPercentVocab(Math.round(percentV));
        setPercentGrammar(Math.round(percentG));
        setPercent(totalPercent);

        if (totalPercent === 100) {
          setShowCongratulations(true);
          const updateResult = await updateUserLevel(user.user?.id, userLevel.level);
  
          if (updateResult.success) {
           
            const newLevel = userLevel.level + 1;

            const newPercentV = await fetchVocabLevelPercent(user.user?.id, newLevel+1);
            const newPercentG = await fetchGrammarLevelPercent(user.user?.id, newLevel+1);
            const newTotalPercent = Math.round((newPercentV + newPercentG) / 2);

            setLevel(newLevel);
  
            setPercentVocab(Math.round(newPercentV));
            setPercentGrammar(Math.round(newPercentG));
            setPercent(newTotalPercent);
  
          
            setTimeout(() => {
              setShowCloseButton(true);
            }, newLevel>=4? 3500 : 8200);
          } else {
            console.error('Failed to update user level');
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
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

  if (loading) {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <ActivityIndicator size="large" color="#2980B9" />
            <Text style={{ marginTop: 10,fontSize: 20, fontWeight: '500', color: '#0693F1',}}>Loading...</Text>
        </View>
    );
  }


  if (error) {
  return <Text>Failed to load user's level {error}</Text>;
  }

  const handleCloseModal = () => {
    setShowCongratulations(false);
    setShowCloseButton(false);
  };

  return (
      <View style={styles.container}>
          <Modal
            transparent={true}
            visible={showCongratulations}
            animationType="fade"
          >
            <View style={styles.congratulationsContainer}>
              <MedalCelebration imageMedal={levels[level].image} completedLevel={level}/>
              {showCloseButton && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseModal}
                >
                  <Ionicons name="close-circle" size={47} color="#FF4D4D" />
                </TouchableOpacity>
              )}
            </View>
          </Modal>
          <View style={styles.buttonContainer}>
              {levels.map((levelItem, index) => {
                let vocabPercent = 0;
                let grammarPercent = 0;
            
                if (levelItem.levelNumber === level + 1) {
                  vocabPercent = percentVocab;
                  grammarPercent = percentGrammar;
                } else if (levelItem.levelNumber < level + 1) {
                  vocabPercent = 100;
                  grammarPercent = 100;
                } 
                return (
                  <TouchableOpacity
                      key={index}
                      style={[styles.button, { backgroundColor: (levelItem.levelNumber <= level+1) ?  levelItem.backgroundColor : '#A0A0A0' }]}
                      onPress={() => router.push(`/learnLevel?level=${levelItem.levelNumber}&vocabPercent=${vocabPercent}&grammarPercent=${grammarPercent}`)}
                      disabled={levelItem.levelNumber > level + 1}
                  >
                      {
                        (levelItem.levelNumber < level+1) &&
                          <Image source={levelItem.image} style={styles.imageBox} />
                      }
                      {
                        (levelItem.levelNumber === level+1) &&
                          <View style={styles.imageBox}>
                            <CircularProgress size={65} percentage={percent}/>
                          </View>
                      }
                     {
                        (levelItem.levelNumber > level+1) &&
                          <View style={[styles.imageBox, {backgroundColor: 'transparent', borderWidth: 0}]}>
                            <Ionicons name="lock-closed" size={40} color="#F6D344" />
                          </View>
                      }
                      <View style={styles.underline}>
                          <Text style={styles.buttonText}>{levelItem.title}</Text>
                      </View>
                      
                  </TouchableOpacity>
              )})}
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
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) + 8 : 8,
    alignItems: 'center',
    paddingBottom: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#3DB2FF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  headerFillerContainer: {
    height: 42,
    width: 42,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginTop: height*0.03,
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
    backgroundColor: '#fff',
    width: height * 0.088,
    height: height * 0.088,
    borderRadius: height * 0.044,
    resizeMode: 'contain',
    marginLeft: width*0.045,
    borderWidth: 3.5,
    borderColor: '#FF8504',
    alignItems: 'center',
    justifyContent: 'center',
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
  circularProgress: {
    position: 'absolute',
    top: -13,
    right: -13,
  },
  congratulationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  congratulationsText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: height*0.057,
    left: 22,
    zIndex: 1,
  },
});
