import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generate } from "random-words";

const { width, height } = Dimensions.get('window');

type Meaning = {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
};

type WordData = {
    word: string;
    phonetics: { audio: string }[];
    meanings: Meaning[];
};

const STORAGE_KEYS = {
    word: '@word_of_the_day',
    date: '@word_of_the_day_date',
};

const FALLBACK_WORD = 'apple';

const WOTDCard = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState<WordData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [wordOfTheDay, setWordOfTheDay] = useState('');
    const [cachedWords, setCachedWords] = useState<Record<string, WordData>>({});

    const generateValidWord = () => {
        let newWord;
        do {
            const result = generate({ minLength: 3, maxLength: 10 });
            newWord = Array.isArray(result) ? result.join(' ') : result; // Ensure newWord is a string
            console.log(newWord);
        } while (newWord.length < 3);
        return newWord;
    };

    const getWordOfTheDay = useCallback(async () => {
        try {
            const storedWord = await AsyncStorage.getItem(STORAGE_KEYS.word);
            const storedDate = await AsyncStorage.getItem(STORAGE_KEYS.date);
            const today = new Date().toDateString();

            if (storedWord && storedDate === today) {
                return storedWord;
            } else {
                const newWord = generateValidWord();
                await AsyncStorage.setItem(STORAGE_KEYS.word, newWord);
                await AsyncStorage.setItem(STORAGE_KEYS.date, today);
                return newWord;
            }
        } catch (error) {
            console.error('Failed to fetch or set word of the day', error);
            return FALLBACK_WORD;
        }
    }, []);

    useEffect(() => {
        const fetchWord = async () => {
            const word = await getWordOfTheDay();
            setWordOfTheDay(word);
        };

        fetchWord();

        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight.getTime() - now.getTime();

        const timer = setTimeout(fetchWord, timeUntilMidnight);

        return () => clearTimeout(timer);
    }, [getWordOfTheDay]);

    const fetchWordData = useCallback(async () => {
        if (!wordOfTheDay.trim()) return;

        // Check if the word data is already cached
        if (cachedWords[wordOfTheDay]) {
            setData(cachedWords[wordOfTheDay]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        let word = wordOfTheDay;
        const startTime = Date.now();
        const timeout = 3000; // 3 seconds timeout

        while (Date.now() - startTime < timeout) {
            try {
                const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
                const response = await fetch(url);
                const fetchedData = await response.json();

                if (response.status === 200) {
                    setData(fetchedData[0]);
                    // Update the cache with the new word data
                    setCachedWords(prevCache => ({
                        ...prevCache,
                        [word]: fetchedData[0]
                    }));
                    setLoading(false);
                    return;
                } else {
                    word = generateValidWord();
                    setWordOfTheDay(word);
                    await AsyncStorage.setItem(STORAGE_KEYS.word, word);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        // Fallback to 'apple' if timeout reached or persistent errors occur
        setWordOfTheDay(FALLBACK_WORD);
        setError(null);
        setLoading(false);
    }, [wordOfTheDay, cachedWords]);

    const handleOpenModal = useCallback(() => {
        setModalVisible(true);
        fetchWordData();
    }, [fetchWordData]);

    const handleCloseModal = useCallback(() => {
        setModalVisible(false);
        setData(null);
        setError(null);
    }, []);

    const { height: screenHeight } = Dimensions.get('window');
    const maxHeight = screenHeight * 0.7;

    return (
        <>
            <TouchableOpacity onPress={handleOpenModal}>
                <View style={styles.container}>
                    <Text style={styles.title}>Word of the day</Text>
                    <Text style={styles.label}>{wordOfTheDay}</Text>
                </View>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={handleCloseModal}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={[styles.modalContent, { maxHeight }]}>
                        {loading ? (
                            <ActivityIndicator size='large' color='#0693F1' />
                        ) : error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : data ? (
                            <View style={styles.resultsContainer}>
                                <View style={styles.resultHeaderContainer}>
                                    <Text style={styles.word}>{data.word}</Text>
                                </View>
                                <ScrollView overScrollMode='never' style={{ flexGrow: 0 }}>
                                    {data.meanings.map((meaning, index) => (
                                        <View key={index}>
                                            <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
                                            {meaning.definitions.map((definition, defIndex) => (
                                                <View key={defIndex}>
                                                    <Text style={styles.resultText}>
                                                        Definition: {definition.definition}
                                                    </Text>
                                                    {definition.example && (
                                                        <Text style={styles.resultText}>
                                                            Example: {definition.example}
                                                        </Text>
                                                    )}
                                                </View>
                                            ))}
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default WOTDCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#27AE60',
        width: width * 0.4,
        height: 100,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    label: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 6,
    },
    wordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    word: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginRight: 4
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
    },
    resultsContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 10,
    },
    partOfSpeech: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10
    },
    resultText: {
        fontSize: 14,
        marginBottom: 10,
    },
    resultHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
