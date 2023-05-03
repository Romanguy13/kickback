/* eslint-disable global-require */
import React from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';

interface NavBarProps {
  navigation: any;
  navigation: any;
}
export default function NavBar({ navigation }: NavBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.Button}
          onPress={() => navigation.navigate('EventGroups')}
          accessibilityLabel="Groups"
        >
          <Image source={require('../../assets/groups_button.png')} style={styles.groupsImage} />
        </Pressable>
        <Pressable
          style={styles.Button}
          onPress={() => navigation.navigate('EventCreation')}
          accessibilityLabel="Create Event"
        >
          <Image source={require('../../assets/add_event_button.png')} style={styles.buttonImage} />
        </Pressable>
        <Pressable
          style={styles.Button}
          onPress={() => navigation.navigate('EventFeed')}
          accessibilityLabel="Feed"
        >
          <Image
            source={require('../../assets/event_feed_button.png')}
            style={styles.buttonImage}
          />
        </Pressable>
        <Pressable
          style={styles.Button}
          onPress={() => navigation.navigate('EventHistory')}
          accessibilityLabel="History"
        >
          <Image source={require('../../assets/history_button.png')} style={styles.buttonImage} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#272222',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
  },
  format: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  Button: {
    flex: 1,
    width: '100%',
    height: 80,
    alignItems: 'center',
    borderRadius: 20,
  },
  groupsImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});