import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';

interface CloudHeaderProps {
    title: string;
}

const CloudHeader: React.FC<CloudHeaderProps> = ({ title }) => {
  const router = useRouter()

  return (
    <LinearGradient
      colors={['#3DB2FF', '#61B0E3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={20} color="#0693F1" />
      </TouchableOpacity>
      <View style={{marginLeft: 12, width: '60%'}}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Image source={require('@/assets/images/cloud.png')} style={styles.cloud}/>
    </LinearGradient>

  )
}

export default CloudHeader

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'red',
    height: 87,
  },
  backButton: {
    width: 40,
    height: 40,
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  cloud: {
    width: 110,
    resizeMode: 'contain',
  },
})