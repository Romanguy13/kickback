import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';

function HistoryDetail({ route }: any) {
  const { event } = route.params;
  const paymentStatus = true
  return (
    <View style={styles.container}>
      <View style={styles.topContainer} />
      <View style={styles.bottomContainer}>
        <View style={styles.datetimeContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{event.date}</Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{event.time}</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statueText}> PASS </Text>
          </View>

          <View style={styles.voteContainer}>
            <Pressable style={styles.voteButton}>
              <Image source={require('../../../assets/history_button.png')} />
            </Pressable>
          </View>


          {paymentStatus ? (
            <View style={styles.paymentPaidContainer}>
              <Text style={styles.paymentText}> PAID </Text>
            </View>
          ) : (
            <View style={styles.paymentPayContainer}>
              <Text style={styles.paymentText}> PAY </Text>
            </View>
          )}


        </View>



        <View style={styles.locationpeopleContainer}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitleText}>{event.name}</Text>
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
    top: 100,
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
    top: 115,
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
    top: 140,
  },
  voteButton: {
    borderRadius: 100,
    borderWidth: 5,
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
  statusContainer: {
    left: 10,
    width: 90,
    justifyContent: 'center',
    top: 100,
    backgroundColor: '#FF7000',
    height: 30,
    borderRadius: 10,
  },
  statueText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  paymentPaidContainer: {
    left: 10,
    width: 90,
    justifyContent: 'center',
    top: 170,
    backgroundColor: '#00FF00',
    height: 30,
    borderRadius: 10,
  },
  paymentPayContainer: {
    left: 10,
    width: 90,
    justifyContent: 'center',
    top: 170,
    backgroundColor: '#FF0000',
    height: 30,
    borderRadius: 10,
  },
  paymentText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  }
});

export default HistoryDetail;
