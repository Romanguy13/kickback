import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import NavBar from './NavBar';

interface EventHistoryProps {
  navigation: any;
}

export default function EventHistory({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>History</Text>
      </View>
      <NavBar navigation={navigation} />
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
});
