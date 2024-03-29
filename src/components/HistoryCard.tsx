import React, { useState } from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Modal,
  Image,
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { EventReturn } from '../resources/schema/event.model';
import { FB_AUTH } from '../../firebaseConfig';
import KickbackImage from '../resources/api/kickbackImage';
import Events from '../resources/api/events';

// export default function HistoryCard(eventName: string, eventLocation: string, eventID: string)
function HistoryCard({ event, navigation }: { event: EventReturn; navigation: any }) {
  const [receiptImage, setReceiptImage] = useState<string>(' ');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handlePress = () => {
    navigation.navigate('EventHistoryDetail', { event });
  };

  const handleUpload = async (forceReupload?: boolean) => {
    if (FB_AUTH.currentUser?.uid === event.hostId && (!event.receipt || forceReupload)) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      console.log('Uploading receipt');

      const data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      console.log(data);

      // Uploads the image to the backend
      /* istanbul ignore next */
      if (data.assets && data.assets[0]) {
        try {
          await new KickbackImage().uploadImage(data.assets[0].uri, `${event.id}_receipt`);
          await new Events().edit(event.id, { receipt: `${event.id}_receipt` });
          setReceiptImage(data.assets[0].uri);
        } catch (err) {
          Alert.alert('Error uploading image');
        }

        // eslint-disable-next-line no-param-reassign
        event.receipt = `${event.id}_receipt`;
      }
    } else if (event.receipt) {
      // Download the image from the backend
      const image = await new KickbackImage().downloadImage(event.receipt);
      setReceiptImage(image);
    }

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false); // Hide the modal
  };

  const host = FB_AUTH.currentUser?.uid === event.hostId;
  const paid = event.paidStatus.find((user) => user.id === FB_AUTH.currentUser?.uid)?.status;
  const numOfPeople = 7;
  const totalPaid = 3;

  let paymentStatus;
  if (host) {
    paymentStatus = (
      <View style={styles.hostPaymentStatus}>
        <Text style={styles.paymentText}>
          {totalPaid} / {numOfPeople} paid
        </Text>
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
              <Pressable
                accessibilityLabel={host && !event.receipt ? 'Upload Receipt' : 'View Receipt'}
                testID="receiptButton"
                onPress={() => handleUpload()}
              >
                <View style={styles.recieptButton}>
                  <Ionicons
                    name={host && !event.receipt ? 'arrow-up-circle-outline' : 'receipt-outline'}
                    style={styles.iconPosition}
                  />
                  <Text style={styles.receiptText}>
                    {host && !event.receipt ? 'Upload Receipt' : 'View Receipt'}
                  </Text>
                </View>
              </Pressable>

              {modalVisible && (
                <Modal visible={modalVisible} onRequestClose={closeModal} animationType="slide">
                  {/* Modal content */}
                  {receiptImage !== ' ' ? (
                    <View style={styles.modalContainer}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderText}>Receipt</Text>
                        {host && (
                          <Pressable
                            style={styles.modalReuploadButton}
                            accessibilityLabel="Reupload Button"
                            testID="reuploadButton"
                            onPress={() => handleUpload(true)}
                          >
                            <Ionicons name="refresh-outline" style={styles.modalIcon} />
                            <Text style={styles.modalReuploadText}>Reupload</Text>
                          </Pressable>
                        )}
                      </View>
                      <Image source={{ uri: receiptImage }} style={styles.modalImage} />
                    </View>
                  ) : (
                    <View style={styles.modalContainer}>
                      <Ionicons name="alert-circle-outline" style={styles.noRecieptImage} />
                      <Text style={styles.NoImageText}>No Receipt Uploaded</Text>
                    </View>
                  )}
                  <Pressable
                    accessibilityLabel="Close"
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
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
    borderRadius: 20,
  },
  payStatus: {
    position: 'absolute',
    top: '70%',
    left: '22%',
    width: 90,
    backgroundColor: 'red',
    borderRadius: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF7000',
    borderRadius: 5,
    bottom: 59,
    /*
    backgroundColor: '#FF6701',
    paddingBottom: 30,
    paddingTop: 25,
    borderRadius: 5,
    //marginTop: 0,
    bottom: 60
    */
  },
  noRecieptImage: {
    flex: 1,
    color: 'blue',
    fontSize: 400,
    top: 100,
  },
  NoImageText: {
    position: 'relative',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    left: '8%',
    bottom: '30%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    padding: 10,
    marginTop: 50,
    backgroundColor: '#FF6701',
  },
  modalHeaderText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  modalIcon: {
    fontSize: 30,
    color: 'black',
  },
  modalReuploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: 100,
  },
  modalReuploadText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    color: '#272222',
    fontStyle: 'italic',
  },
});
export default HistoryCard;
