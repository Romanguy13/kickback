import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';

function EventCard({ event, navigation }: any) {
  // accessibility labels
  let timeLabel = 'time of the event';
  let dateLabel = 'date';
  let titleLabel = 'title of event';
  let statusLabel = 'status';
  let locationLabel = 'location of event';

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('EventDetail', { event: event })}
      >
        <View>
          <View style={styles.headingContainer}>
            <Text style={[styles.heading]} accessibilityLabel={titleLabel}>
              {' '}
              {event.name}{' '}
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
            <Text accessibilityLabel={statusLabel}>{event.status}</Text>
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
    paddingTop: 20,
    fontWeight: '700',
    fontSize: 30,
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
    //right: 100,
    fontWeight: '700',
    fontSize: 25,
    lineHeight: 25,
    paddingTop: 52,
    textAlign: 'center',
    color: '#FFFDF8',
  },
  locationtext: {
    position: 'absolute',
    top: 80,
    left: 70,
    fontWeight: '700',
    fontSize: 20,
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
    borderRadius: 25,
    backgroundColor: '#ff7000',
  },
});

export default EventCard;
