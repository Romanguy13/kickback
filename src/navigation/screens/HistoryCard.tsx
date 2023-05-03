import React from 'react';
import { StyleSheet, View, Dimensions, PixelRatio, Text } from 'react-native';

// export default function HistoryCard(eventName: string, eventLocation: string, eventID: string)
export default function HistoryCard({
  eventName,
  eventId,
  eventLocation,
}: {
  eventName: string;
  eventLocation: string;
  eventId: string;
}) {
  return (
    <View style={styles.container} key={eventId}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {eventName} , {eventLocation}
        </Text>
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
  },
  textContainer: {
    width: '100%',
    paddingTop: 20,
    margin: 20,
    alignItems: 'center',
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
  handsImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    transform: [{ rotate: '-.2deg' }],
  },
  eventText: {
    color: '#272222',
    fontSize: Math.round((windowWidth * 0.1) / fontScale),
    fontWeight: 'bold',
    width: '100%',
  },
});
