import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';


interface NavBarProps {
  navigation: any;
}

function EventCard({ event, navigation }: any) {
  // accessibility labels
  let timeLabel = 'time of the event';
  let dateLabel = 'date';
  let titleLabel = 'title of event';
  let statusLabel = 'status';
  let locationLabel = 'location of event';

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Event Detail', { event })}>
        <View>
          <Text style={[styles.heading]} accessibilityLabel={titleLabel}> {event.name} </Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.datetext}accessibilityLabel={dateLabel}>{event.date}</Text>
            <Text style={[styles.timetext]} accessibilityLabel={timeLabel}>{event.time}</Text>
          </View>
          <Text accessibilityLabel={statusLabel}>{event.status}</Text>
          <Text style={styles.locationtext} accessibilityLabel={locationLabel}>{event.location}</Text>
        </View> 
      </TouchableWithoutFeedback>
    </View>
  );
}


const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    lineHeight: 125,
    textAlign: "center",
    top: -30
  },
  rectangle_wrapper: {
    height: 50,
    width: 200,
    position: 'relative'
  },
  labelbox:{
    position: 'absolute',
    width: 323,
    height: 44,
    left: 34,
    top: 429,
    background: 'grey',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  datetext: {
    position: "absolute",
    paddingTop: 20,
    fontWeight: "700",
    fontSize: 30,
    lineHeight: 25,
    textAlign: 'center',
    color: '#FFFDF8'
  },
  dateTimeContainer: {
    backgroundColor: '#272222',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    height: 130,
    width: 125,
    bottom: 89,
    alignItems: 'center'
  },
  timetext: {
    position: "absolute",
    //right: 100,
    fontWeight: "700",
    fontSize: 25,
    lineHeight: 25,
    paddingTop: 52,
    textAlign: 'center',
    color: '#FFFDF8'
  },
  locationtext: {
    position: "absolute",
    top: 80,
    left: 70,
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 25,
    textAlign: 'right'
  },
  card: {
    backgroundColor: '#FFFDF8',
    borderRadius: 18,
    width: 322, 
    height: 176,
    marginVertical: 10,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  
});

export default EventCard;
