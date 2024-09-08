import { StatusBar as RNStatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Link, useNavigation, useLocalSearchParams } from 'expo-router';
import BackButton from '@/src/components/BackButton';

const LearnTopic: React.FC = () => {
    const navigation = useNavigation();
    const params = useLocalSearchParams();

    // Type casting to ensure correct types
    const title = params.title as string;
    const topicID = Number(params.topicID);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => (
                <View style={styles.header}>
                    <BackButton />
                    <Text style={styles.title}>{title}</Text>
                </View>
            ),
            headerTitleStyle: {
                color: 'white',
            },
        });
    }, [navigation, title]);

    return (
        <View style={styles.container}>
            <Text>{topicID}</Text>
            <Link href={`/(learn)/vocabulary/exercises?topicID=${topicID}`}>Exercises</Link>
            <Link href={`/(learn)/vocabulary/learnVocab?topicID=${topicID}`}>Learn Vocabulary</Link>
        </View>
    );
};

export default LearnTopic;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#3DB2FF',
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        marginHorizontal: 10,
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
    },
});
