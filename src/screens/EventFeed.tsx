import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, PixelRatio } from 'react-native';
import NavBar from './NavBar';

interface EventFeedProps {
  navigation: any; // Replace with the correct type for your navigation prop
}

export default function EventFeed({ navigation }: any) {
  // Boolean to decide if user has events or none in feed page
  const [hasEvents, setHasEvents] = useState(true);

  return hasEvents ? (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Let's start a KickBack!</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/hands.png')} style={styles.handsImage} />
      </View>
      <NavBar navigation={navigation} />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>User's KickBacks</Text>
      </View>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const fontScale = PixelRatio.getFontScale();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFB',
  },
  textContainer: {
    width: '100%',
    margin: 20,
    alignItems: 'center',
  },
  text: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.15) / fontScale),
    fontWeight: 'bold',
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: '100%',
    position: 'relative',
  },
  handsImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    transform: [{ rotate: '-.2deg' }],
  },
});
