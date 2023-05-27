import { StyleSheet, Text, View, Dimensions, PixelRatio, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { FB_AUTH } from '../../../firebaseConfig';
import Events from '../../resources/api/events';

import HistoryCard from './HistoryCard';
import { EventReturn } from '../../resources/schema/event.model';

export default function EventHistory({ navigation }: any) {
  // Gather all the events
  const [events, setEvents] = useState<EventReturn[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('isFocused', isFocused);
    const fetchData = async () => {
      const eventList = await new Events().getAllByUserId(FB_AUTH.currentUser?.uid as string);
      console.log(eventList);

      // Filter through the events and only show the ones that have already passed
      // Filter Function is lines 44 to 56
      const filteredEvents = eventList.filter((event: EventReturn) => {
        // Get today's date
        const currentDate = moment();
        const eventDate = moment(event.date, 'MMMM DD, YYYY');

        return true
        //return eventDate.isBefore(currentDate);
      });
      setEvents(filteredEvents);
      console.log(filteredEvents);
    };

    if (isFocused) {
      fetchData();
    }
    setRefresh(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, isFocused]);

  // What to showcase on the screen
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Previous {'\n'}KickBacks </Text>
      </View>
      <View style={styles.cardContainer}>
        <FlatList
          style={styles.cardList}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard event={item} navigation={navigation} />}
        />
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
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  cardList: {
    width: '100%',
    height: '78%',
    paddingLeft: 50,
    paddingRight: 50,
  },
});
