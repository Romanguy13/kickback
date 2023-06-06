import React, { useState } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Modal, Image, View, Text, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { EventReturn } from '../resources/schema/event.model';
import { FB_AUTH } from '../../firebaseConfig';
import KickbackImage from '../resources/api/kickbackImage';
import Events from '../resources/api/events';


// export default function HistoryCard(eventName: string, eventLocation: string, eventID: string)
function HistoryCard({ event, navigation, setShowModal, setReceipt }: { event: EventReturn; navigation: any; setShowModal: any, setReceipt: any }) {
  const [receiptImage, setReceiptImage] = useState(" ")
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    navigation.navigate('EventDetail', { event });
  };

  const handleUpload = async () => {
    if (FB_AUTH.currentUser?.uid === event.hostId && !event.receipt) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied to access photo library');
        return;
      }

      const data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      // Uploads the image to the backend
      if (data.assets && data.assets[0]) {
        setReceiptImage(data.assets[0].uri);
        new KickbackImage().uploadImage(data.assets[0].uri, `${event.id}_receipt`);
        new Events().edit(event.id, { receipt: `${event.id}_receipt` });
      }

      // await ImagePicker.launchImageLibraryAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   allowsEditing: true,
      //   quality: 1,
      // })
      //   .then((result) => {
      //     result.assets?.forEach((asset) => {
      //       setReceiptImage(asset.uri)
      //       console.log("img is =", asset.uri);
      //       new KickbackImage().uploadImage(asset.uri, `${event.id}_receipt`);
      //       new Events().edit(event.id, { receipt: `${event.id}_receipt` });
      //     });
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      console.log("image is ", receiptImage)
    } else if (event.receipt) {
      // Download the image from the backend
      const image = await new KickbackImage().downloadImage(event.receipt);
      setReceipt(image);
    }

    setModalVisible(true);

  };

  const closeModal = () => {
    setModalVisible(false); // Hide the modal
  };ß

  const host = FB_AUTH.currentUser?.uid === event.hostId;
  const paid = true;
  const numOfPeople = 7;
  const totalPaid = 3;

  let paymentStatus;
  if (host) {
    paymentStatus = (
      <View style={styles.hostPaymentStatus}>
        <Text style={styles.paymentText}>{totalPaid} / {numOfPeople} paid</Text>
      </View>
    );
  } else if (paid) {
    paymentStatus = (
      <View style={styles.paidStatus}>
        <Text style={styles.paymentText}>paid</Text>
      </View>
    );
  } else {
    paymentStatus = (
      <View style={styles.payStatus}>
        <Text style={styles.paymentText}>unpaid</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View>
          <View style={styles.headingContainer}>
            <Text style={[styles.heading]}>{event.name}</Text>
          </View>

          <View style={styles.bottomHalf}>
            <View style={styles.leftSide}>
              <Pressable onPress={handleUpload}>
                <View style={styles.recieptButton}>
                  <Ionicons name={host ? "arrow-up-circle-outline" : "receipt-outline"} style={styles.iconPosition} />
                  <Text style={styles.receiptText}>{host ? "Upload Receipt" : "View Receipt"}</Text>
                </View>
              </Pressable>
              {modalVisible && (
                <Modal visible={modalVisible} onRequestClose={closeModal}>
                  {/* Modal content */}
                  {receiptImage !== " " ? (
                    <Image source={{ uri: receiptImage }} style={styles.modalImage} />
                  ) : (
                    <>
                      <Ionicons name="alert-circle-outline" style={styles.noRecieptImage} />
                      <Text style={styles.NoImageText}>NO RECEIPT UPLOADED</Text>
                    </>
                  )}
                  <Pressable onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </Modal>
              )}
            </View>
            <View style={styles.rightSide}>
              <Text style={styles.locationtext}>{event.location}</Text>
              {paymentStatus}
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: 20,
  },
  modalImage: {
    flex: 1,
    resizeMode: 'contain',

  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    alignContent: 'center',
    left: '40%'
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 0,
    bottom: 60
  },
  noRecieptImage:
  {
    flex: 1,
    color: 'blue',
    fontSize: 400,
    top: 100
  },
  NoImageText: {
    position: 'relative',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    left: '8%',
    bottom: '30%'

  },

});
export default HistoryCard;
