import { Text, TouchableOpacity, View, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
const { width } = Dimensions.get('window');

export default function Header({ backHandler, title, search = true, create = false, navigateHandler = () => {} }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={backHandler} style={styles.backButton}>
          <Image
            source={require('@/assets/images/Vector.png')}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {search && (
          <TouchableOpacity
            style={styles.iconButton}
          >
          </TouchableOpacity>
        )}

        {create && (
          <TouchableOpacity
            onPress={navigateHandler}
            style={styles.iconButton}>
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#3DB2FF',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.03, // Reduced padding
    backgroundColor: '#3DB2FF',
    height: 28,
  },
  backButton: {
    height: width * 0.08, // Reduced size
    width: width * 0.08, // Reduced size
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Slightly smaller radius
    position: 'absolute',
    left: width * 0.03, // Align with the reduced padding
  },
  backButtonImage: {
    height: width * 0.04, // Reduced size
    width: width * 0.025, // Reduced size
  },
  title: {
    fontSize: width * 0.06, // Reduced font size
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  iconButton: {
    height: width * 0.08, // Reduced size
    width: width * 0.08, // Reduced size
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (width * 0.08) / 2, // Adjusted for new size
    backgroundColor: 'white',
    position: 'absolute',
    right: width * 0.03, // Align with the reduced padding
  },
});
