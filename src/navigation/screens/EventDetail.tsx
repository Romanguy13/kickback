import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function EventDetail({ route }: any) {
  const { event } = route.params;
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.titleText}>{event.name}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.datetimeContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{event.date}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{event.time}</Text>
          </View>
          <View style={styles.voteContainer}>
            <Pressable style={styles.voteButton}>
              <Text>+</Text>
            </Pressable>
            <Pressable style={styles.voteButton}>
              <Text>+</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.locationpeopleContainer}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitleText}>{event.location}</Text>
          </View>
          <View style={styles.usersContainer}>
            <Text style={styles.usersText}>{event.user}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFB',
  },
  topContainer: {
    backgroundColor: '#FF7000',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: '16%',
    paddingTop: 0,
    paddingBottom: 0,
  },
  titleText: {
    color: '#FFFFFB',
    fontSize: 60,
    fontWeight: 'bold',
    paddingTop: 20,
    width: '100%',
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  datetimeContainer: {
    backgroundColor: '#272222',
    width: '30%',
    flexDirection: 'column',
  },
  dateContainer: {
    width: '100%',
    justifyContent: 'center',
    top: 120,
  },
  dateText: {
    color: '#FFFFFB',
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 20,
    width: '100%',
    textAlign: 'center',
  },
  timeContainer: {
    width: '100%',
    justifyContent: 'center',
    top: 130,
  },
  timeText: {
    color: '#FFFFFB',
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 20,
    width: '100%',
    textAlign: 'center',
  },
  voteContainer: {
    width: '100%',
    justifyContent: 'center',
    top: 220,
  },
  voteButton: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFFFFB',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 40,
  },
  locationpeopleContainer: {
    backgroundColor: '#FFFFFB',
    width: '70%',
    flexDirection: 'column',
  },
  locationContainer: {
    width: '100%',
    top: 90,
    alignItems: 'center',
  },
  locationTitleText: {
    color: '#272222',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 20,
  },
  locationText: {
    color: '#272222',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 40,
  },
  usersContainer: {
    backgroundColor: '#272222',
    width: '70%',
    height: '30%',
    alignSelf: 'center',
    top: 150,
    borderRadius: 20,
  },
  usersText: {
    color: '#FFFFFB',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 20,
  },
});

export default EventDetail;
