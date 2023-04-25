//import {StyleSheet, Text, View } from "react-native"
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface NavBarProps {
  navigation: any; // Replace with the correct type for your navigation prop
}
export default function NavBar({ navigation }: NavBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bottonContainer}>
        <Pressable style={styles.Button} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.format}> Group </Text>
        </Pressable>
        <Pressable style={styles.Button} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.format}> Create </Text>
        </Pressable>
        <Pressable style={styles.Button} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.format}> History </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#272222',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
  },
  bottonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 10,
  },
  format: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  Button: {
    flex: 1,
    maxWidth: 100,
    height: 75,
    borderRadius: 50,
    borderColor: 'blue',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  Icons: {
    width: 150,
    height: 50,
  },
});
