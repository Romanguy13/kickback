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
          <Text style={styles.heading} accessibilityLabel={titleLabel}>
            {event.name}
          </Text>
          <Text accessibilityLabel={dateLabel}>{event.date}</Text>
          <Text accessibilityLabel={timeLabel}>{event.time}</Text>
          <Text accessibilityLabel={statusLabel}>{event.status}</Text>
          <Text accessibilityLabel={locationLabel}>{event.location}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 13,
  },
  card: {
    backgroundColor: 'grey',
    borderRadius: 8,
    paddingVertical: 45,
    paddingHorizontal: 25,
    width: '100%',
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
