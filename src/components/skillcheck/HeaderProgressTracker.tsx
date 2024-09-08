import {View, Text, StyleSheet, StatusBar as RNStatusBar} from 'react-native'
import React from 'react'
import BackButton from "@/src/components/BackButton";

const HeaderProgressTracker = ({ current, all }: { current: number, all: number }) => {
  return (
    <View style={styles.container}>
        {[...Array(all)].map((_, index) => (
          <View
            key={index}
            style={index < current ? styles.pillActive : styles.pillInactive}
          />
        ))}
    </View>
  )
}

export default HeaderProgressTracker

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pillActive: {
    width: 30,
    height: 8,
    backgroundColor: '#3DB2FF',
    borderRadius: 6,
    marginHorizontal: 2
  },
  pillInactive: {
    width: 30,
    height: 8,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 2,
    borderRadius: 6,
  },
})