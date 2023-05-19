import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, View } from 'react-native';
import React from 'react';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import EventFeed from '../../../navigation/screens/EventFeed';
import { EventReturn } from '../../../resources/schema/event.model';
import Events from '../../../resources/api/events';
import GroupMembers from '../../../resources/api/groupMembers';

jest.spyOn(Alert, 'alert');

jest.mock('firebase/auth');

// jest.mock('firebase/firestore');

jest.mock('../../../resources/api/events');

jest.mock('../../../resources/api/groupMembers');

const mockUseIsFocused = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: () => mockUseIsFocused(),
  };
});

const Stack = createNativeStackNavigator();
function MockDetail(): JSX.Element {
  return <View />;
}

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

const currentUser: FirebaseUser = {
  uid: '12345',
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
const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventFeed" component={EventFeed} />
        <Stack.Screen name="EventDetail" component={MockDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders Event Feed Screen - No events', async () => {
  // Set up the mock return value for getAll
  (Events.prototype.getAllByUserId as jest.Mock).mockResolvedValue([] as EventReturn[]);

  renderWithNavigation();

  // Required to wait for the screen to load
  await waitFor(() => {
    expect(screen.getByText("Let's start a KickBack!")).toBeTruthy();
  });
});

test('Renders Event Feed Screen - With events', async () => {
  const randomDatetime = moment('2029-08-25T17:00:00.000Z', 'YYYY-MM-DDTHH:mm:ss.SSS');
  console.log('Timestamp', Timestamp.fromDate(randomDatetime.toDate()));

  // Set up the mock return value for getAll
  (Events.prototype.getAllByUserId as jest.Mock).mockResolvedValueOnce([
    {
      id: '123',
      hostId: '123',
      name: 'SURL Concert',
      location: 'San Francisco',
      datetime: Timestamp.fromDate(randomDatetime.toDate()),
      gId: '123',
    },
  ] as EventReturn[]);

  mockUseIsFocused.mockReturnValue(true); // or false

  renderWithNavigation();

  // Required to wait for the screen to load
  await waitFor(() => {
    expect(screen.getByText('SURL Concert')).toBeTruthy();
    expect(screen.getByText('San Francisco')).toBeTruthy();
    expect(screen.getByText('August 25, 2029')).toBeTruthy();
    expect(screen.getByText('5:00 PM')).toBeTruthy();
  });
});

test('Transitioning from Event Card to Event Details', async () => {
  const randomDatetime = moment('2029-07-29T21:00:00.000', 'YYYY-MM-DDTHH:mm:ss.SSS');
  console.log('Timestamp', Timestamp.fromDate(randomDatetime.toDate()));

  // Set up the mock return value for getAll
  (Events.prototype.getAllByUserId as jest.Mock).mockResolvedValueOnce([
    {
      id: '123',
      hostId: '12345',
      name: 'Taylor Swift Concert',
      location: 'San Diego, CA',
      datetime: Timestamp.fromDate(randomDatetime.toDate()),
      gId: '123',
      inviteeStatus: [
        {
          id: '123',
          status: false,
        },
      ],
      createdAt: Timestamp.fromDate(new Date('2023-08-01T00:00:00.000Z')),
      updatedAt: Timestamp.fromDate(new Date('2023-08-01T00:00:00.000Z')),
    },
  ] as EventReturn[]);

  mockUseIsFocused.mockReturnValue(true); // or false

  renderWithNavigation();

  // Required to wait for the screen to load
  await waitFor(() => {
    expect(screen.getByText('Taylor Swift Concert')).toBeTruthy();
    expect(screen.getByText('San Diego, CA')).toBeTruthy();
    expect(screen.getByText('July 29, 2029')).toBeTruthy();
    expect(screen.getByText('9:00 PM')).toBeTruthy();
  });

  // Click on the event card
  const eventCard = screen.getByText('Taylor Swift Concert');

  await fireEvent.press(eventCard);
});
