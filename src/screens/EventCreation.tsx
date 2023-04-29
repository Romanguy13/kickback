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

export default function EventCreation({ navigation }: any) {
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [inviteUserEmail, setInviteUserEmail] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]); // [email1, email2, ...

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
    if (invitedUsers.includes(inviteUserEmail)) {
      Alert.alert('User already invited.');
      return;
    }
    const user = new Users();
    user.getUserIdByEmail(inviteUserEmail).then((id) => {
      if (!id) {
        Alert.alert('User does not exist.');
      }
    });
    setInvitedUsers([...invitedUsers, inviteUserEmail]);
    setInviteUserEmail('');
  };

  const handleCreateEvent = () => {
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
    const user = new Users();
    user.getUserIdByEmail(userEmail).then((id) => {
      if (!id) {
        Alert.alert('Please log in.');
        return;
      }
      const event: EventModel = {
        hostId: id,
        hostEmail: userEmail,
        name: eventTitle,
        location: eventLocation,
        date: eventDate,
        time: eventTime,
        invitedUsers,
      };

      const Event = new Events();
      Event.create(event).then((eventId) => {
        if (!eventId) {
          Alert.alert('Error creating event.');
          return;
        }
        navigation.navigate('EventFeed');
      });
    });
    // create event
  };
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('EventFeed')}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
        <KeyboardAvoidingView behavior="padding" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
          <View style={styles.titleContainer}>
            <TextInput
              style={styles.titleInput}
              value={eventTitle}
              onChangeText={handleEventTitleChange}
              keyboardType="default"
              placeholder="Event Title"
              placeholderTextColor="#FF7000"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Location</Text>
            <TextInput
              style={styles.locationInput}
              value={eventLocation}
              onChangeText={handleEventLocationChange}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Date</Text>
            <TextInput
              style={styles.dateInput}
              value={eventDate}
              onChangeText={handleEventDateChange}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Time</Text>
            <TextInput
              style={styles.timeInput}
              value={eventTime}
              onChangeText={handleEventTimeChange}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.invitedLabel}>Who&apos;s Invited</Text>
          </View>
          <View style={styles.usersContainer}>
            <View style={styles.invitedContainer}>
              <TextInput
                style={styles.invitedInput}
                value={inviteUserEmail}
                onChangeText={handleInviteUserEmailChange}
                keyboardType="default"
                autoCapitalize="none"
              />
              <Pressable style={styles.addButton} onPress={handleAddUser}>
                <Text style={styles.addbuttonText}>+</Text>
              </Pressable>
            </View>
            {invitedUsers.map((user) => (
              <Text key={user} style={styles.invitedUser}>
                {user}
              </Text>
            ))}
          </View>
        </KeyboardAvoidingView>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleCreateEvent}>
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
