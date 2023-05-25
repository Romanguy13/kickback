/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, PixelRatio, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
// import NavBar from '../NavBar';
import moment from 'moment';
import { FB_AUTH } from '../../../firebaseConfig';
import Events from '../../resources/api/events';
import { EventReturn } from '../../resources/schema/event.model';
import EventCard from '../../components/EventCard';

export default function EventFeed({ navigation }: any) {
  // Boolean to decide if user has events or none in feed page
  const [events, setEvents] = useState<EventReturn[]>([]); // [event1, event2, ...
  const [refresh, setRefresh] = useState<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await new Events().getAllByUserId(FB_AUTH.currentUser?.uid as string);
      console.log('Event List:', eventList);

      const filteredEvents = eventList.filter((event: EventReturn) => {
        const currentDate = moment();
        console.log('Current Date:', event.datetime);
        const eventDate = moment(event.datetime.toDate());
        return eventDate.isSameOrAfter(currentDate);
      });

      const sortedEvents = filteredEvents.sort((a: EventReturn, b: EventReturn) => {
        const aDate = moment(a.datetime.toDate());
        const bDate = moment(b.datetime.toDate());
        return aDate.isAfter(bDate) ? 1 : -1;
      });

      const sortByStatusEvents = sortedEvents.sort((a: EventReturn, b: EventReturn) => {
        const aStatus = a.inviteeStatus.find(
          (invitee: { id: string; status: boolean | null }) =>
            invitee.id === FB_AUTH.currentUser?.uid
        );
        const bStatus = b.inviteeStatus.find( 
          (invitee: { id: string; status: boolean | null }) =>
            invitee.id === FB_AUTH.currentUser?.uid
        );
        
        return aStatus?.status === bStatus?.status ? 0 : aStatus?.status ? -1 : 1;
      });

      setEvents(sortedEvents);
    };

    if (isFocused) {
      fetchData();
    }
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, isFocused]);

  return events.length === 0 ? (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.newText}>Let&apos;s start a KickBack!</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('../../../assets/hands.png')} style={styles.handsImage} />
      </View>
      {/* <NavBar navigation={navigation} /> */}
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.header}>KickBacks</Text>
      </View>
      <View style={styles.cardContainer}>
        <FlatList
          style={styles.cardList}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard event={item} navigation={navigation} />}
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
  textContainer: {
    width: '100%',
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.15) / fontScale),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  newText: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.15) / fontScale),
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    top: 20,
  },
  text: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.15) / fontScale),
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    bottom: -18,
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
    resizeMode: 'stretch',
    transform: [{ rotate: '2deg' }],
    top: 50,
    left: 5,
  },
  eventText: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.1) / fontScale),
    fontWeight: 'bold',
    width: '100%',
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardList: {
    width: '100%',
    height: '78%',
    alignSelf: 'center',
  },
});
