import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio,
  FlatList,
  Pressable,
  Modal,
  Button,
} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NativeBaseProvider, Radio } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FB_AUTH } from '../../../firebaseConfig';
import Events from '../../resources/api/events';

import HistoryCard from '../../components/HistoryCard';
import { EventReturn } from '../../resources/schema/event.model';

export default function EventHistory({ navigation }: any) {
  // Gather all the events
  const [events, setEvents] = useState<EventReturn[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const isFocused = useIsFocused();

  // TO MOVE LATER
  const [fromDate, setFromDate] = useState(moment().toDate());
  const [toDate, setToDate] = useState(moment().toDate());
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState<boolean>(false);
  const [toDatePickerVisible, setToDatePickerVisible] = useState<boolean>(false);

  const handleFilter = () => {
    // onFilter(fromDate, toDate);
  };

  const handleReset = () => {
    setFromDate(moment().toDate());
    setToDate(moment().toDate());
    // onFilter('', '');
  };

  // Get the current month and year
  const getCurrentMonthYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month starts from 0
    return `${year}-${month}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await new Events().getAllByUserId(FB_AUTH.currentUser?.uid as string);

      // Filter through the events and only show the ones that have already passed
      // Filter Function is lines 44 to 56
      const filteredEvents = eventList.filter((event: EventReturn) => {
        // Get today's date
        const currentDate = moment();
        const eventDate = moment(event.datetime.toDate());

        return eventDate.isBefore(currentDate);
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
      <View style={styles.textContainer}>
        <Text style={styles.header}>Previous {'\n'}KickBacks </Text>
      </View>
      <Pressable style={styles.filterContainer} onPress={() => setShowModal(true)}>
        <Text style={styles.smallText}>Filter</Text>
        <Ionicons name="filter-outline" size={50} color="#272222" />
      </Pressable>
      <View style={styles.cardContainer}>
        <FlatList
          style={styles.cardList}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard event={item} navigation={navigation} />}
        />
      </View>
      <Modal animationType="slide" transparent visible={showModal}>
        <View style={styles.modalOuterContainer}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.smallText}>Filter</Text>
              <Ionicons name="close-outline" size={35} onPress={() => setShowModal(false)} />
            </View>
            <View style={styles.modalBody}>
              <View style={styles.modalOptionContainer}>
                <Text>Paid Status</Text>
                <NativeBaseProvider>
                  <Radio.Group name="paidStatus" defaultValue="all">
                    <Radio value="all">All</Radio>
                    <Radio value="paid">Paid</Radio>
                    <Radio value="unpaid">Unpaid</Radio>
                  </Radio.Group>
                </NativeBaseProvider>
              </View>
              <View style={styles.modalOptionContainer}>
                <Text>Date</Text>
                <DateTimePickerModal
                  style={{ width: 200 }}
                  date={fromDate}
                  mode="date"
                  onConfirm={(date) => setFromDate(date)}
                  onCancel={() => setFromDate(moment().toDate())}
                />
                <Text>To:</Text>
                <Pressable onPress={() => setToDatePickerVisible(true)}>
                  <Text>{moment(toDate).format('MM DD YYYY')}</Text>
                </Pressable>
                {toDatePickerVisible && (
                  <DateTimePickerModal
                    isVisible={toDatePickerVisible}
                    style={{ width: 200 }}
                    date={toDate || getCurrentMonthYear()}
                    mode="date"
                    onConfirm={(date) => {
                      setToDate(date);
                      setToDatePickerVisible(false);
                    }}
                    onCancel={() => setToDatePickerVisible(false)}
                  />
                )}
                <Button title="Filter" onPress={handleFilter} />
                <Button title="Reset" onPress={handleReset} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    position: 'relative',
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: 55,
  },
  smallText: {
    fontSize: 22,
  },
  modalOuterContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInnerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFB',
    width: '80%',
    marginTop: 100,
    minWidth: 300,
    marginBottom: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  modalHeader: {
    backgroundColor: '#FFFFFB',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBody: {
    marginTop: 20,
  },
  modalOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
});
