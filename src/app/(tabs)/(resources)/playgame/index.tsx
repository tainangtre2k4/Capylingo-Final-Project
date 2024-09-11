import React, { useState, useEffect } from 'react';
import { View, Button, Modal, Text, Alert, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { levels } from '@/constants/gameData'; // Import levels data from gameData.ts
import colors from '@/constants/Colors';
import Header from '@/src/components/community/Header';
import { router } from 'expo-router';
import { cld } from '@/src/lib/cloudinary';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from 'cloudinary-react-native';

const characterImageUri = 'game/nsenkuk8kw5ckwnsgtao';
const treasureImageUri = 'game/q7ruhk88afkzvliw9wnc';
const blackStoneImageUri = 'game/lrp1oh7itbvhsx0nv3xh';

// Get screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Type definitions for the player position and question
type PlayerPosition = { row: number; col: number };
type Question = { question: string; options: string[]; correct: string };
type Level = {
  initialMaps: number[][][];
  gridSize: number;
  initialPlayerPosition: PlayerPosition;
  questions: Question[];
};

const TreasureHuntGame: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null); // No level selected initially
  const [map, setMap] = useState<number[][] | null>(null);
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null); // Store the current question object
  const [nextPosition, setNextPosition] = useState<PlayerPosition | null>(null); // To store where the player should move after answering
  const [timer, setTimer] = useState<number>(15); // Timer state
  const [gridSize, setGridSize] = useState<number | null>(null); // Dynamically set grid size

  const characterCldImage = characterImageUri
  ? cld.image(characterImageUri).resize(thumbnail().width(screenWidth).height(screenWidth))
  : null;

  const stoneCldImage = blackStoneImageUri
  ? cld.image(blackStoneImageUri).resize(thumbnail().width(screenWidth).height(screenWidth))
  : null;

  const treasureCldImage = treasureImageUri
  ? cld.image(treasureImageUri).resize(thumbnail().width(screenWidth).height(screenWidth))
  : null;

  // Function to handle when a level is selected
  const selectLevel = (levelIndex: number) => {
    const selectedLevel = levels[levelIndex];

    // Randomly select one map from the available initial maps
    const randomMap = selectedLevel.initialMaps[Math.floor(Math.random() * selectedLevel.initialMaps.length)];

    setCurrentLevel(levelIndex);
    setMap(randomMap); // Set the randomly selected map
    setPlayerPosition(selectedLevel.initialPlayerPosition);
    setGridSize(selectedLevel.gridSize);
    setTimer(15); // Reset the timer
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (modalVisible && timer > 0) {
      timeout = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (modalVisible && timer === 0) {
      handleTimeOut();
    }

    return () => clearTimeout(timeout); // Clear timeout on cleanup
  }, [timer, modalVisible]);

  // Calculate dynamic tile size
  const tileSize = gridSize ? Math.min(screenWidth, screenHeight) / gridSize - 10 : 0; // Adjust 10 for padding/margin

  // Function to move the player
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!playerPosition || !map || !gridSize) return;

    const { row, col } = playerPosition;
    let newRow = row;
    let newCol = col;

    if (direction === 'up' && row > 0) newRow--;
    if (direction === 'down' && row < gridSize - 1) newRow++;
    if (direction === 'left' && col > 0) newCol--;
    if (direction === 'right' && col < gridSize - 1) newCol++;

    if (map[newRow][newCol] === 1) {
      Alert.alert("Blocked by a stone!");
      return;
    }

    if (map[newRow][newCol] === 2) {
      const randomQuestion = levels[currentLevel!].questions[Math.floor(Math.random() * levels[currentLevel!].questions.length)]; // Pick a random question
      setModalVisible(true);
      setCurrentQuestion(randomQuestion);
      setNextPosition({ row: newRow, col: newCol });
      setTimer(1000000); // Reset the timer when a new question appears
      return;
    }

    if (map[newRow][newCol] === 3) {
      Alert.alert("Victory! You completed the level!");
      goToLevelSelection();
      return;
    }

    setPlayerPosition({ row: newRow, col: newCol });
  };

  // Handle time-out when the timer reaches 0
  const handleTimeOut = () => {
    setModalVisible(false);
    if (!nextPosition || !map) return;

    const { row, col } = nextPosition;

    // Update the map by replacing the yellow stone (2) with a black stone (1)
    const newMap = map.map((mapRow, index) => {
      if (index === row) {
        const newRow = [...mapRow];
        newRow[col] = 1;
        return newRow;
      }
      return mapRow;
    });
    setMap(newMap);

    Alert.alert("Time's up!");
  };

  // Handle answering questions
  const handleQuestionAnswer = (answer: string) => {
    setModalVisible(false);
    if (!nextPosition || !map || !currentQuestion) return;

    const { row, col } = nextPosition;

    if (answer === currentQuestion.correct) {
      // Update the map by replacing the yellow stone (2) with a normal tile (0)
      const newMap = map.map((mapRow, index) => {
        if (index === row) {
          const newRow = [...mapRow];
          newRow[col] = 0;
          return newRow;
        }
        return mapRow;
      });
      setMap(newMap);

      // Move the player to the new position
      setPlayerPosition({ row, col });
    } else {
      // On wrong answer, replace the yellow stone with a black stone
      const newMap = map.map((mapRow, index) => {
        if (index === row) {
          const newRow = [...mapRow];
          newRow[col] = 1;
          return newRow;
        }
        return mapRow;
      });
      setMap(newMap);

      Alert.alert("Wrong answer!");
    }
  };

  // Function to reset the current level
  const resetLevel = () => {
    if (currentLevel === null) return;
    const selectedLevel = levels[currentLevel];
    // Re-randomize the map
    const randomMap = selectedLevel.initialMaps[Math.floor(Math.random() * selectedLevel.initialMaps.length)];
    setMap(randomMap); // Reset the map to the newly randomized map
    setPlayerPosition(selectedLevel.initialPlayerPosition); // Reset the player's position
    setTimer(15); // Reset the timer
  };

  // Function to go back to level selection
  const goToLevelSelection = () => {
    setCurrentLevel(null);
    setMap(null);
    setPlayerPosition(null);
  };

  if (currentLevel === null) {
    // Level selection screen
    return (
        <View style={{flex: 1}}>
        <Header title={'Finding Treasure !'} backHandler={()=>{router.back();}} search={false}/>
        <Text style={{margin: 16}}>
        <Text style={{fontWeight: 'bold'}}>Game Introduction: </Text>
        <Text>Help the capybara find the treasure by crossing water puddles and avoiding blocking stones.</Text>
        </Text>
   
        <Text style={{margin: 16}}>
        <Text style={{fontWeight: 'bold'}}>How to Play: </Text>
        <Text>Use the arrow keys to move the capybara. Answer questions correctly to pass through stones, but be careful—wrong answers will add more obstacles!</Text>
        </Text>

      <View style={styles.container}>
        <Text style={styles.header}>Select a Level:</Text>
        {levels.map((level, index) => (
          <Button key={index} title={`Level ${level.level}`} onPress={() => selectLevel(index)} />
        ))}
      </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <ScrollView>
          {/* Map Layout */}
          <View style={styles.map}>
            {map?.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((tile, colIndex) => (
                  <View
                    key={colIndex}
                    style={[
                      styles.tile,
                      tile === 0 && styles.emptyTile, // Style for empty tiles
                      { width: tileSize, height: tileSize }, // Dynamically adjust tile size
                    ]}
                  >
                    {/* Display the character if the player is in this tile */}
                    {playerPosition?.row === rowIndex && playerPosition.col === colIndex && characterCldImage && (
                        <AdvancedImage cldImg={characterCldImage} style={[styles.character, { width: tileSize - 10, height: tileSize - 10 }]} />
                    )}
                    {/* Display the black stone if it's a black stone tile */}
                    {tile === 1 && stoneCldImage && (
                      <AdvancedImage cldImg={stoneCldImage} style={{ width: tileSize - 10, height: tileSize - 10 }} />
                    )}
                    {/* Display the yellow stone */}
                    {tile === 2 && (
                      <View style={[styles.yellowStone, { width: tileSize - 10, height: tileSize - 10 }]} />
                    )}
                    {/* Display the treasure if it's the treasure tile */}
                    {tile === 3 && treasureCldImage && (
                      <AdvancedImage cldImg={treasureCldImage} style={{ width: tileSize - 10, height: tileSize - 10 }} />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Arrow Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => movePlayer('up')}>
          <Ionicons name="arrow-up" size={40} color="black" />
        </TouchableOpacity>
        <View style={styles.horizontalControls}>
          <TouchableOpacity onPress={() => movePlayer('left')}>
            <Ionicons name="arrow-back" size={40} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => movePlayer('right')}>
            <Ionicons name="arrow-forward" size={40} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => movePlayer('down')}>
          <Ionicons name="arrow-down" size={40} color="black" />
        </TouchableOpacity>
      </View>

      {/* Reset Button */}
      <View style={styles.resetButton}>
        <Button title="Reset Level" onPress={resetLevel} />
        <Button title="Go to Level Selection" onPress={goToLevelSelection} />
      </View>

      {/* Question Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modal}>
          {currentQuestion && (
            <>
              <Text style={{ fontSize: 20 }}>Question: {currentQuestion.question}</Text>
              {currentQuestion.options.map((option, index) => (
                <Button key={index} title={option} onPress={() => handleQuestionAnswer(option)} />
              ))}
              <Text>Time remaining: {timer}s</Text>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,marginTop: 16, alignItems: 'center', },
  header: { fontSize: 24 },
  map: { flexDirection: 'column', marginTop: 100 },
  row: { flexDirection: 'row' },
  tile: {
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTile: {
    backgroundColor: '#fff', // Define what an empty tile looks like, you can set any background color or style
  },
  character: {}, // Character image dimensions will be dynamically set
  yellowStone: { backgroundColor: colors.primary.primary40 }, // Yellow stone style
  controls: { flexDirection: 'column', alignItems: 'center' },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 10,
  },
  resetButton: { marginTop: 20,marginBottom:16 }, // Style for Reset button
  modal: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default TreasureHuntGame;
