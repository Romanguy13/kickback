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
  container: 
  {
    flex: 1,
    backgroundColor: '#FF7000',
  },
  textContainer: 
  {
    width: '100%',
    margin: 20,
    alignItems: 'center',
    top: 0
  },
  text: 
  {
    position: 'absolute',
    color: '#272222',
    fontSize: 70,
    fontWeight: 'bold',
    //padding: 10,
    width: '100%',
  },
});
