import { Dimensions, Platform, StatusBar as RNStatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { router, useNavigation } from 'expo-router'
import BackButton from "@/src/components/BackButton";

const { width, height } = Dimensions.get('window')

const SkillCheckLesson = () => {
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

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.lessonCard} onPress={() => router.push('/skillcheck/reading')}>
                <Text style={styles.lessonTitle}>Reading: Article Title</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lessonCard} onPress={() => router.push('/skillcheck/listening')}>
                <Text style={styles.lessonTitle}>Listening: Article Title</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SkillCheckLesson

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 30,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#3DB2FF',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        marginHorizontal: 10, // random color for testing
        color: 'white',
        fontSize: 24,
        fontWeight: '500',
    },
    lessonCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 40, // random number for testing
        backgroundColor: '#F1C40F', // random color for testing
        borderRadius: 8,
    },
    lessonTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: '500'
    }
})
