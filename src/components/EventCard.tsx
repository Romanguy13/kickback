import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';

function EventCard({ event, navigation }: any) {
  // accessibility labels
  const timeLabel = 'time of the event';
  const dateLabel = 'date';
  const titleLabel = 'title of event';
  const statusLabel = 'status';
  const locationLabel = 'location of event';

  const handlePress = () => {
    navigation.navigate('EventDetail', { event, canVote: true });
  };
  
  console.log('event', event);

  const checkStatus = (status: string) => {
    if (status == null) {
      return 'Pending';
    } else {
      return 'Going';
    }
  };



  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View>
          <View style={styles.headingContainer}>
            <Text style={[styles.heading]} accessibilityLabel={titleLabel}>
              {event.name}
            </Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.datetext} accessibilityLabel={dateLabel}>
              {event.date}
            </Text>
            <Text style={[styles.timetext]} accessibilityLabel={timeLabel}>
              {event.time}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Text accessibilityLabel={statusLabel} style={styles.statusLabel}>
              {checkStatus(event.status)}
            </Text>
          </View>
          <Text style={styles.locationtext} accessibilityLabel={locationLabel}>
            {event.location}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    position: 'absolute',
    width: 322,
    height: 44,
    backgroundColor: '#ff7000',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  heading: {
    fontSize: 20,
    paddingTop: 10,
    fontWeight: '700',
    textAlign: 'center',
    color: '#272222',
  },
  labelbox: {
    position: 'absolute',
    width: 323,
    height: 44,
    left: 34,
    top: 429,
    background: 'grey',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  datetext: {
    position: 'absolute',
    paddingTop: 10,
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 25,
    textAlign: 'center',
    color: '#FFFDF8',
  },
  dateTimeContainer: {
    backgroundColor: '#272222',
    borderBottomLeftRadius: 18,
    height: 133,
    width: 128,
    bottom: -43,
    alignItems: 'center',
  },
  timetext: {
    position: 'absolute',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 72,
    paddingTop: 42,
    textAlign: 'center',
    color: '#FFFDF8',
  },
  locationtext: {
    position: 'absolute',
    top: 60,
    left: 60,
    width: 250,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 70,
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
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statusContainer: {
    position: 'absolute',
    width: 84,
    height: 21.66,
    bottom: -33,
    left: 20,
    borderRadius: 25,
    backgroundColor: '#ff6800',
  },
  statusLabel:{
    position: 'absolute',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 25,
    textAlign: 'center',
    color: '#FFFDF8',
    right: 13,
    top: -1
  }
});

export default EventCard;
