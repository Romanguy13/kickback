import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import firebase from 'firebase/compat';
import { Timestamp } from 'firebase/firestore';
import { EventModel, EventReturn } from '../../resources/schema/event.model';
import { FB_AUTH } from '../../../firebaseConfig';
import Users from '../../resources/api/users';
import Events from '../../resources/api/events';
import Groups from '../../resources/api/groups';
import GroupMembers from '../../resources/api/groupMembers';
import { UserReturn } from '../../resources/schema/user.model';
import { GroupMemberModel, GroupModel, GroupReturnModel } from '../../resources/schema/group.model';

export default function EventCreation({ navigation, route }: { navigation: any; route: any }) {
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eventTime, setEventTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [inviteUserEmail, setInviteUserEmail] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<UserReturn[]>([]); // [email1, email2, ...'
  const isFocused = useIsFocused();


  // Date Picker Config
  const handleEventDateChange = (selectedDate: Date | undefined) => {
    const currentDate = selectedDate || eventDate;
    console.log(currentDate);
    setShowDatePicker(false);
    setEventDate(moment(currentDate).format('MMM DD, YYYY'));
  };

  // Time Picker Config
  const handleEventTimeChange = (selectedTime: Date | undefined) => {
    const currentTime = selectedTime || eventTime;
    setShowTimePicker(false);
    setEventTime(moment(currentTime).format('h:mm A'));
  };

  const handleAddUser = () => {
    console.log('email', inviteUserEmail);

    // create user object and check if user exists
    if (inviteUserEmail === '') {
      Alert.alert('Please enter an email.');
      return;
    }
    if (inviteUserEmail === FB_AUTH.currentUser?.email) {
      Alert.alert('You cannot invite yourself, silly goose.');
      return;
    }
    if (invitedUsers.find((user: UserReturn) => user.email === inviteUserEmail)) {
      Alert.alert('User already invited.');
      return;
    }

    const user = new Users();
    user
      .getUserByEmail(inviteUserEmail)
      .then((currUser: UserReturn) => {
        setInvitedUsers([...invitedUsers, currUser]);
        setInviteUserEmail('');
      })
      .catch(() => {
        console.log('no user found');
        Alert.alert('User does not exist.');
        setInviteUserEmail('');
      });
  };

  const handleCreateEvent = async (): Promise<void> => {
    console.log(eventTitle);
    console.log(eventLocation);
    console.log(eventDate);
    console.log(eventTime);
    console.log(invitedUsers);
 
    if (eventTitle === '' || eventLocation === '' || eventDate === '' || eventTime === '') {
      Alert.alert('Please fill in all fields.');
      return;
    }
    if (invitedUsers.length === 0) {
      Alert.alert('Please invite at least one user.');
      return;
    }
    // get current user id
    const userEmail = FB_AUTH.currentUser?.email;
    if (!userEmail) {
      Alert.alert('Please log in.');
      return;
    }

    // Gets user id from email
    const user = new Users();
    let userReturned: UserReturn;

    // Get user id from email; Throws error if user does not exist
    try {
      // Trim the ends and make all lowercase
      userReturned = await user.getUserByEmail(userEmail.trim());
    } catch (e) {
      Alert.alert('Cannot find user.');
      return;
    }

    // if there was no params passed in, create a new group
    let gId = '';
    if (!route.params) {
      // FIRST - Check to see if the group exists
      let groupExists = false;

      const groupsJoinTable = (await new GroupMembers().getAll(
        FB_AUTH.currentUser?.uid as string,
        'userId'
      )) as GroupMemberModel[];

      // Check to see if the group members is the same as the invited users
      const existingGroupCheck = groupsJoinTable.map(async (group: GroupMemberModel) => {
        // Get all members from that group
        const groupMembers: GroupMemberModel[] = (await new GroupMembers().getAll(
          group.groupId,
          'groupId'
        )) as GroupMemberModel[];

        // Get all users given the groupMembers
        const groupMembersPromise: Promise<UserReturn>[] = groupMembers.map(
          (groupMember: GroupMemberModel) =>
            new Users().get(groupMember.userId) as Promise<UserReturn>
        );
        const groupMembersUsers: UserReturn[] = await Promise.all(groupMembersPromise);

        // Remove the current user from the groupMembersUsers
        groupMembersUsers.splice(
          groupMembersUsers.findIndex((groupMemberUser) => groupMemberUser.id === userReturned.id),
          1
        );

        // Check to see if the length is the same
        if (groupMembersUsers.length !== invitedUsers.length) {
          return;
        }

        // Check to see if the groupMembersUsers is the same as the invitedUsers
        const exists = groupMembersUsers.every((groupMemberUser: UserReturn) =>
          invitedUsers.some((invitedUser: UserReturn) => invitedUser.id === groupMemberUser.id)
        );

        if (exists) {
          groupExists = true;
          gId = group.groupId;
        }
      });

      await Promise.all(existingGroupCheck);

      // Create Group
      if (!groupExists) {
        gId = await new Groups().create({ name: 'Same Group Name' });

        // Add the users to GroupMember
        invitedUsers.map(async (currUser: UserReturn) => {
          await new GroupMembers().create({
            userId: currUser.id,
            groupId: gId,
          });
        });

        // Add the current user to GroupMember
        await new GroupMembers().create({
          userId: userReturned.id,
          groupId: gId,
        });
      }
    } else {
      // if there was params passed in, use the group id from the params
      gId = route.params.groupId;
    }

    const tempDateTime: Date = moment(`${eventDate} ${eventTime}`, 'MMM DD, YYYY h:mm A').toDate();

    // Event Model for later use
    const event: EventModel = {
      hostId: userReturned.id,
      name: eventTitle,
      location: eventLocation,
      datetime: Timestamp.fromDate(tempDateTime),
      gId,
      inviteeStatus: invitedUsers.map((invitedUser: UserReturn) => ({
        id: invitedUser.id,
        status: null,
      })),
    };

    // Create event
    const Event = new Events();
    Event.create(event)
      .then(() => {
        navigation.navigate('Feed');
      })
      .catch(() => {
        Alert.alert('Error creating event.');
      });

    // Clear input fields for next Creation
    setEventTitle('');
    setEventLocation('');
    setEventDate(moment().format('MMM DD, YYYY'));
    setEventTime(moment().format('h:mm A'));
    setInvitedUsers([]);
  };

  const userId = FB_AUTH.currentUser?.uid as string;

  useEffect(() => {
    if (route.params) {
      // top members are the members that are in the group - ALL MEMBERS
      const { topMembers, groupId, eventTitle, eventLocation } = route.params;
      // remove current user from topMembers
      const filteredTopMembers = topMembers.filter((member: UserReturn) => member.id !== userId);
      setInvitedUsers(filteredTopMembers);
      setEventTitle(eventTitle);
      setEventLocation(eventLocation);
    }
  }, [isFocused, route.params, userId]);
  // Handle the onPress fo the cancel button
  const handleCancel = () => {
    setEventTitle('');
    setEventLocation('');
    setEventDate(moment().format('MMM DD, YYYY'));
    setEventTime(moment().format('h:mm A'));
    setInvitedUsers([]);
    navigation.navigate('Feed');
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
        <KeyboardAvoidingView behavior="position" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
          <View style={styles.titleContainer}>
            <TextInput
              style={styles.titleInput}
              value={eventTitle}
              onChangeText={setEventTitle}
              keyboardType="default"
              placeholder="Event Title"
              placeholderTextColor="#FF7000"
              autoCapitalize="none"
              testID="title-input"
            />
          </View>
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Location</Text>
            <TextInput
              style={styles.locationInput}
              value={eventLocation}
              onChangeText={setEventLocation}
              keyboardType="default"
              autoCapitalize="none"
              testID="location-input"
            />
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
              testID="date-appear"
            >
              <Text style={styles.dateText} testID="date-input">
                {eventDate}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.datePicker}>
            {showDatePicker && (
              <DateTimePickerModal
                testID="date-picker"
                isVisible={showDatePicker}
                mode="date"
                minimumDate={new Date()}
                textColor='black'
                accentColor='black'
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onConfirm={(date: Date) => {
                  handleEventDateChange(date);
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
              />
            )}
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Time</Text>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowTimePicker(true)}
              testID="time-appear"
            >
              <Text style={styles.timeText} testID="time-input">
                {eventTime}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timePicker}>
            {showTimePicker && (
              <DateTimePickerModal
                testID="time-picker"
                isVisible={showTimePicker}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onConfirm={(date: Date) => {
                  handleEventTimeChange(date);
                }}
                onCancel={() => {
                  setShowTimePicker(false);
                }}
              />
            )}
          </View>
          <View style={styles.invitedLabelContainer}>
            <Text style={styles.invitedLabel}>Who&apos;s Invited</Text>
          </View>
          <View style={styles.usersContainer} testID="user-container">
            <View style={styles.invitedContainer}>
              <TextInput
                style={styles.invitedInput}
                value={inviteUserEmail}
                onChangeText={setInviteUserEmail}
                keyboardType="default"
                autoCapitalize="none"
                testID="invited-input"
              />
              <Pressable style={styles.addButton} onPress={handleAddUser} testID="invite-button">
                <Text style={styles.addbuttonText}>+</Text>
              </Pressable>
            </View>
            {invitedUsers.map((user: UserReturn) => (
              <Text key={user.id} style={styles.invitedUser}>
                {user.name}
              </Text>
            ))}
          </View>
        </KeyboardAvoidingView>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleCreateEvent} testID="create-button">
            <Text style={styles.buttonText}>Create</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFB',
  },
  cancelText: {
    color: 'red',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'right',
    fontSize: 18,
    paddingRight: 20,
    paddingTop: 50,
  },
  titleContainer: {
    padding: 20,
    width: '100%',
    flexDirection: 'row',
  },
  titleInput: {
    width: '68%',
    borderColor: '#272222',
    backgroundColor: '#272222',
    color: '#FFFFFB',
    borderWidth: 3,
    borderRadius: 24,
    fontSize: 30,
    padding: 20,
  },
  locationContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    padding: 20,
    paddingTop: 0,
    paddingBottom: 30,
  },
  locationLabel: {
    textAlign: 'left',
    color: '#FF7000',
    fontWeight: 'bold',
    fontSize: 30,
  },
  locationInput: {
    width: '100%',
    borderColor: '#272222',
    backgroundColor: '#272222',
    color: '#FFFFFB',
    fontWeight: 'bold',
    borderWidth: 3,
    borderRadius: 24,
    fontSize: 16,
    padding: 24,
  },
  dateContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 20,
  },
  dateLabel: {
    color: '#FF7000',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    fontSize: 30,
    paddingTop: 10,
    paddingRight: 10,
  },
  dateInput: {
    width: '70%',
    borderColor: '#272222',
    backgroundColor: '#272222',
    color: '#FFFFFC',
    fontWeight: 'bold',
    borderWidth: 3,
    borderRadius: 24,
    fontSize: 16,
    padding: 20,
  },
  dateText: {
    color: 'white',
    fontWeight: 'bold',
  },
  datePicker: {
    // alignSelf: 'flex-end',
    // paddingRight: 40,
    display: 'flex',
    flexDirection: 'row',
  },
  timeContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 14,
  },
  timeLabel: {
    color: '#FF7000',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    fontSize: 30,
    paddingTop: 10,
    paddingRight: 10,
  },
  timeInput: {
    width: '70%',
    borderColor: '#272222',
    backgroundColor: '#272222',
    color: '#FFFFFB',
    fontWeight: 'bold',
    borderWidth: 3,
    borderRadius: 24,
    fontSize: 16,
    padding: 20,
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  timePicker: {
    alignSelf: 'flex-end',
    paddingRight: 40,
  },
  invitedLabelContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 14,
  },
  invitedLabel: {
    color: '#FF7000',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 20,
    fontSize: 30,
  },
  usersContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#272222',
    borderWidth: 2,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
  },
  invitedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#272222',
    borderRadius: 20,
  },
  invitedInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    color: '#FFFFFB',
    fontWeight: 'bold',
    borderColor: '#272222',
    borderRadius: 24,
    borderWidth: 3,
    fontSize: 16,
    padding: 10,
  },
  invitedUser: {
    color: '#FFFFFB',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    fontSize: 20,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#FF7000',
    alignItems: 'center',
    height: '70%',
    width: '10%',
    borderRadius: 24,
  },
  addbuttonText: {
    textAlign: 'center',
    color: '#FFFFFB',
    fontWeight: 'bold',
    fontSize: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 45,
  },
  button: {
    width: '40%',
    backgroundColor: '#FF7000',
    borderRadius: 12,
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFB',
    fontWeight: 'bold',
    fontSize: 24,
    margin: 5,
  },
});
