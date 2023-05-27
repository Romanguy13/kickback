import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { EventReturn } from '../../resources/schema/event.model';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FB_AUTH } from '../../../firebaseConfig';
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
  const UploadButton = () => {
    const handleImageUpload = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (pickerResult.canceled === true) {
        return;
      }

      // Handle the selected image
      console.log(pickerResult);
    };

    const host = true
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

                  <TouchableOpacity onPress={handleImageUpload}>
                    <View style={styles.recieptButton}>
                      <Ionicons name="arrow-up-circle-outline" style={styles.iconPosition} />
                      <Text style={styles.receiptText}>  Upload Receipt </Text>
                    </View>
                  </TouchableOpacity>

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

/*
 <Text style={styles.locationtext}>{event.location}</Text>
            <View style={styles.payStatus}>
              <Text style={styles.payText}> Paid </Text>
            </View>

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
  timetext: {
    position: 'absolute',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 72,
    paddingTop: 52,
    textAlign: 'center',
    color: '#FFFDF8',
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
   statusContainer: {
    position: 'absolute',
    width: 84,
    height: 21.66,
    borderRadius: 25,
    backgroundColor: '#ff7000',
  },
});
*/
