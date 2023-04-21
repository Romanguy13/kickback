import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, TouchableOpacity } from 'react-native';

export default function Login({ navigation }: any) {
  // Functions to gather input
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleUserEmailChange = (text: string) => {
    setUserEmail(text);
  };

  const handleUserPasswordChange = (text: string) => {
    setUserPassword(text);
  };

  const handleContinue = () => {
    console.log(userEmail);
    console.log(userPassword);
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>Login</Text>
        <Text style={styles.subText}>Please sign in to your account.</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userEmail}
          onChangeText={handleUserEmailChange}
          aria-label="Email"
          keyboardType="email-address"
          placeholder="kickback@email.com"
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={userPassword}
          onChangeText={handleUserPasswordChange}
          aria-label="Password"
          keyboardType="default"
          secureTextEntry={true}
          placeholder="mypassword123"
          placeholderTextColor="gray"
        />
      </View>
      <View style={styles.inputButtonContainer}>
        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
      <View style={styles.noAccountContainer}>
        <Text style={styles.noAccountText}>Dont have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.noAccountShortcut}>Sign Up!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7000',
    justifyContent: 'center',
  },
  titleContainer: {
    margin: 20,
    paddingBottom: 20,
  },
  text: {
    color: '#FFFFFB',
    textAlign: 'left',
    fontSize: 60,
    fontWeight: 'bold',
  },
  subText: {
    color: '#FFFFFB',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    justifyContent: 'flex-start',
    padding: 20,
    width: '100%',
    paddingBottom: 100,
  },
  label: {
    fontSize: 22,
    textAlign: 'left',
    paddingTop: 20,
    color: '#FFFFFB',
  },
  input: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#272222',
    padding: 10,
    color: 'white',
    fontSize: 16,
  },
  inputButtonContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },
  button: {
    width: 300,
    borderRadius: 50,
    backgroundColor: '#272222',
    padding: 10,
    margin: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFB',
    fontSize: 20,
    margin: 5,
    fontWeight: 'bold',
  },
  noAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  noAccountText: {
    color: '#FFFFFB',
    fontSize: 15,
    fontWeight: 'bold',
  },
  noAccountShortcut: {
    color: '#272222',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
