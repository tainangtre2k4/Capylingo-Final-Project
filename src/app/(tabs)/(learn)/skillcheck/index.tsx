import { Image, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { router, useNavigation } from 'expo-router'
import BackButton from "@/src/components/BackButton";
import { SkillcheckContext } from './_layout';

const { width, height } = Dimensions.get('window');
const cardColors = ['#9BD2FC', '#F1C40F', '#16A085', '#2980B9'];

const SkillCheckLesson = () => {
    const {totalReadingTests, totalListeningTests, setListeningTestIndex, setReadingTestIndex} = useContext(SkillcheckContext);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => (
                <View style={styles.headerContainer}>
                    <BackButton />
                    <Text style={styles.headerTitle}>Skill Check</Text>
                    <View style={styles.headerFillerContainer} />
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
                    style={[styles.lessonCard, { backgroundColor: cardColors[i % cardColors.length] }]}
                    onPress={() => {
                        setReadingTestIndex(i);
                        router.push('/skillcheck/reading');
                    }}
                >
                    <View style={styles.imageBox}>
                        <Image source={require('@/assets/images/learn/reading.png')} style={styles.image}/>
                    </View>
                    <Text style={styles.lessonTitle}>Reading Test {i + 1}</Text>
                </TouchableOpacity>
            );
        }

        for (let i = 0; i < totalListeningTests; i++) {
            cards.push(
                <TouchableOpacity 
                    key={`listening-${i}`} 
                    style={[styles.lessonCard, { backgroundColor: cardColors[i % cardColors.length] }]}
                    onPress={() => {
                        setListeningTestIndex(i);
                        router.push('/skillcheck/listening');
                    }}
                >
                    <View style={styles.imageBox}>
                        <Image source={require('@/assets/images/learn/listening.png')} style={styles.image}/>
                    </View>
                    <Text style={styles.lessonTitle}>Listening Test {i + 1}</Text>
                </TouchableOpacity>
            );
        }

        return cards;
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
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
    imageBox: {
        padding: 10,
        backgroundColor: '#fff',
        width: height * 0.088,
        height: height * 0.088,
        borderRadius: height * 0.044,
        marginLeft: width*0.045,
        borderWidth: 3.5,
        borderColor: '#FF8504',
        alignItems: 'center',
        justifyContent: 'center',
      },
    image:{
        width: height * 0.07,
        height: height * 0.07,
        borderRadius: height * 0.035,
        resizeMode: 'contain',
    },
    lessonCard: {
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
    lessonTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: '500',
        marginLeft: 16,
    }
})