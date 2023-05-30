import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { EventReturn } from '../resources/schema/event.model';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FB_AUTH } from '../../firebaseConfig';
//import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';

// export default function HistoryCard(eventName: string, eventLocation: string, eventID: string)
function HistoryCard({ event, navigation }: { event: EventReturn; navigation: any }) {
  const handlePress = () => {
    navigation.navigate('EventDetail', { event });
    /*
    if the current user logged in is == to the event card 
    FB_AUTH.currentUser?.id == event.hostId
  
    */

  };
  const host = false
  const paid = true
  const numOfPeople = 7
  const totalPaid = 3
  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableWithoutFeedback onPress={handlePress}>

        <View>
          <View style={styles.headingContainer}>
            <Text style={[styles.heading]}>{event.name}</Text>
          </View>

          <View style={styles.bottomHalf}>
            <View style={styles.leftSide}>

              {host ? (

                //<TouchableOpacity onPress={handleImageUpload}>
                <View style={styles.recieptButton}>
                  <Ionicons name="arrow-up-circle-outline" style={styles.iconPosition} />
                  <Text style={styles.receiptText}>  Upload Receipt </Text>
                </View>
                // </TouchableOpacity>

              ) : (
                <View style={styles.recieptButton}>
                  <Ionicons name="receipt-outline" style={styles.iconPosition} />
                  <Text style={styles.receiptText}>  View Receipt </Text>
                </View>
              )}

            </View>
            <View style={styles.rightSide}>
              <Text style={styles.locationtext}> {event.location} </Text>

              {host ? (

                <View style={styles.hostPaymentStatus}>
                  <Text style={styles.paymentText}> {totalPaid} / {numOfPeople} paid </Text>
                </View>
              ) : (

                paid ? (
                  <View style={styles.paidStatus}>
                    <Text style={styles.paymentText}> paid </Text>
                  </View>
                ) : (
                  <View style={styles.payStatus}>
                    <Text style={styles.paymentText}> unpaid </Text>
                  </View>
                )
              )}

            </View>
          </View>

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
    backgroundColor: '#FF6800',
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
  bottomHalf:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'white',
    width: 322,
    height: 132,
    top: 44,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  rightSide:
  {
    flex: 1,
    height: 132,
    borderBottomRightRadius: 18,
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  leftSide:
  {
    flex: 1,
    backgroundColor: 'black',
    height: 132,
    borderBottomLeftRadius: 18,

  },
  locationtext: {
    position: 'absolute',
    top: '20%',
    left: '21%',
    width: 120,
    fontWeight: '800',
    fontSize: 14,
    //paddingLeft: 50,
  },
  card: {
    backgroundColor: '#FFFDF8',
    borderRadius: 18,
    width: 322,
    height: 176,
    marginVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  recieptButton:
  {
    backgroundColor: 'white',
    height: 90,
    width: 90,
    top: '15%',
    left: '23%',
    borderRadius: 5
  },
  iconPosition:
  {
    alignContent: 'center',
    height: 50,
    width: 50,
    left: '27%',
    color: 'black',
    fontSize: 43
  },
  paidStatus:
  {
    position: 'absolute',
    top: '70%',
    left: '22%',
    width: 90,
    backgroundColor: 'green'
  },
  payStatus:
  {
    position: 'absolute',
    top: '70%',
    left: '22%',
    width: 90,
    backgroundColor: 'red'
  },
  hostPaymentStatus:
  {
    position: 'absolute',
    top: '70%',
    left: '22%',
    width: 90,
    backgroundColor: '36A5C8'
  },
  paymentText:
  {
    fontSize: 16,
    textAlign: 'center',
    color: 'white'
  },
  receiptText:
  {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  }
});
export default HistoryCard;