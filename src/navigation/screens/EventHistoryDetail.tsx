import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, Image, ScrollView, Modal } from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GroupMembers from '../../resources/api/groupMembers';
import Users from '../../resources/api/users';
import Events from '../../resources/api/events';
import { FB_AUTH } from '../../../firebaseConfig';
import { UserReturn } from '../../resources/schema/user.model';
import { GroupMemberModel } from '../../resources/schema/group.model';
import { EventReturn, InviteeStatus, UpdatedEvent } from '../../resources/schema/event.model';
import InviteeStatusCard from '../../components/InviteeStatusCard';
import { GroupCardProps } from './EventGroups';

function EventDetail({ route, navigation }: any) {
  const { event, canVote } = route.params;

  const [currentEvent, setCurrentEvent] = useState<EventReturn>(event);

  const [topMembers, setTopMembers] = useState<UserReturn[]>([]);

  const [showDeleteButton, setDeleteButton] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState(false);

  const eventDate = moment(event.datetime.toDate());

  const { group }: GroupCardProps = route.params;

  const checkHostStatus = async () => {
    const currentUserId = FB_AUTH.currentUser?.uid;
    if (currentUserId === currentEvent.hostId) {
      setDeleteButton(true);
      console.log('User is host');
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const deleteEvent = async () => {
    try {
      await new Events().delete(event.id);
      Alert.alert('Success!', 'Event deleted.');
      closeModal();
      navigation.goBack();
    } catch (error) {
      closeModal();
      console.log(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  useEffect(() => {
    checkHostStatus();

    const fetchData = async () => {
      const tempMembers = (await new GroupMembers().getAll(
        event.gId,
        'groupId'
      )) as GroupMemberModel[];

      const promises = tempMembers.map(
        (member) => new Users().get(member.userId) as Promise<UserReturn>
      );

      const tMembers: UserReturn[] = await Promise.all(promises);

      console.log('tMembers', tMembers);

      // sort the members so the host is first
      tMembers.sort((a, b) => {
        if (a.id === currentEvent.hostId) {
          return -1;
        }
        if (b.id === currentEvent.hostId) {
          return 1;
        }
        return 0;
      });
      setTopMembers(tMembers);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent]);

  if (event.name.length >= 20) {
    event.name = `${event.name.substring(0, 14)}..`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Pressable
          accessibilityLabel="Back Button"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons style={styles.backIcon} name="chevron-back-outline" size={40} color="#FF7000" />
        </Pressable>
      </View>
      <View style={styles.eventContainer}>
        <Text style={styles.eventNameText}>{event.name}</Text>
        <Text style={styles.eventLocationText}>{event.location}</Text>
        <View style={styles.eventDateHandsContainer}>
          <View
            style={{
              display: 'flex',
              width: '60%',
              top: 100,
            }}
          >
            <Text style={styles.eventDateText}>{eventDate.format('MMMM DD, YYYY')}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignSelf: 'center',
              width: '40%',
            }}
          >
            <Image source={require('../../../assets/hands.png')} style={styles.handsImage} />
          </View>
        </View>
      </View>
      <View style={styles.listNButtonContainer}>
        <View style={styles.usersContainer}>
          <ScrollView style={styles.usersScroll}>
            {topMembers.map((member: UserReturn) => (
              <InviteeStatusCard event={event} key={member.id} currentMember={member} />
            ))}
          </ScrollView>
        </View>
        <View style={styles.imageContainer}>
          <Text>Image</Text>
        </View>
      </View>
      <View style={styles.redoContainer}>
        <Pressable
          style={styles.redoButton}
          onPress={() => {
            navigation.navigate('TabBar', {
              screen: 'Creation',
              params: {
                topMembers,
                groupId: event.gId,
                eventTitle: event.name,
                eventLocation: event.location,
              },
            });
          }}
        >
          <Text style={styles.statusText}>Redo Event</Text>
        </Pressable>
        {showDeleteButton && (
          <Pressable style={styles.deleteButton} onPress={openModal} testID="delete-button">
            <Text style={styles.statusText} testID="delete-label">
              Delete Event
            </Text>
          </Pressable>
        )}
      </View>
      <Modal testID="edit-modal" visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this event?</Text>
            <View style={styles.modalButtonContainer}>
              <View style={styles.modalButtonContainer}>
                <Pressable style={styles.closeButton} onPress={deleteEvent} testID="yes-modal">
                  <Text style={styles.closeButtonText}>Yes </Text>
                </Pressable>
              </View>
              <View style={styles.modalButtonContainer}>
                <Pressable style={styles.closeButton} onPress={closeModal} testID="no-modal">
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFB',
  },
  topContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    height: 100,
    paddingTop: 30,
  },
  backButton: {
    backgroundColor: '#272222',
    borderColor: '#272222',
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 100,
    margin: 10,
    width: '20%',
  },
  backIcon: {
    alignSelf: 'center',
  },
  timeLeftContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  timeLeftBoxes: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainer: {
    margin: 10,
    width: '26%',
    height: 120,
  },
  timeLeftBox: {
    backgroundColor: '#272222',
    borderRadius: 14,
    width: '100%',
    height: '90%',
    justifyContent: 'center',
  },
  timeLeftText: {
    color: '#FFFFFB',
    fontSize: 48,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  timeSubtitileText: {
    color: '#272222',
    fontSize: 26,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  statusContainer: {
    display: 'flex',
    backgroundColor: '#FF7000',
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  statusText: {
    color: '#FFFFFB',
    fontSize: 36,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    alignSelf: 'center',
    padding: 4,
  },
  eventContainer: {
    backgroundColor: '#FF7000',
    width: '95%',
    height: '28%',
    flexDirection: 'column',
    alignSelf: 'center',
    borderRadius: 20,
  },
  eventNameText: {
    color: '#272222',
    fontSize: 32,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
    padding: 4,
    marginLeft: 20,
    marginTop: 10,
  },
  eventLocationText: {
    color: '#272222',
    fontSize: 28,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
    padding: 4,
    marginLeft: 20,
    marginRight: 20,
  },
  eventDateHandsContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    paddinBottom: 4,
  },
  handsImage: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
    paddingTop: 160,
    transform: [{ rotate: '-40deg' }],
    opacity: 0.5,
  },
  eventDateText: {
    color: '#272222',
    fontSize: 26,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
    marginLeft: 20,
  },
  listNButtonContainer: {
    flexDirection: 'row',
    padding: 10,
    height: '28%',
  },
  usersContainer: {
    display: 'flex',
    backgroundColor: '#272222',
    width: '50%',
    height: '150%',
    borderRadius: 20,
    marginRight: 10,
  },
  imageContainer: {
    display: 'flex',
    backgroundColor: '#DBDBDB',
    width: '45%',
    height: '150%',
    borderRadius: 20,
    marginLeft: 10,
  },
  deleteButton: {
    display: 'flex',
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#DE4040',
  },
  deleteText: {
    color: '#FFFFFB',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '45%',
  },
  redoButton: {
    display: 'flex',
    backgroundColor: '#272222',
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 20,
  },
  redoText: {
    color: '#FFFFFB',
    fontSize: 36,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    alignSelf: 'center',
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#272222',
    width: '80%',
    padding: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 26,
    marginBottom: 10,
    color: '#FFFFFB',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF7000',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFB',
  },
  modalInputBox: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    padding: 5,
  },
  modalInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#272222',
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    padding: 5,
  },
  titleText: {
    color: '#272222',
    fontSize: 36,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    height: '84%',
  },
  voteContainer: {
    width: '100%',
  },
  voteButton: {
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#272222',
    backgroundColor: '#272222',
    width: '60%',
    height: '30%',
    margin: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  usersScroll: {
    margin: 10,
    height: '100%',
  },
  usersText: {
    color: '#FFFFFB',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'flex-end',
  },
});

export default EventDetail;
