import {StatusBar as RNStatusBar, StyleSheet, Text, View} from 'react-native'
import React, {useEffect} from 'react'
import {Link, useNavigation} from 'expo-router'
import BackButton from '@/src/components/BackButton';

const VocabularyLesson = () => {
    const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.header}>
          <BackButton/>
          <Text style={styles.title}>Vocabulary</Text>
        </View>
      ),
      headerTitleStyle: {
        color: 'white'
      },
    });
  }, [navigation]);

    return (
        <View style={styles.container}>
            <Link href='/(learn)/vocabulary/exercises'>exercises</Link>
        </View>
    )
}

export default VocabularyLesson

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#3DB2FF',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        marginHorizontal: 10,
        color: 'white',
        fontSize: 22,
        fontWeight: '500'
    }
})
