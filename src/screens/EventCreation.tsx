import React, { useState } from 'react';
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
} from 'react-native';
import { EventModel } from '../resources/schema/event.model';
import { FB_AUTH } from '../../firebaseConfig';
import Users from '../resources/api/users';
import Events from '../resources/api/events';
import Groups from "../resources/api/groups";
import GroupMembers from "../resources/api/groupMembers";
import {UserReturn} from "../resources/schema/user.model";

export default function EventCreation({ navigation }: any) {
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [inviteUserEmail, setInviteUserEmail] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<UserReturn[]>([]); // [email1, email2, ...

  const handleEventTitleChange = (text: string) => {
    setEventTitle(text);
  };

  const handleEventLocationChange = (text: string) => {
    setEventLocation(text);
  };

  const handleEventDateChange = (text: string) => {
    setEventDate(text);
  };

  const handleEventTimeChange = (text: string) => {
    setEventTime(text);
  };

  const handleInviteUserEmailChange = (text: string) => {
    setInviteUserEmail(text);
  };

  const handleAddUser = () => {
    // create user object and check if user exists
    if (inviteUserEmail === '') {
      Alert.alert('Please enter an email.');
      return;
    }
    if (invitedUsers.find((user: UserReturn) => user.email === inviteUserEmail)) {
      Alert.alert('User already invited.');
      return;
    }
    if (inviteUserEmail === FB_AUTH.currentUser?.email) {
      Alert.alert('You cannot invite yourself, silly goose.');
      return;
    }

    const user = new Users();
    user.getUserByEmail(inviteUserEmail).then((currUser: UserReturn) => {
      setInvitedUsers([...invitedUsers, currUser]);
      setInviteUserEmail('');
    }).catch(() => {
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

    // Create Group
    const gId: string = await new Groups().create({name: 'Same Group Name'});

    // Add the users to GroupMember
    invitedUsers.map(async (currUser: UserReturn) => {
      await new GroupMembers().create({
        userId: currUser.id,
        groupId: gId,
      });
    });

    // Also add in the host as a group member
    await new GroupMembers().create({
      userId: FB_AUTH.currentUser?.uid as string,
      groupId: gId,
    });

    // Event Model for later use
    const event: EventModel = {
      hostId: FB_AUTH.currentUser?.uid as string,
      name: eventTitle,
      location: eventLocation,
      date: eventDate,
      time: eventTime,
      gId,
    };

    // Create event
    const Event = new Events();
    Event.create(event).then(() => {
      navigation.navigate('EventFeed');
    }).catch(() => {
      Alert.alert('Error creating event.');
    });
  };
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('EventFeed')}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.titleContainer}>
        <TextInput
          style={styles.titleInput}
          value={eventTitle}
          onChangeText={handleEventTitleChange}
          keyboardType="default"
          placeholder="Event Title"
          placeholderTextColor="#FF7000"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.locationContainer} behavior="padding">
        <Text style={styles.locationLabel}>Location</Text>
        <TextInput
          style={styles.locationInput}
          value={eventLocation}
          onChangeText={handleEventLocationChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.dateContainer} behavior="padding">
        <Text style={styles.dateLabel}>Date</Text>
        <TextInput
          style={styles.dateInput}
          value={eventDate}
          onChangeText={handleEventDateChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.timeContainer} behavior="padding">
        <Text style={styles.timeLabel}>Time</Text>
        <TextInput
          style={styles.timeInput}
          value={eventTime}
          onChangeText={handleEventTimeChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <Text style={styles.invitedLabel}>Invite User</Text>
      <KeyboardAvoidingView style={styles.invitedContainer} behavior="padding">
        <TextInput
          style={styles.invitedInput}
          value={inviteUserEmail}
          onChangeText={handleInviteUserEmailChange}
          keyboardType="default"
          autoCapitalize="none"
        />
        <Pressable style={styles.addButton} onPress={handleAddUser}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </KeyboardAvoidingView>
      {invitedUsers.map((user: UserReturn) => (
        <Text key={user.id} style={styles.invitedUser}>
          {user.name}
        </Text>
      ))}
      <KeyboardAvoidingView style={styles.buttonContainer} behavior="padding">
        <Pressable style={styles.button} onPress={handleCreateEvent}>
          <Text style={styles.buttonText}>Create</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
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
    justifyContent: 'flex-start',
    padding: 20,
    width: '100%',
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
    color: '#FFFFFB',
    fontWeight: 'bold',
    borderWidth: 3,
    borderRadius: 24,
    fontSize: 16,
    padding: 20,
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
    color: '#272222',
    fontWeight: 'bold',
    fontSize: 24,
    margin: 5,
  },
});
