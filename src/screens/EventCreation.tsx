import React from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, KeyboardAvoidingView } from 'react-native';

export default function EventCreation({ navigation }: any) {
  return (
    <KeyboardAvoidingView style={styles.container}>
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
      <KeyboardAvoidingView style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Location</Text>
        <TextInput
          style={styles.locationInput}
          //value={userEmail}
          //onChangeText={handleUserEmailChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date</Text>
        <TextInput
          style={styles.dateInput}
          //value={userEmail}
          //onChangeText={handleUserEmailChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Time</Text>
        <TextInput
          style={styles.timeInput}
          //value={userEmail}
          //onChangeText={handleUserEmailChange}
          keyboardType="default"
          autoCapitalize="none"
        />
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFB',
  },
  textContainer: {
    padding: 30,
  },
  text: {
    color: '#11111',
    fontSize: 70,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
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
    color: '#272222',
    fontSize: 30,
    padding: 20,
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
    color: '#272222',
    fontSize: 16,
    padding: 20,
  },
  dateContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
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
    color: '#272222',
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
    color: '#272222',
    fontSize: 16,
    padding: 20,
  },
});
