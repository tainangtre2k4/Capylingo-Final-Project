import React from 'react'
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from 'react-native-elements'

type Props = {}

const Header = (props: Props) => {
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=ma" }}
            style={styles.userImg}
          />
          <View style = {{gap: 3}}>
            <Text style = {styles.welcomeTxt}>Welcome</Text>
            <Text style = {styles.userName}>John Doe!</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="notifications-outline" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>
    );
  };

export default Header
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    userImg: {
        width: 50,
        height: 50,
        borderRadius: 30
    },
    userInfo:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    welcomeTxt:{
        fontSize: 12,
        color: colors.grey0
    },
    userName:{
        fontSize: 14,
        fontWeight: '700',
        color: colors.black
    }
})