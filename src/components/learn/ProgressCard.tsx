import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import CircularProgress from './CircularProgress';

type ProgressCardProps = {
    level: number;
    percentage: number;
};

const levelDescriptions = ["Beginner", "Beginner", "Intermediate", "Intermediate", "Advanced"];

const { width, height } = Dimensions.get('window');

const ProgressCard: React.FC<ProgressCardProps> = ({ level, percentage }) => {
    const [currentLevel, setCurrentLevel] = useState<number>(level - 1);
    const [currentPercentage, setCurrentPercentage] = useState<number>(percentage);

    useEffect(() => {
        setCurrentLevel(level + 1);
        setCurrentPercentage(percentage);
    }, [level, percentage]);

    const levelDescription: string = levelDescriptions[currentLevel];

    return (
        <View style={styles.container}>
            <View style={styles.descriptionContainer}>
                <Text style={styles.levelDescription}>{levelDescription}</Text>
                <Text style={styles.levelText}>Level {currentLevel}</Text>
            </View>
            {/* <AnimatedCircularProgress
                size={48}
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
            </AnimatedCircularProgress> */}
            <CircularProgress size={48} percentage={percentage}/>

        </View>
    );
};

export default ProgressCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#27AE60',
        width: width * 0.42,
        height: 100,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    descriptionContainer: {},
    levelDescription: {
        color: 'white',
        fontSize: 14,
        marginBottom: 10,
        fontWeight: '500',
    },
    levelText: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
    },
    percentageText: {
        color: '#0693F1',
        fontSize: 12,
        fontWeight: '700',
    },
    progressCircle: {
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 30
    },
    progressCircleInnerContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 3,
        marginLeft: 3
    }
});
