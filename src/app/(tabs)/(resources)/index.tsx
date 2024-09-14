import * as React from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('screen');

const bgs: string[] = ['#FF4B4C', '#FFC107', '#99CC29', '#0074CE'];

interface DataItem {
    key: string;
    title: string;
    description: string;
    image: any; // Consider using a more specific type if possible
    navigate: string;
}

const DATA: DataItem[] = [
    {
        key: "1",
        title: "Daily English News",
        description: "Catch up on the latest news and enhance your English skills with our daily reading feature. Improve your vocabulary and comprehension with every article.",
        image: require('@/assets/images/resources/capyNews.png'),
        navigate: '/(resources)/news',
    },
    {
        key: "2",
        title: "Community",
        description: "Play exciting games that make learning English fun. Improve your language skills through entertaining and interactive challenges.",
        image: require('@/assets/images/resources/capyCommunity.png'),
        navigate: '/(resources)/community',
    },
    {
        key: "3",
        title: "AI Chatbot",
        description: "Chat with our quirky digital buddy, Cabybot! He will be a great company for your journey. Our beloved Cabybot sometimes turns into Dumdumbara though...",
        image: require('@/assets/images/resources/capyAI.png'),
        navigate: '/(resources)/chatbot',
    },
    {
        key: "4",
        title: "Play Games",
        description: "Play exciting games that make learning English fun. Improve your language skills through entertaining and interactive challenges.",
        image: require('@/assets/images/resources/capyGames.png'),
        navigate: '/(resources)/playgame',
    },
];

interface IndicatorProps {
    scrollX: Animated.Value;
}

const Indicator: React.FC<IndicatorProps> = ({ scrollX }) => {
    return (
        <View style={{ flexDirection: 'row', position: 'absolute', bottom: 150 }}>
            {DATA.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.8, 1.4, 0.8],
                    extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.6, 0.9, 0.6],
                    extrapolate: 'clamp',
                });
                return (
                    <Animated.View
                        key={`indicator-${i}`}
                        style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            backgroundColor: "#fff",
                            margin: 10,
                            opacity,
                            transform: [{ scale }],
                        }}
                    />
                );
            })}
        </View>
    );
};

interface BackdropProps {
    scrollX: Animated.Value;
}

const Backdrop: React.FC<BackdropProps> = ({ scrollX }) => {
    const backgroundColor = scrollX.interpolate({
        inputRange: bgs.map((_, i) => i * width),
        outputRange: bgs.map((bg) => bg),
    });
    return (
        <Animated.View
            style={[StyleSheet.absoluteFillObject, { backgroundColor }]}
        />
    );
};

interface SquareProps {
    scrollX: Animated.Value;
}

const Square: React.FC<SquareProps> = ({ scrollX }) => {
    const YOLO = Animated.divide(
        Animated.modulo(scrollX, width),
        new Animated.Value(width)
    );
    const rotate = YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['35deg', '0deg', '35deg']
    });
    const translateX = YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -height, 0],
    });
    return (
        <Animated.View
            style={{
                width: height,
                height: height,
                backgroundColor: '#fff',
                borderRadius: 86,
                position: 'absolute',
                top: -height * 0.70,
                left: -height * 0.33,
                transform: [{ rotate }, { translateX }]
            }}
        />
    );
};

const ResourcesStack: React.FC = () => {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const scrollX = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const listener = scrollX.addListener(({ value }) => {
            const index = Math.round(value / width);
            setCurrentIndex(index);
        });

        return () => scrollX.removeListener(listener);
    }, [scrollX]);

    return (
        <View style={styles.container}>
            <Backdrop scrollX={scrollX} />
            <Square scrollX={scrollX} />
            <Animated.FlatList
                data={DATA}
                keyExtractor={(item) => item.key}
                horizontal
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({ item }) => (
                    <View style={{ width: width, alignItems: 'center' }}>
                        <View style={{ flex: 0.6, justifyContent: 'center', padding: 20 }}>
                            <Image
                                source={item.image}
                                style={{
                                    width: width*0.48,
                                    height: height*0.48,
                                    resizeMode: 'contain'
                                }}
                            />
                        </View>
                        <View style={{ flex: 0.2, alignItems: 'center' }}>
                            <Text style={{
                                color: '#fff',
                                fontWeight: '800',
                                fontSize: 30,
                                marginBottom: 24,
                            }}>
                                {item.title}
                            </Text>
                            <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16, marginHorizontal: 30 }}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                )}
            />
            <Indicator scrollX={scrollX} />
            <TouchableOpacity
                style={{
                    height: 60,
                    width: 273,
                    position: 'absolute',
                    bottom: 70,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 30,
                }}
                onPress={() => {
                    const currentItem = DATA[currentIndex];
                    router.push(currentItem.navigate);
                }}
            >
                <Text style={{ fontWeight: '600', fontSize: 18, color: '#707070' }}>Yes, Captain Capybara !</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
});

export default ResourcesStack;