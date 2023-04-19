import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Template() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
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
});
