import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ImagePicker from 'expo-image-picker';
import { EventReturn } from '../resources/schema/event.model';
import { FB_AUTH } from '../../firebaseConfig';
import KickbackImage from '../resources/api/kickbackImage';
import Events from '../resources/api/events';

// export default function HistoryCard(eventName: string, eventLocation: string, eventID: string)
function HistoryCard({
  event,
  navigation,
  setShowModal,
  setReceipt,
  setRefresh,
}: {
  event: EventReturn;
  navigation: any;
  setShowModal: any;
  setReceipt: any;
  setRefresh: any;
}) {
  const handleUpload = async () => {
    if (FB_AUTH.currentUser?.uid === event.hostId && !event.receipt) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied to access photo library');
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (res.assets) {
        const uploadedPath = await new KickbackImage().uploadImage(
          res.assets[0].uri,
          `${event.id}_receipt`
        );

        await new Events().edit(event.id, { receipt: uploadedPath });
        const newUri = await new KickbackImage().downloadImage(uploadedPath);
        setReceipt(newUri);
        setRefresh(true);
      }
    } else if (event.receipt) {
      const newUri = await new KickbackImage().downloadImage(event.receipt);
      setReceipt(newUri);
    }

    setShowModal(true);
  };

  const handlePress = () => {
    navigation.navigate('EventHistoryDetail', { event });
  };
  const status = 'granted';
  // const handleReceipt = async () => {
  //   if (FB_AUTH.currentUser?.uid === event.hostId && event.receipt === ' ') {
  //     // 1st time uploading image
  //     try {
  //       // Request permission to access the device's photo library
  //       // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       await ImagePicker.launchImageLibraryAsync({
  //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //         allowsEditing: true,
  //         quality: 1,
  //       })
  //         .then((result) => {
  //           result.assets?.forEach((asset) => {
  //             setReceipt(asset.uri)
  //             console.log("img is =", asset.uri);
  //           });
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //       //console.log("image is ", result)
  //     }
  //setShowModal(true)

  //Jose's verison 
  /*
  if (status !== 'granted') {
    console.log('Permission denied to access photo library');
    return;
  }
  console.log('getting image');
  const data = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });
  if (!data.canceled) {
    setReceipt(data)
    console.log(data);
  } else {
    alert('You did not select any image.');
  }
  */
  //     catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   setShowModal(true)
  // };
  //const host = FB_AUTH.currentUser?.uid === event.hostId;
  const host = true;
  const paid = true;
  const numOfPeople = 7;
  const totalPaid = 3;
  const receipt = ' ';
  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View>
          <View style={styles.headingContainer}>
            <Text style={[styles.heading]}>{event.name}</Text>
          </View>

          <View style={styles.bottomHalf}>
            {/*LEFT SIDE OF CARD: uploading or viewing the receipt */}
            <View style={styles.leftSide}>
              {host ? (
                <Pressable onPress={handleUpload}>
                  <View style={styles.recieptButton}>
                    <Ionicons name="arrow-up-circle-outline" style={styles.iconPosition} />
                    <Text style={styles.receiptText}> Upload Receipt </Text>
                  </View>
                </Pressable>
              ) : (
                <Pressable onPress={handleUpload}>
                  <View style={styles.recieptButton}>
                    <Ionicons name="receipt-outline" style={styles.iconPosition} />
                    <Text style={styles.receiptText}> View Receipt </Text>
                  </View>
                </Pressable>
              )}
            </View>
            {/*RIGHT SIDE OF CARD: address and payment status*/}
            <View style={styles.rightSide}>
              <Text style={styles.locationtext}> {event.location} </Text>

              {host && (
                <View style={styles.hostPaymentStatus}>
                  <Text style={styles.paymentText}>
                    {' '}
                    {totalPaid} / {numOfPeople} paid{' '}
                  </Text>
                </View>
              )}
              {paid ? (
                <View style={styles.paidStatus}>
                  <Text style={styles.paymentText}> paid </Text>
                </View>
              ) : (
                <View style={styles.payStatus}>
                  <Text style={styles.paymentText}> unpaid </Text>
                </View>
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
  bottomHalf: {
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
  rightSide: {
    flex: 1,
    height: 132,
    borderBottomRightRadius: 18,
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  leftSide: {
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
    // paddingLeft: 50,
  },
  card: {
    backgroundColor: '#FFFDF8',
    borderRadius: 18,
    width: 322,
    height: 176,
    marginVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  recieptButton: {
    backgroundColor: 'white',
    height: 90,
    width: 90,
    top: '15%',
    left: '23%',
    borderRadius: 5,
  },
  iconPosition: {
    alignContent: 'center',
    height: 50,
    width: 50,
    left: '27%',
    color: 'black',
    fontSize: 43,
  },
  paidStatus: {
    position: 'absolute',
    top: '70%',
    left: '22%',
    width: 90,
    backgroundColor: 'green',
  },
  payStatus: {
    position: 'absolute',
    top: '70%',
    left: '22%',
    width: 90,
    backgroundColor: 'red',
  },
  hostPaymentStatus: {
    position: 'absolute',
    top: '70%',
    left: '22%',
    width: 90,
    backgroundColor: '36A5C8',
  },
  paymentText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  receiptText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
export default HistoryCard;
