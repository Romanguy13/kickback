import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GroupMembers from '../../resources/api/groupMembers';
import Users from '../../resources/api/users';
import Events from '../../resources/api/events';
import { FB_AUTH } from '../../../firebaseConfig';
import { UserReturn } from '../../resources/schema/user.model';
import { GroupMemberModel } from '../../resources/schema/group.model';
import { EventReturn, InviteeStatus, UpdatedEvent } from '../../resources/schema/event.model';
import InviteeStatusCard from '../../components/InviteeStatusCard';

function EventDetail({ route, navigation }: any) {
  const { event, canVote } = route.params;

  const [currentEvent, setCurrentEvent] = useState<EventReturn>(event);

  const [topMembers, setTopMembers] = useState<UserReturn[]>([]);

  const [showDeleteButton, setDeleteButton] = useState<boolean>(false);

  // Calculate the time left until the event
  const timeLeft = event.datetime.toDate().getTime() - new Date().getTime();
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const deleteEvent = async () => {
    try {
      await new Events().delete(event.id);
      Alert.alert('Success!', 'Event deleted.');
      navigation.goBack();
    } catch (error) {
      console.log(error);
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

      console.log('inviteeStatus - before', currentEvent);

      // update the event in the state
      setCurrentEvent({ ...currentEvent, inviteeStatus: newInviteeStatus });

      console.log('inviteeStatus - after', currentEvent);
    }
  };

  const checkStatus = (currEvent: EventReturn) => {
    // check the status of the the user in the event based on their id
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
      <View style={styles.timeLeftContainer}>
        <Text style={styles.titleText}>Time Remaining</Text>
        <View style={styles.timeLeftBoxes}>
          <View style={styles.boxContainer}>
            <View style={styles.timeLeftBox}>
              <Text style={styles.timeLeftText}>{days}</Text>
            </View>
            <Text style={styles.timeSubtitileText}>DAY</Text>
          </View>
          <Text>:</Text>
          <View style={styles.boxContainer}>
            <View style={styles.timeLeftBox}>
              <Text style={styles.timeLeftText}>{hours}</Text>
            </View>
            <Text style={styles.timeSubtitileText}>HR</Text>
          </View>
          <Text>:</Text>
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
        <Text style={styles.eventText}>{event.name}</Text>
      </View>
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
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderRadius: 20,
  },
  eventText: {
    color: '#272222',
    fontSize: 36,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
    padding: 4,
    marginTop: 10,
    marginLeft: 20,
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
  datetimeContainer: {
    backgroundColor: '#272222',
    width: '30%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dateContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  dateText: {
    color: '#FFFFFB',
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 20,
    width: '100%',
    textAlign: 'center',
  },
  timeContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  timeText: {
    color: '#FFFFFB',
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 20,
    width: '100%',
    textAlign: 'center',
  },
  voteContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  voteButton: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFFFFB',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 40,
  },
  locationpeopleContainer: {
    backgroundColor: '#FFFFFB',
    width: '70%',
    flexDirection: 'column',
  },
  locationContainer: {
    width: '100%',
    top: 90,
    alignItems: 'center',
  },
  locationTitleText: {
    color: '#272222',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 20,
  },
  locationText: {
    color: '#272222',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 40,
  },
  usersContainer: {
    display: 'flex',
    backgroundColor: '#272222',
    width: '70%',
    height: '30%',
    alignSelf: 'center',
    top: 150,
    borderRadius: 20,
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
  deleteButton: {
    backgroundColor: '#FF7000',
    width: '100%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    top: 200,
  },
});

export default EventDetail;
