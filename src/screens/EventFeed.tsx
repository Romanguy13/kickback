import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';

export default function EventFeed({ navigation }: any) {
  // Boolean to decide if user has events or none in feed page
  const [hasEvents, setHasEvents] = useState(true);

  return (
    <View style={styles.container}>
      {hasEvents ? (
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Let's start a KickBack!</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={require('../../assets/hands.png')} style={styles.handsImage} />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>User's KickBacks</Text>
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFB',
    justifyContent: 'center',
  },
  textContainer: {
    width: '100%',
    margin: 20,
  },
  text: {
    color: '#272222',
    fontSize: 66,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: '100%',
  },
  handsImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    transform: [{ rotate: '-.2deg' }],
  },
});
