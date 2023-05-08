import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FB_AUTH } from '../../../firebaseConfig';
import { UserModel } from '../../resources/schema/user.model';
import Users from '../../resources/api/users';

export default function SignUp({ navigation }: any) {
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
    if (
      newUserName === '' ||
      newUserEmail === '' ||
      newUserPassword === '' ||
      newUserConfirmPassword === ''
    ) {
      Alert.alert('Please fill in all fields.');
      return;
    }
    if (newUserPassword !== newUserConfirmPassword) {
      Alert.alert('Passwords do not match.');
    } else {
      createUserWithEmailAndPassword(FB_AUTH, newUserEmail, newUserPassword)
        .then(async (userCredential) => {
          const { user } = userCredential;
          console.log(user);
          const newUser: UserModel = {
            name: newUserName,
            email: newUserEmail.toLowerCase(),
          };
          const newUserClass = new Users();
          const id = await newUserClass.create(newUser, { overrideId: user.uid });
          console.log(id);
          navigation.navigate('TabBar');
        })
        .catch((error) => {
          console.log(error.code, error.message);
          Alert.alert(error.message);
        });
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.titleContainer} behavior="padding">
        <Text style={styles.text}>Create Account</Text>
        <Text style={styles.subText}>Welcome to KickBack!</Text>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={newUserName}
          onChangeText={handleNewUserNameChange}
          aria-label="Name"
          keyboardType="default"
          placeholder="First Last"
          placeholderTextColor="gray"
          autoCapitalize="none"
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
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={newUserPassword}
          onChangeText={handleNewUserPasswordChange}
          aria-label="Password"
          // keyboardType="default"
          textContentType="password"
          secureTextEntry
          placeholder="mypassword123"
          placeholderTextColor="gray"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={newUserConfirmPassword}
          onChangeText={handleNewUserPasswordConfirmChange}
          aria-label="Confirmed Password"
          // keyboardType="default"
          textContentType="password"
          secureTextEntry
          placeholder="retype password"
          placeholderTextColor="gray"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.inputButtonContainer} behavior="padding">
        <Pressable style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.noAccountContainer} behavior="padding">
        <Text style={styles.noAccountText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.noAccountShortcut}>Login!</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const fontScale = PixelRatio.getFontScale();
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
    fontSize: Math.round((windowWidth * 0.12) / fontScale),
    fontWeight: 'bold',
  },
  subText: {
    color: '#FFFFFB',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    justifyContent: 'flex-start',
    margin: 20,
  },
  label: {
    fontSize: 22,
    textAlign: 'left',
    color: '#FFFFFB',
    paddingTop: 20,
  },
  input: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#272222',
    borderRadius: 10,
    backgroundColor: 'white',
    color: '#272222',
    padding: 10,
    fontSize: 16,
  },
  inputButtonContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    position: 'relative',
    paddingTop: 40,
  },
  button: {
    width: 300,
    borderRadius: 50,
    backgroundColor: '#272222',
    padding: 10,
    margin: 10,
    alignSelf: 'center',
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
    paddingTop: 30,
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
