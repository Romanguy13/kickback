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

    const event: EventModel = {
      hostId: userReturned.id,
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <KeyboardAvoidingView behavior="padding">
        <TouchableOpacity onPress={() => navigation.navigate('EventFeed')}>
          <Text style={styles.noAccountShortcut}>Cancel</Text>
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
  noAccountShortcut: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'right',
    marginRight: 20,
  },
  titleContainer: {
    justifyContent: 'flex-start',
    padding: 20,
    width: '100%',
  },
  titleInput: {
    width: '68%',
    borderWidth: 3,
    borderColor: '#272222',
    borderRadius: 24,
    backgroundColor: '#272222',
    fontSize: 30,
    padding: 20,
    color: '#FFFFFB',
  },
  locationContainer: {
    justifyContent: 'flex-start',
    paddingTop: 0,
    padding: 20,
    paddingBottom: 30,
    width: '100%',
  },
  locationLabel: {
    fontSize: 30,
    textAlign: 'left',
    paddingBottom: 10,
    color: '#FF7000',
    fontWeight: 'bold',
  },
  locationInput: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#272222',
    borderRadius: 24,
    backgroundColor: '#272222',
    color: '#FFFFFB',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 24,
  },
  dateContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 20,
  },
  dateLabel: {
    fontSize: 30,
    color: '#FF7000',
    fontWeight: 'bold',
    paddingTop: 10,
    paddingRight: 10,
    flexWrap: 'wrap',
  },
  dateInput: {
    width: '70%',
    borderWidth: 3,
    borderColor: '#272222',
    borderRadius: 24,
    backgroundColor: '#272222',
    color: '#FFFFFB',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 20,
  },
  timeContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 14,
  },
  timeLabel: {
    fontSize: 30,
    color: '#FF7000',
    fontWeight: 'bold',
    paddingTop: 10,
    paddingRight: 10,
    flexWrap: 'wrap',
  },
  timeInput: {
    width: '70%',
    borderWidth: 3,
    borderColor: '#272222',
    borderRadius: 24,
    backgroundColor: '#272222',
    color: '#FFFFFB',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 20,
  },
  invitedContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 10,
  },
  invitedLabel: {
    fontSize: 30,
    color: '#FF7000',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    marginLeft: 20,
    marginTop: 20,
  },
  invitedInput: {
    width: '70%',
    borderWidth: 3,
    borderColor: '#272222',
    borderRadius: 24,
    backgroundColor: '#272222',
    color: '#FFFFFB',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 20,
    marginRight: 10,
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: 50,
  },
  button: {
    width: '50%',
    borderRadius: 16,
    backgroundColor: '#FF7000',
    padding: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#272222',
    fontSize: 24,
    margin: 5,
    fontWeight: 'bold',
  },
  addButton: {
    width: '20%',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#FF7000',
    padding: 5,
  },
  invitedUser: {
    fontSize: 20,
    color: '#FF7000',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    marginLeft: 20,
    marginTop: 5,
  },
});
