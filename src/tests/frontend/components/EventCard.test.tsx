import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, View } from 'react-native';
import React from 'react';
import { Timestamp } from 'firebase/firestore';
import EventCard from '../../../components/EventCard';

const status1 = [
  {
    id: '12346',
    status: null,
  },
  {
    id: '12347',
    status: null,
  },
];

const status2 = [
  {
    id: '12346',
    status: null,
  },
  {
    id: '12347',
    status: true,
  },
];

const renderSimple = async (status: any) =>
  render(
    <EventCard
      event={{
        id: '12345',
        hostId: '12346',
        name: 'Test Event',
        location: 'Test Location',
        date: '10/10/2023',
        time: '10:00',
        gId: '12347',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        inviteeStatus: status,
      }}
      navigation={{
        navigate: jest.fn(),
      }}
    />
  );

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

const currentUser: FirebaseUser = {
  uid: '12347',
  email: 'john@wick.com',
  displayName: 'John Wick',
  emailVerified: true,
};

jest.mock('../../../../firebaseConfig', () => ({
  FB_AUTH: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    currentUser,
  },
}));

test('Renders Event Card', async () => {
  await renderSimple(status1);

  expect(screen.getByText('Test Event')).toBeTruthy();
  expect(screen.getByText('Test Location')).toBeTruthy();
  expect(screen.getByText('10:00')).toBeTruthy();
  expect(screen.getByText('10/10/2023')).toBeTruthy();
  expect(screen.getByText('pending')).toBeTruthy();
});

test('Click Event Card', async () => {
  await renderSimple(status1);

  expect(screen.getByText('Test Event')).toBeTruthy();
  expect(screen.getByText('Test Location')).toBeTruthy();
  expect(screen.getByText('10:00')).toBeTruthy();
  expect(screen.getByText('10/10/2023')).toBeTruthy();
  expect(screen.getByText('pending')).toBeTruthy();
  await fireEvent.press(screen.getByText('Test Event'));
});

test('Participant is going', async () => {
  await renderSimple(status2);

  expect(screen.getByText('Test Event')).toBeTruthy();
  expect(screen.getByText('Test Location')).toBeTruthy();
  expect(screen.getByText('10:00')).toBeTruthy();
  expect(screen.getByText('10/10/2023')).toBeTruthy();
  expect(screen.getByText('going')).toBeTruthy();
});

// will need to update tests to check when the status changes to going
