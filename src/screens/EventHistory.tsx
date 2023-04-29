import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, PixelRatio } from 'react-native';
import NavBar from './NavBar';

interface EventHistoryProps {
  navigation: any;
}

export default function EventHistory({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Previous {'\n'}KickBacks </Text>
      </View>
      <NavBar navigation={navigation} />
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const fontScale = PixelRatio.getFontScale();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7000',
  },
  textContainer: {
    width: '100%',
    paddingTop: 20,
    margin: 20,
    alignItems: 'center',
  },
  text: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.15) / fontScale),
    fontWeight: 'bold',
    width: '100%',
  },
});
