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
    <View style={styles.rectangle}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Event Detail', { event })}>
        <View>
          <Text accessibilityLabel={titleLabel}>
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
  rectangle: {
    backgroundColor: "#B5B4B1",
    padding: 50,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30, 
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30
  }
});

export default EventCard;
