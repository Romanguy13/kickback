import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function Welcome({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to KickBack</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#654321',
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#654321',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
