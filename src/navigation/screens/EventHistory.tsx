import { StyleSheet, Text, View, Dimensions, PixelRatio, FlatList, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
// import NavBar from '../NavBar';
import { useIsFocused } from '@react-navigation/native';
import { FB_AUTH } from '../../../firebaseConfig';
import Events from '../../resources/api/events';

import HistoryCard from './HistoryCard';
import { EventReturn } from '../../resources/schema/event.model';

const monthMapping: Record<string, string> = {
  "January": "01",
  "February": "02",
  "March": "03",
  "April": "04",
  "May": "05",
  "June": "06",
  "July": "07",
  "August": "08",
  'September': "09",
  'October': "10",
  "November": "11",
  "December": "12",
};

export default function EventHistory({ navigation }: any) {
  // Gather all the events
  const [events, setEvents] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await new Events().getAll(FB_AUTH.currentUser?.uid as string);

      // Filter through the events and only show the ones that have already passed
      //Filter Function is lines 44 to 56 
      const filteredEvents = eventList.filter((event: EventReturn) => {
        const dateArr = event.date.split(' ');
        const month = monthMapping[dateArr[0]];
        const day = parseInt(dateArr[1].slice(0, -1)) + 1;
        const year = dateArr[2];
        const timeArr = event.time.split(':');
        const partOfDay = timeArr[1].slice(-2);
        const hour = partOfDay === 'PM' ? parseInt(timeArr[0], 10) + 12 : parseInt(timeArr[0], 10);
        const minute = parseInt(timeArr[1].slice(0, -2), 10);

        const eventDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00-7:00`);
        const currentDate = new Date();
    
        return eventDate < currentDate;
      });

      setEvents(filteredEvents);
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
      <Button title="Refresh" onPress={() => setRefresh(true)} />
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
    //backgroundColor: '#FFFFFB',
    backgroundColor: '#FFFFFB',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
