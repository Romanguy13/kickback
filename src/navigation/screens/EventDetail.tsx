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
import { EventReturn, InviteeStatus } from '../../resources/schema/event.model';
import InviteeStatusCard from '../../components/InviteeStatusCard';

function EventDetail({ route, navigation }: any) {
  const { event } = route.params;

  const [currentEvent, setCurrentEvent] = useState<EventReturn>(event);

  const [topMembers, setTopMembers] = useState<UserReturn[]>([]);

  const [showDeleteButton, setDeleteButton] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState(false);

  const eventDate = moment(event.datetime.toDate());

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Calculate the time left until the event
  const timeLeft = event.datetime.toDate().getTime() - new Date().getTime();
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const deleteEvent = async () => {
    try {
      await new Events().delete(event.id);
      Alert.alert('Success!', 'Event deleted.');
      closeModal();
      navigation.goBack();
    } catch (error) {
      closeModal();
      // console.log(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  const handleInviteeStatus = async (status: boolean) => {
    // edit the event in the database to reflect the new status based on the user's response
    const currentUserId = FB_AUTH.currentUser?.uid;
    const { inviteeStatus } = currentEvent;

    // find the inviteeStatus that corresponds to the current user id
    const inviteeFound = inviteeStatus.find(
      (invitee: InviteeStatus) => invitee.id === currentUserId
    );
    /* istanbul ignore else */
    if (inviteeFound) {
      inviteeFound.status = status;

      // change the inviteeStatus to reflect the user's response
      const newInviteeStatus = inviteeStatus.map((invitee: InviteeStatus) => {
        if (invitee.id === currentUserId) {
          return inviteeFound;
        }
        return invitee;
      });

      // update the event in the database
      await new Events().edit(event.id, { inviteeStatus: newInviteeStatus });

      // console.log('inviteeStatus - before', currentEvent);

      // update the event in the state
      setCurrentEvent({ ...currentEvent, inviteeStatus: newInviteeStatus });

      // console.log('inviteeStatus - after', currentEvent);
    }
  };

  const checkStatus = (currEvent: EventReturn) => {
    // check the status of the user in the event based on their id
    const currentUserId = FB_AUTH.currentUser?.uid;
    const { inviteeStatus } = currEvent;

    // find the inviteeStatus that corresponds to the current user id
    const inviteeFound = inviteeStatus.find(
      (invitee: { id: string; status: boolean | null }) => invitee.id === currentUserId
    );

    const status = inviteeFound?.status;

    // check if the user is the host
    if (currentUserId === currEvent.hostId) {
      return 'Host';
    }

    // if the user has not responded to the invite, return 'pending'
    if (status === null) {
      return 'Pending';
    }
    if (status) {
      return 'Going';
    }
    return 'Not going';
  };

  const checkHostStatus = async () => {
    const currentUserId = FB_AUTH.currentUser?.uid;
    if (currentUserId === currentEvent.hostId) {
      setDeleteButton(true);
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

      // console.log('tMembers', tMembers);

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
      <View style={styles.timeLeftContainer}>
        <Text style={styles.titleText}>Time Remaining</Text>
        <View style={styles.timeLeftBoxes}>
          <View style={styles.boxContainer}>
            <View style={styles.timeLeftBox}>
              <Text style={styles.timeLeftText}>{days}</Text>
            </View>
            <Text style={styles.timeSubtitileText}>DAY</Text>
          </View>
          <Text style={{ fontSize: 50, fontWeight: 'bold' }} testID="colon-1">
            :
          </Text>
          <View style={styles.boxContainer}>
            <View style={styles.timeLeftBox}>
              <Text style={styles.timeLeftText}>{hours}</Text>
            </View>
            <Text style={styles.timeSubtitileText}>HR</Text>
          </View>
          <Text style={{ fontSize: 50, fontWeight: 'bold' }} testID="colon-2">
            :
          </Text>
          <View style={styles.boxContainer}>
            <View style={styles.timeLeftBox}>
              <Text style={styles.timeLeftText}>{minutes}</Text>
            </View>
            <Text style={styles.timeSubtitileText}>MIN</Text>
          </View>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{checkStatus(event)}</Text>
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
        <View style={styles.buttonsContainer}>
          {FB_AUTH.currentUser?.uid !== event.hostId && (
            <View style={styles.voteContainer}>
              <Pressable
                testID="accept-invite"
                onPress={() => handleInviteeStatus(true)}
                style={styles.voteButton}
              >
                <Ionicons name="checkmark-outline" size={30} color="#FF7000" />
              </Pressable>
              <Pressable
                testID="decline-invite"
                onPress={() => handleInviteeStatus(false)}
                style={styles.voteButton}
              >
                <Ionicons name="close-outline" size={30} color="#FF7000" />
              </Pressable>
            </View>
          )}
          {showDeleteButton && (
            <View style={styles.voteContainer}>
              <Pressable style={styles.deleteButton} onPress={openModal} testID="delete-button">
                <Ionicons name="close-outline" size={90} color="#FFFFFB" />
                <Text style={styles.deleteText} testID="delete-label">
                  Delete Event
                </Text>
              </Pressable>
            </View>
          )}
        </View>
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
    height: '100%',
    borderRadius: 20,
    marginRight: 10,
  },
  buttonsContainer: {
    display: 'flex',
    backgroundColor: '#DBDBDB',
    width: '45%',
    height: '100%',
    borderRadius: 20,
    marginLeft: 10,
  },
  deleteButton: {
    borderRadius: 20,
    borderColor: '#DE4040',
    width: '74%',
    height: '62%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#DE4040',
    margin: 40,
  },
  deleteText: {
    color: '#FFFFFB',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
