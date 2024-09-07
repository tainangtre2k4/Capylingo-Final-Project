import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions}  from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('screen');

type NextButtonProps = {
    result: boolean | null;
    onNext: () => void;
  };
  const NextButton: React.FC<NextButtonProps> = ({ result, onNext }) => {
  const getGradientColors = () => {
    if (result === true) {
      return ['#99CC29', '#99CC29']; // Gradient màu xanh lá
    } else if (result === false) {
      return ['#FF4B4C', '#FF4B4C']; // Gradient màu đỏ
    } else {
      return ['#5DB2FF', '#0074CE']; // Gradient mặc định màu xanh lam
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.nextButtonContainer} onPress={() => onNext()}>
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextButton}
            >
                <Text style={styles.textNextButton}>Next</Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    nextButtonContainer: {
        position: 'absolute',
        bottom: height*0.04,
        width: '60%',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.33,
        shadowRadius: 3,
        elevation: 4,
        zIndex: 1,
    },
    nextButton:{
        width: '100%',
        height: width*0.128,
        borderRadius: width*0.1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textNextButton: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '500',
    },
});

export default NextButton;
