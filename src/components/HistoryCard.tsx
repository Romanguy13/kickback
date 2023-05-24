import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View, Text } from 'react-native';
import { EventReturn } from '../resources/schema/event.model';

// export default function HistoryCard(eventName: string, eventLocation: string, eventID: string)
function HistoryCard({ event, navigation }: { event: EventReturn; navigation: any }) {
  const handlePress = () => {
    navigation.navigate('EventDetail', { event });
  };

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View>
          <View style={styles.headingContainer}>
            <Text style={[styles.heading]}>{event.name}</Text>
          </View>
          <Text style={styles.locationtext}>{event.location}</Text>
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
    // this the card color
    backgroundColor: '#FFA500',
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
    paddingTop: 52,
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
    // textAlign: 'center',
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

export default HistoryCard;

/*
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
*/
