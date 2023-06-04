import { StyleSheet, Text, View, Dimensions, PixelRatio, FlatList, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ImagePicker from 'expo-image-picker';
import { FB_AUTH } from '../../../firebaseConfig';
import Events from '../../resources/api/events';

import HistoryCard from '../../components/HistoryCard';
import { EventReturn } from '../../resources/schema/event.model';

export default function EventHistory({ navigation }: any) {
  // Gather all the events
  const [events, setEvents] = useState<EventReturn[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const [showModal, setShowModal] = useState<boolean>(false)
  const [receipt, setReceipt] = useState<string>(" ")

  const handleUpload = async () => {
    try {
      // Request permission to access the device's photo library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied to access photo library');
        return;
      }

      const data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!data.canceled) {
        console.log(data);
      } else {
        alert('You did not select any image.');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await new Events().getAllByUserId(FB_AUTH.currentUser?.uid as string);

      // Filter through the events and only show the ones that have already passed
      // Filter Function is lines 44 to 56
      const filteredEvents = eventList.filter((event: EventReturn) => {
        // Get today's date
        const currentDate = moment();
        console.log('currentDate', event.datetime.toDate());
        const eventDate = moment(event.datetime.toDate());

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
  //<Button title="upload image" onPress={handleUpload} />
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.header}>Previous {'\n'}KickBacks </Text>
      </View>
      <View style={styles.cardContainer}>
        <FlatList
          style={styles.cardList}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard event={item} setShowModal={setShowModal} setReceipt={setReceipt} navigation={navigation} />}
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
