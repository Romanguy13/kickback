import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, PixelRatio, FlatList } from 'react-native';
import NavBar from './NavBar';
import { FB_AUTH } from '../../firebaseConfig';
import Events from '../resources/api/events';
import EventCard from './EventCard';

export default function EventFeed({ navigation }: any) {
  // Boolean to decide if user has events or none in feed page
  const [events, setEvents] = useState<any[]>([]); // [event1, event2, ...

  useEffect(() => {
    const eventClass = new Events();
    eventClass.getAll().then((eventList: any[]) => {
      const eventArray: any[] = [];
      eventList.forEach((event) => {
        if (event.invitedUsers.includes(FB_AUTH.currentUser?.email)) {
          eventArray.push(event);
        } else if (event.hostEmail === FB_AUTH.currentUser?.email) {
          eventArray.push(event);
        }
      });
      setEvents(eventArray);
      console.log(events);
    });
  });

  return events.length === 0 ? (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Let&apos;s start a KickBack!</Text>
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
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <EventCard event={item} navigation={navigation} />
          )}
        />  
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
    backgroundColor: '#FFFFFB',
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
  imageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingTop: 70,
    width: '100%',
    position: 'relative',
  },
  handsImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    transform: [{ rotate: '-.2deg' }],
  },
  eventText: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.1) / fontScale),
    fontWeight: 'bold',
    width: '100%',
  },
});
