import { Dimensions, Platform, StatusBar as RNStatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { router, useNavigation } from 'expo-router'
import BackButton from "@/src/components/BackButton";
import { SkillcheckContext } from './_layout';

const { width, height } = Dimensions.get('window')

const SkillCheckLesson = () => {
    const {totalReadingTests, totalListeningTests, setListeningTestIndex, setReadingTestIndex} = useContext(SkillcheckContext);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => (
                <View style={styles.header}>
                    <BackButton />
                    <Text style={styles.title}>Skill Check</Text>
                </View>
            ),
            headerTitleStyle: {
                color: 'white'
            },
            ...Platform.select({
                android: {
                    statusBarColor: '#3DB2FF',
                    statusBarStyle: 'light',
                }
            })
        });
    }, [navigation]);

    const renderLessonCards = () => {
        const cards = [];
        
        for (let i = 0; i < totalReadingTests; i++) {
            cards.push(
                <TouchableOpacity 
                    key={`reading-${i}`} 
                    style={styles.lessonCard} 
                    onPress={() => {
                        setReadingTestIndex(i);
                        router.push('/skillcheck/reading');
                    }}
                >
                    <Text style={styles.lessonTitle}>Reading Test {i + 1}</Text>
                </TouchableOpacity>
            );
        }

        for (let i = 0; i < totalListeningTests; i++) {
            cards.push(
                <TouchableOpacity 
                    key={`listening-${i}`} 
                    style={styles.lessonCard} 
                    onPress={() => {
                        setListeningTestIndex(i);
                        router.push('/skillcheck/listening');
                    }}
                >
                    <Text style={styles.lessonTitle}>Listening Test {i + 1}</Text>
                </TouchableOpacity>
            );
        }

        return cards;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {renderLessonCards()}
        </ScrollView>
    )
}

export default SkillCheckLesson

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#3DB2FF',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        marginHorizontal: 10,
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
    },
    lessonCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
        backgroundColor: '#F1C40F',
        borderRadius: 8,
        marginBottom: 15,
    },
    lessonTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: '500'
    }
})