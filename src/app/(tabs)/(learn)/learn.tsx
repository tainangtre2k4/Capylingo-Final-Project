import {Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import WOTDCard from '@/src/components/learn/WOTDCard';
import SubjectCard from '@/src/components/learn/SubjectCard';
import {StatusBar} from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import { fetchUserLevel } from '@/src/fetchData/fetchLearn';
import { fetchVocabLevelPercent, fetchGrammarLevelPercent } from '@/src/fetchData/fetchProgress';
import ProgressCard from '@/src/components/learn/ProgressCard'
import React, {useState, useEffect} from 'react';

const { width, height } = Dimensions.get('window');

const Learn = () => {
    const router = useRouter();
    const user = useAuth();
    const [level, setLevel] = useState<any>(null);
    const [percent, setPercent] = useState<number | 0>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          setError(null);
          try {
            const userLevel = await fetchUserLevel(user.user?.id);
            const percentV = await fetchVocabLevelPercent(user.user?.id, userLevel.level+1);
            const percentG = await fetchGrammarLevelPercent(user.user?.id, userLevel.level+1);
            const totalPercent = Math.round((percentV + percentG) / 2);
            setLevel(userLevel.level);
            setPercent(totalPercent);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
      }
    
    if (error) {
    return <Text>Failed to load user's level {error}</Text>;
    }
    
    return (
        <>
            <StatusBar style='light' backgroundColor='#3DB2FF' />
            <View style={styles.container}>
                <View style={styles.headBanner}>
                    <View style={styles.GreetingContainer}>
                        <Text style={styles.greeting}>Welcome, New User!</Text>
                        <Text style={styles.dictionaryLabel}>Capybara Dictionary</Text>
                        <View style={styles.searchBox}>
                            <TextInput style={styles.searchInput} placeholder='Quick Search' />
                            <TouchableOpacity style={styles.searchButton}>
                                <Ionicons name='search-outline' size={18} color='white' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Image
                        source={require('@/assets/images/learn/learn-greeter.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.bodyContainer}>
                    {/*<View style={styles.indicator} />*/}
                    <Text style={styles.bodyTitle}>Your Learning Progress</Text>
                    <View style={styles.trackingCardsContainer}>      
                        <WOTDCard />
                        <TouchableOpacity onPress={()=>router.push('/level')}>
                            <ProgressCard level={level} percentage={percent} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.SubjectCardsContainer}>
                        <SubjectCard type='vocabulary' level={level+1}/>
                        <SubjectCard type='grammar' level={level+1}/>
                        <SubjectCard type='skillcheck'/>
                    </View>
                </View>
            </View>
        </>
    );
};

export default Learn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#3DB2FF"
    },
    headBanner: {
        backgroundColor: "#3DB2FF",
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        flexDirection: 'row',
    },
    GreetingContainer: {
        paddingTop: height * .025,
        paddingBottom: height * .04

    },
    greeting: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        marginBottom: height * .02,
        marginHorizontal: 10
    },
    dictionaryLabel: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        marginBottom: height * .02,
        marginLeft: 10,
        marginRight: 30
    },
    searchBox: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        elevation: 4
    },
    searchButton: {
        backgroundColor: '#3DB2FF',
        padding: 4,
        borderRadius: 8
    },
    searchInput: {
        flexDirection: 'row',
        flex: 1,
        fontSize: 16,
        fontStyle: 'italic',
        paddingLeft: 8
    },
    image: {
        marginTop: height * .034,
        height: height * .17,
        width: width * .33,
        resizeMode: 'contain'
    },
    bodyContainer: {
        flex: 1,
        borderTopRightRadius: width * .08,
        borderTopLeftRadius: width * .08,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    // indicator: {
    //     width: width * .2,
    //     borderWidth: 2,
    //     borderColor: '#A2A7A9',
    //     alignSelf: 'center'
    // },
    bodyTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginVertical: height * .02,
        alignSelf: 'center'
    },
    trackingCardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    SubjectCardsContainer: {
        flex: 1,
        marginVertical: 30, // not finish yet
        justifyContent: 'space-between',
    }
})
