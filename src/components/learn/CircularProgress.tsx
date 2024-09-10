import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


type CircularProgressProps = {
    size: number;
    percentage: number;
};


const { width, height } = Dimensions.get('window');

const CircularProgress: React.FC<CircularProgressProps> = ({ size, percentage }) => {
    const [currentPercentage, setCurrentPercentage] = useState<number>(percentage);

    useEffect(() => {
        setCurrentPercentage(percentage);
    }, [percentage]);

    return (
        <View style={styles.container}>
            <AnimatedCircularProgress
                size={size}
                width={6}
                backgroundWidth={2}
                fill={currentPercentage}
                tintColor="#0693F1"
                backgroundColor="#F3F3F3"
                rotation={0}
                lineCap="round"
                style={styles.progressCircle}
                childrenContainerStyle={styles.progressCircleInnerContainer}
            >
                {() => <Text style={styles.percentageText}> {currentPercentage}%</Text>}
            </AnimatedCircularProgress>
        </View>
    );
};

export default CircularProgress;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    percentageText: {
        //marginLeft: 1.5,
        color: '#0693F1',
        fontSize: 12,
        fontWeight: '700',
    },
    progressCircle: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCircleInnerContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 3,
        marginLeft: 3
    }
});
