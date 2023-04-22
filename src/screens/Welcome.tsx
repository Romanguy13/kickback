import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function Welcome({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>KickBack</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('NavBar')}>
          <Text style={styles.buttonText}>Nav Bar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    padding: 30,
  },
  text: {
    color: '#FFFFFB',
    fontSize: 70,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  button: {
    width: 300,
    borderRadius: 50,
    backgroundColor: '#272222',
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFB',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
