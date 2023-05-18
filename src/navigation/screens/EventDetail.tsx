import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GroupMembers from '../../resources/api/groupMembers';
import Users from '../../resources/api/users';
import Events from '../../resources/api/events';
import { FB_AUTH } from '../../../firebaseConfig';

function EventDetail({ route, navigation }: any) {
  const { event, canVote } = route.params;

  const [currentEvent, setCurrentEvent] = useState<any>(event);

  const [topMembers, setTopMembers] = useState<any[]>([]);

  const idToName = async (id: string) => {
    const user = await new Users().get(id);
    return user.name;
  };

  const handleInviteeStatus = async (status: boolean) => {
    // edit the event in the database to reflect the new status based on the user's response
    const currentUserId = FB_AUTH.currentUser?.uid;
    const { inviteeStatus } = currentEvent;

    // find the inviteeStatus that corresponds to the current user id
    const inviteeFound = inviteeStatus.find(
      (invitee: { id: string; status: boolean | null }) => invitee.id === currentUserId
    );
    if (inviteeFound) {
      inviteeFound.status = status;
    }

    // change the inviteeStatus to reflect the user's response
    const newInviteeStatus = inviteeStatus.map(
      (invitee: { id: string; status: boolean | null }) => {
        if (invitee.id === currentUserId) {
          return inviteeFound;
        }
        return invitee;
      }
    );

    // update the event in the database
    await new Events().edit(event.id, { inviteeStatus: newInviteeStatus });

    // update the event in the state
    setCurrentEvent({ ...currentEvent, inviteeStatus: newInviteeStatus });
  };

  useEffect(() => {
    const fetchData = async () => {
      const tempMembers = await new GroupMembers().getAll(event.gId, 'groupId');

      const promises = tempMembers.map(async (member) => {
        const name = await idToName(member.userId);
        return { id: member.userId, name };
      });

      const tMembers = await Promise.all(promises);
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
        <Text style={styles.titleText}>{event.name}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.datetimeContainer}>
          <Pressable
            accessibilityLabel="Back Button"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={40} color="white" />
          </Pressable>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{event.date}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{event.time}</Text>
          </View>
          {canVote && FB_AUTH.currentUser?.uid !== event.hostId ? (
            <View style={styles.voteContainer}>
              <Pressable
                testID="accept-invite"
                onPress={() => handleInviteeStatus(true)}
                style={styles.voteButton}
              >
                <Ionicons name="person-add-outline" size={30} color="#FF7000" />
              </Pressable>
              <Pressable
                testID="decline-invite"
                onPress={() => handleInviteeStatus(false)}
                style={styles.voteButton}
              >
                <Ionicons name="person-remove-outline" size={30} color="#FF7000" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.voteContainer}>
              <Pressable style={styles.voteButton}>
                <Ionicons name="repeat-outline" size={30} color="#FF7000" />
              </Pressable>
            </View>
          )}
          {/* comment out for now */}
        </View>

        <View style={styles.locationpeopleContainer}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitleText}>{event.location}</Text>
          </View>

          <View style={styles.usersContainer}>
            <ScrollView style={styles.usersScroll}>
              {topMembers.map((member) => (
                <View
                  key={member.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: 10,
                  }}
                >
                  <Text key={member.userId} style={styles.usersText}>
                    {member.name}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',

                      marginRight: 10,
                    }}
                  >
                    {member.id === event.hostId && (
                      <Ionicons name="star" size={25} color="#FF7000" />
                    )}
                    {member.id !== event.hostId &&
                      currentEvent.inviteeStatus.find(
                        (invitee: { id: string; status: boolean | null }) =>
                          invitee.id === member.id
                      ).status === true && <Ionicons name="checkmark" size={25} color="#FF7000" />}
                    {member.id !== event.hostId &&
                      currentEvent.inviteeStatus.find(
                        (invitee: { id: string; status: boolean | null }) =>
                          invitee.id === member.id
                      ).status === false && <Ionicons name="close" size={25} color="#FF7000" />}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
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
    backgroundColor: '#FF7000',
    height: '16%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#FFFFFB',
    fontSize: 60,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    height: '84%',
  },
  backButton: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFFFFB',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 20,
    marginBottom: 2,
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
});

export default EventDetail;
