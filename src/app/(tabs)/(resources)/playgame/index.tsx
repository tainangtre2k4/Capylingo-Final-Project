import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Modal,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { levels } from "@/constants/gameData"; // Import levels data from gameData.ts
import colors from "@/constants/Colors";
import Header from "@/src/components/community/Header";
import { router } from "expo-router";
import { cld } from "@/src/lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "cloudinary-react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import BackButton from "@/src/components/BackButton";
import { StatusBar } from "expo-status-bar";

const characterImageUri = "game/nsenkuk8kw5ckwnsgtao";
const treasureImageUri = "game/q7ruhk88afkzvliw9wnc";
const blackStoneImageUri = "game/lrp1oh7itbvhsx0nv3xh";

// Get screen dimensions
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

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
  const [modalVisibled, setModalVisibled] = useState(false);
  const [playGameVisible, setPlayGameVisible] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null); // No level selected initially
  const [map, setMap] = useState<number[][] | null>(null);
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null); // Store the current question object
  const [nextPosition, setNextPosition] = useState<PlayerPosition | null>(null); // To store where the player should move after answering
  const [timer, setTimer] = useState<number>(15); // Timer state
  const [gridSize, setGridSize] = useState<number | null>(null); // Dynamically set grid size

  const characterCldImage = characterImageUri
    ? cld
        .image(characterImageUri)
        .resize(thumbnail().width(500).height(500))
    : null;

  const stoneCldImage = blackStoneImageUri
    ? cld
        .image(blackStoneImageUri)
        .resize(thumbnail().width(500).height(500))
    : null;

  const treasureCldImage = treasureImageUri
    ? cld
        .image(treasureImageUri)
        .resize(thumbnail().width(500).height(500))
    : null;

  type CustomAlertProps = {
    visible: boolean;
    message: string;
    onClose: () => void;
  };

  const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    message,
    onClose,
  }) => {
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.customAlertContainer}>
          <View style={styles.customAlertBox}>
            <Text style={styles.customAlertText}>{message}</Text>
            <TouchableOpacity
              style={styles.customAlertButton}
              onPress={onClose}
            >
              <Text style={styles.customAlertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showCustomAlert = (message: string) => {
    setAlertMessage(message);
    setCustomAlertVisible(true);
  };

  // Function to handle when a level is selected
  const selectLevel = (levelIndex: number) => {
    const selectedLevel = levels[levelIndex];

    // Randomly select one map from the available initial maps
    const randomMap =
      selectedLevel.initialMaps[
        Math.floor(Math.random() * selectedLevel.initialMaps.length)
      ];

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
  const tileSize = gridSize
    ? Math.min(screenWidth, screenHeight) / gridSize - 10
    : 0; // Adjust 10 for padding/margin

  // Function to move the player
  const movePlayer = (direction: "up" | "down" | "left" | "right") => {
    if (!playerPosition || !map || !gridSize) return;

    const { row, col } = playerPosition;
    let newRow = row;
    let newCol = col;

    if (direction === "up" && row > 0) newRow--;
    if (direction === "down" && row < gridSize - 1) newRow++;
    if (direction === "left" && col > 0) newCol--;
    if (direction === "right" && col < gridSize - 1) newCol++;

    if (map[newRow][newCol] === 1) {
      showCustomAlert("Blocked by a stone!");
      return;
    }

    if (map[newRow][newCol] === 2) {
      const randomQuestion =
        levels[currentLevel!].questions[
          Math.floor(Math.random() * levels[currentLevel!].questions.length)
        ]; // Pick a random question
      setModalVisible(true);
      setCurrentQuestion(randomQuestion);
      setNextPosition({ row: newRow, col: newCol });
      setTimer(15); // Reset the timer when a new question appears
      return;
    }

    if (map[newRow][newCol] === 3) {
      showCustomAlert("Victory! You completed the level!");

      // Delay going back to level selection to allow the alert to be shown
      setTimeout(() => {
        goToLevelSelection();
      }, 2000); // Adjust the delay as necessary (2000ms = 2 seconds)
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
    showCustomAlert("Time's up!");
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
      showCustomAlert("Wrong Answer!");
    }
  };

  // Function to reset the current level
  const resetLevel = () => {
    if (currentLevel === null) return;
    const selectedLevel = levels[currentLevel];
    // Re-randomize the map
    const randomMap =
      selectedLevel.initialMaps[
        Math.floor(Math.random() * selectedLevel.initialMaps.length)
      ];
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

  // Level selection screen
  return currentLevel === null ? (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          position: "absolute",
          zIndex: 2,
          marginTop: 20,
          marginLeft: 20,
        }}
      >
        <BackButton iconColor="black" />
      </View>
      <Image
        source={require("@/assets/images/game/gamePoster.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: 340,
          zIndex: -1,
        }}
      />
      <Text
        style={{
          fontSize: 26,
          color: "black",
          fontWeight: "bold",
          marginTop: 350,
          marginLeft: 20,
        }}
      >
        Finding Treasure
      </Text>
      <View style={styles.infoRow}>
        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => {
            setModalVisibled(true);
          }}
        >
          <AntDesign name="questioncircleo" size={24} color="#3DB2FF" />
          <Text style={[styles.infoLabel, { color: "#3DB2FF" }]}>
            How To Play
          </Text>
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <View style={styles.infoItem}>
          <Text style={[styles.infoValue, { color: "#FF2442" }]}>
            Intermediate+
          </Text>
          <Text style={[styles.infoLabel, { color: "#FF2442" }]}>
            Recommend Level
          </Text>
        </View>
      </View>

      <View style={{ marginLeft: 16, marginRight: 7 }}>
        <Text style={{ fontSize: 18, marginBottom: 5 }}>Description</Text>
        <Text style={{ color: "#6F6F6F" }}>
          Capybara Treasure Hunt is an exciting adventure game where you guide a
          cute capybara through various obstacles and puzzles to discover hidden
          treasure. Along the way, you'll face thrilling challenges and
          unexpected surprises. Immerse yourself in the adventure as you solve
          puzzles, avoid obstacles, and explore new paths, all while leading the
          capybara to victory. Get ready for a fun-filled journey that will test
          your skills and keep you entertained!
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={{
          padding: 16,
          backgroundColor: "#3DB2FF",
          margin: 16,
          borderRadius: 20,
          alignItems: "center",
        }}
        onPress={() => setPlayGameVisible(true)}
      >
        <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
          Play Now !
        </Text>
      </TouchableOpacity>

      {/* <Text style={{margin: 16}}>
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
      </View> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibled}
        onRequestClose={() => setModalVisibled(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={[
                styles.modalText,
                { fontWeight: "bold", fontSize: 24, marginBottom: 20 },
              ]}
            >
              How to Play
            </Text>
            <Text style={[styles.modalText, { marginBottom: 5 }]}>
              In Capybara Treasure Hunt, your goal is to help the capybara find
              the treasure by navigating through a map full of obstacles.
            </Text>
            <Text style={[styles.modalText, { marginBottom: 5 }]}>
              {"\u2022"} Use the arrow buttons (up, down, left, right) to move
              the capybara around.
            </Text>
            <Text style={[styles.modalText, { marginBottom: 5 }]}>
              {"\u2022"} You cannot move through square tiles with obstacles
              like black stones.
            </Text>
            <Text style={[styles.modalText, { marginBottom: 5 }]}>
              {" "}
              {"\u2022"} To cross rivers, you must answer a question. If you
              answer correctly, the capybara will successfully cross the river.
              If you answer incorrectly, the river turns into a rock, blocking
              your path.
            </Text>
            <Text
              style={[
                styles.modalText,
                { marginVertical: 15, fontSize: 16, fontWeight: "bold" },
              ]}
            >
              Find the shortest route to reach the treasure and guide the
              capybara safely!{" "}
            </Text>

            {/* Button to close the modal */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisibled(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={playGameVisible}
        onRequestClose={() => setPlayGameVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View>
              <Text style={styles.header}>Select a Level:</Text>
              {levels.map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.levelButton}
                  onPress={() => selectLevel(index)}
                >
                  <Text style={styles.levelText}>Level {level.level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPlayGameVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  ) : (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          zIndex: 2,
          left: 20,
        }}
      >
        <BackButton iconColor="black" />
      </View>
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
                    {playerPosition?.row === rowIndex &&
                      playerPosition.col === colIndex &&
                      characterCldImage && (
                        <AdvancedImage
                          cldImg={characterCldImage}
                          style={[
                            styles.character,
                            { width: tileSize - 10, height: tileSize - 10 },
                          ]}
                        />
                      )}
                    {/* Display the black stone if it's a black stone tile */}
                    {tile === 1 && stoneCldImage && (
                      <AdvancedImage
                        cldImg={stoneCldImage}
                        style={{
                          width: tileSize - 10,
                          height: tileSize - 10,
                        }}
                      />
                    )}
                    {/* Display the yellow stone */}
                    {tile === 2 && (
                      <View
                        style={[
                          styles.yellowStone,
                          { width: tileSize - 10, height: tileSize - 10 },
                        ]}
                      />
                    )}
                    {/* Display the treasure if it's the treasure tile */}
                    {tile === 3 && treasureCldImage && (
                      <AdvancedImage
                        cldImg={treasureCldImage}
                        style={{
                          width: tileSize - 10,
                          height: tileSize - 10,
                        }}
                      />
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
        <TouchableOpacity onPress={() => movePlayer("up")} style={styles.controller}>
          <Ionicons name="arrow-up" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.horizontalControls}>
          <TouchableOpacity onPress={() => movePlayer("left")} style={styles.controller}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => movePlayer("right")} style={styles.controller}>
            <Ionicons name="arrow-forward" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => movePlayer("down")} style={styles.controller}>
          <Ionicons name="arrow-down" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Reset Button */}
      <View style={styles.resetButtonContainer}>
        <TouchableOpacity
          onPress={resetLevel}
          style={{ backgroundColor: "#3DB2FF", padding: 12, borderRadius: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
            Reset Level
          </Text>
        </TouchableOpacity>
        <View style={{ marginHorizontal: 14 }} />
        <TouchableOpacity
          onPress={goToLevelSelection}
          style={{ backgroundColor: "#3DB2FF", padding: 12, borderRadius: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
            Go to Level Selection
          </Text>
        </TouchableOpacity>
      </View>

      {/* Question Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modal}>
          {currentQuestion && (
            <>
              <Text style={{ fontSize: 20 }}>
                Question: {currentQuestion.question}
              </Text>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleQuestionAnswer(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}

              <Text style={{ marginTop: 16, fontSize: 20 }}>
                Time remaining: <Text style={{ color: "red" }}>{timer}s</Text>
              </Text>
            </>
          )}
        </View>
      </Modal>
      <CustomAlert
        visible={customAlertVisible}
        message={alertMessage}
        onClose={() => setCustomAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20, alignItems: "center" },
  header: { fontSize: 24 },
  map: { flexDirection: "column", marginTop: 100 },
  row: { flexDirection: "row" },
  tile: {
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTile: {
    backgroundColor: "#fff", // Define what an empty tile looks like, you can set any background color or style
  },
  character: {}, // Character image dimensions will be dynamically set
  yellowStone: { backgroundColor: colors.primary.primary40 }, // Yellow stone style
  controls: { flexDirection: "column", alignItems: "center" },
  horizontalControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    marginTop: 10,
  },
  resetButtonContainer: {
    marginTop: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  }, // Style for Reset button
  modal: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
  },
  infoItem: {
    alignItems: "center",
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  verticalLine: {
    width: 2,
    height: 50,
    backgroundColor: "#DADADA",
    marginHorizontal: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#3DB2FF",
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  levelButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#3DB2FF", // Background color for the button
    borderRadius: 5,
    alignItems: "center", // Center text horizontally
  },
  levelText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  optionButton: {
    padding: 16,
    marginVertical: 5,
    backgroundColor: "#3DB2FF", // Background color for each option
    borderRadius: 5,
    alignItems: "center",
    width: "80%", // Option button width
    marginTop: 16,
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  customAlertContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  customAlertBox: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customAlertText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  customAlertButton: {
    padding: 10,
    backgroundColor: "#3DB2FF",
    borderRadius: 5,
  },
  customAlertButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  controller: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#3DB2FF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "black",
  }
});

export default TreasureHuntGame;
