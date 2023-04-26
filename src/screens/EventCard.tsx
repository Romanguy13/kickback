import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      padding: 2,
      borderTopRightRadius: 60, 
      borderBottomRightRadius: 60,

    },
    date: {
      fontWeight: '700',
      fontSize: 20,
      position: 'absolute',
      width: 169,
      height: 128,
      left: 0,
      top: 274
    },
    item: {
      paddingLeft: 10,
      fontSize: 18,
      fontWeight: 'bold',
      paddingBottom: 5,
    },
    count: {
      paddingLeft: 15,
    },
  });

  interface NavBarProps {
    navigation: any; // Replace with the correct type for your navigation prop
  }


  const EventCard = ({event, navigation} : any) => {

    // accessibility labels 
    let timeLabel = "time of the event";
    let dateLabel = "date";
    let titleLabel = "title of event";
    let statusLabel = "status";
    let invitedLabel = "# of invites";
    
    return (
        <View>
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('Event Detail', {event: event})}>
                <View style={styles.container}>
                    <Text style={styles.container}
                        accessibilityLabel={titleLabel}>
                        {event.title}
                    </Text>
                    <Text
                        accessibilityLabel={dateLabel}>
                        {event.date}</Text>
                    <Text
                        accessibilityLabel={timeLabel}>
                    {event.time}</Text>
                    <Text
                        accessibilityLabel={statusLabel}
                    >{event.status}</Text>
                    </View> 
                </TouchableWithoutFeedback>
        </View>
    )

};

export default EventCard;
