/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
<<<<<<< HEAD:src/screens/EventFeed.tsx
import { StyleSheet, Text, View, Image, Dimensions, PixelRatio, FlatList, Button } from 'react-native';
import NavBar from './NavBar';
import { FB_AUTH } from '../../firebaseConfig';
import Events from '../resources/api/events';
import EventCard from './EventCard';import { EventReturn } from '../resources/schema/event.model';
=======
import { StyleSheet, Text, View, Image, Dimensions, PixelRatio, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
// import NavBar from '../NavBar';
import { FB_AUTH } from '../../../firebaseConfig';
import Events from '../../resources/api/events';
import { EventReturn } from '../../resources/schema/event.model';
>>>>>>> main:src/navigation/screens/EventFeed.tsx

export default function EventFeed({ navigation }: any) {
  // Boolean to decide if user has events or none in feed page
  const [events, setEvents] = useState<EventReturn[]>([]); // [event1, event2, ...
  const [refresh, setRefresh] = useState<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await new Events().getAll(FB_AUTH.currentUser?.uid as string);
      console.log('Event List:', eventList);
      setEvents(eventList);
    };

    if (isFocused) {
      fetchData();
    }
    setRefresh(false);
    console.log(events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, isFocused]);

  return events.length === 0 ? (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Let&apos;s start a KickBack!</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('../../../assets/hands.png')} style={styles.handsImage} />
      </View>
      {/* <NavBar navigation={navigation} /> */}
    </View>
  ) : (
    <View style={styles.container}>
<<<<<<< HEAD:src/screens/EventFeed.tsx
      <Button title="Refresh" onPress={() => setRefresh(true)} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>User's KickBacks</Text>
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <EventCard event={item} navigation={navigation} />
          )}
        />  
=======
      {/* <Button title="Refresh" onPress={() => setRefresh(true)} /> */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>KickBacks</Text>
>>>>>>> main:src/navigation/screens/EventFeed.tsx
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.textContainer}>
          {events.map((event) => (
            <Text style={styles.eventText} key={event.id}>
              {event.name}
            </Text>
          ))}
        </View>
        {/* <NavBar navigation={navigation} /> */}
      </ScrollView>
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
  header: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.15) / fontScale),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 40,
  },
  headerContainer: {
    borderBottomColor: '#272222',
    borderBottomWidth: 2,
    paddingBottom: 20,
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
    textAlign: 'center',
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
