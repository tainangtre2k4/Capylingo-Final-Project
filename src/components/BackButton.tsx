import { TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { useRouter } from 'expo-router'

interface BackButtonProps {
  iconColor?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ iconColor }) => {
  const router = useRouter()

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={20} color={iconColor || "#0693F1"} />
    </TouchableOpacity>
)
}

export default BackButton

const styles = StyleSheet.create({
  backButton: {
    padding: 9,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
  },
})
