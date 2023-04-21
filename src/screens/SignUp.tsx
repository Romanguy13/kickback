import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, TouchableOpacity } from 'react-native';

export default function Login({ navigation }: any) {
  // Functions to gather input
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserConfirmPassword, setNewUserConfirmPassword] = useState('');

  const handleNewUserNameChange = (text: string) => {
    setNewUserName(text);
  };
  const handleNewUserEmailChange = (text: string) => {
    setNewUserEmail(text);
  };
  const handleNewUserPasswordChange = (text: string) => {
    setNewUserPassword(text);
  };
  const handleNewUserPasswordConfirmChange = (text: string) => {
    setNewUserConfirmPassword(text);
  };

  const handleSignUp = () => {
    console.log(newUserName);
    console.log(newUserEmail);
    console.log(newUserPassword);
    console.log(newUserConfirmPassword);
    navigation.navigate('Welcome');
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>Create Account</Text>
        <Text style={styles.subText}>Welcome to KickBack!</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={newUserName}
          onChangeText={handleNewUserNameChange}
          aria-label="Name"
          keyboardType="default"
          placeholder="First Last"
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={newUserEmail}
          onChangeText={handleNewUserEmailChange}
          aria-label="Email"
          keyboardType="email-address"
          placeholder="kickback@email.com"
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={newUserPassword}
          onChangeText={handleNewUserPasswordChange}
          aria-label="Password"
          keyboardType="default"
          secureTextEntry={true}
          placeholder="mypassword123"
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={newUserConfirmPassword}
          onChangeText={handleNewUserPasswordConfirmChange}
          aria-label="Confirmed Password"
          keyboardType="default"
          secureTextEntry={true}
          placeholder="retype password"
          placeholderTextColor="gray"
        />
      </View>
      <View style={styles.inputButtonContainer}>
        <Pressable style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </View>
      <View style={styles.noAccountContainer}>
        <Text style={styles.noAccountText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.noAccountShortcut}>Login!</Text>
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
  },
  text: {
    color: '#FFFFFB',
    textAlign: 'left',
    fontSize: 50,
    fontWeight: 'bold',
  },
  subText: {
    color: '#FFFFFB',
    fontSize: 18,
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
    paddingTop: 40,
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
