import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';

export default function EventCreation({ navigation }: any) {
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
          //value={userEmail}
          //onChangeText={handleUserEmailChange}
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
          //value={userEmail}
          //onChangeText={handleUserEmailChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.dateContainer} behavior="padding">
        <Text style={styles.dateLabel}>Date</Text>
        <TextInput
          style={styles.dateInput}
          //value={userEmail}
          //onChangeText={handleUserEmailChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.timeContainer} behavior="padding">
        <Text style={styles.timeLabel}>Time</Text>
        <TextInput
          style={styles.timeInput}
          //value={userEmail}
          //onChangeText={handleUserEmailChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.invitedContainer} behavior="padding">
        <Text style={styles.invitedLabel}>Who's Invited?</Text>
        <TextInput
          style={styles.invitedInput}
          //value={userEmail}
          //onChangeText={handleUserEmailChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.buttonContainer} behavior="padding">
        <Pressable style={styles.button}>
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
    alignItems: 'center',
    paddingTop: 30,
  },
  invitedLabel: {
    fontSize: 30,
    color: '#FF7000',
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  invitedInput: {
    width: '80%',
    borderWidth: 3,
    borderColor: '#272222',
    borderRadius: 24,
    backgroundColor: '#272222',
    color: '#FFFFFB',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 60,
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
});
