import { Button, TextInput, View, StyleSheet,Text, Alert,TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useEffect, useState } from 'react';
import colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import {useNavigation, router} from 'expo-router'
import React from 'react';

const Register = () => {
  const navigation = useNavigation();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: emailAddress,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  useEffect(() => {
    navigation.setOptions({
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitle:'Register',
        headerTransparent:true,
    });
}, [navigation]);

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

          <View>
            <Text style={styles.title}>Enter Your Email</Text>
            <TextInput autoCapitalize="none" placeholder="yourgmail@gmail.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
          </View>
          <View>
            <Text style={styles.title}>Enter Your Password</Text>
            <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
          </View>

          <TouchableOpacity style={styles.button} onPress={signUpWithEmail}>   
             <Text style={{color:colors.base.black0}}>Sign up</Text>      
          </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputField: {
    marginVertical: 6,
    height: 58,
    borderWidth: 1,
    borderColor: colors.primary.primary100,
    borderRadius: 40,
    padding: 16,
    backgroundColor: colors.base.black0,
  },
  button: {
    marginVertical: 10,
    height: 58,
    borderRadius: 40,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:colors.primary.primary80
  },
  title:{
    color:colors.primary.primary100,
    fontSize: 16,
  },
  header:{
    alignItems:'center',
    marginVertical: 16,
  },
});

export default Register;