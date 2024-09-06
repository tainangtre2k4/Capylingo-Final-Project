import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

type AudioPlayerProps = {
    audioSource: string;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSource }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    useEffect(() => {
        const loadSound = async () => {
            // Reset any existing sound
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setIsPlaying(false);
            }

            // Load the new sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioSource },
                { shouldPlay: false }
            );

            setSound(newSound);

            // Set up status update callback
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    setDuration(status.durationMillis || 0);
                    setPosition(status.positionMillis || 0);

                    if (status.didJustFinish) {
                        setIsPlaying(false); // Reset playing state when finished
                    }
                }
            });
        };

        loadSound();

        // Cleanup when the component unmounts or when audioSource changes
        return () => {
            sound?.unloadAsync();
        };
    }, [audioSource]); // Dependency on audioSource to trigger updates

    const handlePlayPause = async () => {
        if (!sound) return;

        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }

        setIsPlaying(!isPlaying);
    };

    const handleReset = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.setPositionAsync(0);
            setIsPlaying(false);
        }
    };

    const handleSliderChange = async (value: number) => {
        if (sound) {
            await sound.setPositionAsync(value);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.controls}>
                <TouchableOpacity onPress={handlePlayPause}>
                    <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
                <View style={{ marginHorizontal: 6 }} />
                <TouchableOpacity onPress={handleReset}>
                    <Ionicons name="refresh" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Slider
                style={styles.slider}
                value={position}
                minimumValue={0}
                maximumValue={duration}
                onSlidingComplete={handleSliderChange}
                minimumTrackTintColor="#0693F1"
                maximumTrackTintColor="white"
                thumbTintColor="white"
            />
            <Text style={styles.progressText}>
                {formatTime(position)} / {formatTime(duration)}
            </Text>
        </View>
    );
};

// Helper function to format milliseconds into MM:SS format
const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#0693F1',
        borderRadius: 12,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slider: {
        width: '70%',
        height: 20,
    },
    progressText: {
        fontSize: 16,
        color: 'white',
    },
});

export default AudioPlayer;
