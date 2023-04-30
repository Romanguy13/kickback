//import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, PixelRatio, Image } from 'react-native';
import NavBar from './NavBar';
import { FB_AUTH } from '../../firebaseConfig';
import Events from '../resources/api/events';
import React, { useEffect, useState } from 'react';

import HistoryCard from './HistoryCard';

interface EventHistoryProps {
  navigation: any;
}

export default function EventHistory({ navigation }: any) 
{
  //gather all the events 
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => 
  {
    const eventClass = new Events();
    eventClass.getAll().then((eventList: any[]) => {
      const eventArray: any[] = [];
      eventList.forEach((event) => 
      {
        //here would be a if statement to check if the event date is passed 
        //but for now just show case everything 
        if (event.invitedUsers.includes(FB_AUTH.currentUser?.email)) {
          eventArray.push(event);
        } else if (event.hostEmail === FB_AUTH.currentUser?.email) {
          eventArray.push(event);
        }
      });
      setEvents(eventArray);
      console.log(events);
    });
  },[]);
  //what to showcase on the screen
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Previous {'\n'}KickBacks </Text>

         {events.map((event) => 
          (
            <View key={event.id}> 
            <HistoryCard eventName={event.name} eventLocation={event.location} eventId={event.id} />
            </View>
          ))}
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
  imageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingTop: 70,
    width: '100%',
    position: 'relative',
  },
  eventText: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.1) / fontScale),
    fontWeight: 'bold',
    width: '100%',
  },
  handsImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    transform: [{ rotate: '-.2deg' }],
  }
});
