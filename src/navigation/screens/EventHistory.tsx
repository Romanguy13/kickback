import { StyleSheet, Text, View, Dimensions, PixelRatio } from 'react-native';
import React, { useEffect, useState } from 'react';
// import NavBar from '../NavBar';
import { FB_AUTH } from '../../../firebaseConfig';
import Events from '../../resources/api/events';

import HistoryCard from './HistoryCard';

interface EventHistoryProps {
  navigation: any;
}

export default function EventHistory({ navigation }: any) {
  // Gather all the events
  const [events, setEvents] = useState<any[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await new Events().getAll(FB_AUTH.currentUser?.uid as string);
      setEvents(eventList);
    };

    fetchData();
    setRefresh(false);
    console.log(events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  // What to showcase on the screen
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Previous {'\n'}KickBacks </Text>

        {events.map((event) => (
          <View key={event.id}>
            <HistoryCard eventName={event.name} eventLocation={event.location} eventId={event.id} />
          </View>
        ))}
      </View>
      {/* <NavBar navigation={navigation} /> */}
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
  },
});
