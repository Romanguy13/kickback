import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Timestamp } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Alert } from 'react-native';
import moment from 'moment';
import EventDetail from '../../../navigation/screens/EventDetail';
import Events from '../../../resources/api/events';
import preLoadData from '../helper/EventDetails.helper';

jest.mock('../../../resources/api/events');
jest.mock('../../../resources/api/groupMembers');
jest.mock('../../../resources/api/groups');
jest.mock('../../../resources/api/users');
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigation: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));
jest.mock('../../../../firebaseConfig');
jest.mock('firebase/auth');
jest.spyOn(Alert, 'alert');
interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

const currentUser: FirebaseUser = {
  uid: '4',
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

const Stack = createNativeStackNavigator();

const renderWithNavigation = async (params: any) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventDetail" component={EventDetail} initialParams={{ ...params }} />
      </Stack.Navigator>
    </NavigationContainer>
  );

const params = {
  event: {
    hostId: '2',
    name: 'Test Event with a Longer Name!',
    datetime: Timestamp.fromDate(moment('2023-07-28 12:00:00', 'YYYY-MM-DD hh:mm:ss').toDate()),
    location: 'Test Location',
    gId: '1',
    inviteeStatus: [
      {
        id: '1',
        status: null,
      },
      {
        id: '2',
        status: null,
      },
      {
        id: '3',
        status: null,
      },
      {
        id: '4',
        status: null,
      },
    ],
  },
  canVote: true,
};

const params2 = {
  event: {
    hostId: '4',
    name: 'Test Event',
    datetime: Timestamp.fromDate(moment('2023-07-28 12:00:00', 'YYYY-MM-DD hh:mm:ss').toDate()),
    location: 'Test Location',
    gId: '1',
    inviteeStatus: [
      {
        id: '1',
        status: true,
      },
      {
        id: '2',
        status: true,
      },
      {
        id: '3',
        status: true,
      },
      {
        id: '4',
        status: null,
      },
    ],
  },
  canVote: true,
};

test('Renders Event Screen', async () => {
  preLoadData();

  await renderWithNavigation(params2);

  const timeLeft = params2.event.datetime.toDate().getTime() - new Date().getTime();
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  expect(screen.getByText('Time Remaining')).toBeTruthy();
  expect(screen.getByText(`${days}`)).toBeTruthy();
  expect(screen.getByTestId(`colon-1`)).toBeTruthy();
  expect(screen.getByText(`${hours}`)).toBeTruthy();
  expect(screen.getByTestId(`colon-2`)).toBeTruthy();
  expect(screen.getByText(`${minutes}`)).toBeTruthy();
  expect(screen.getByText(`DAY`)).toBeTruthy();
  expect(screen.getByText(`HR`)).toBeTruthy();
  expect(screen.getByText(`MIN`)).toBeTruthy();
  expect(screen.getByText('Test Event')).toBeTruthy();
  expect(screen.getByText('Test Location')).toBeTruthy();
  expect(screen.getByText('July 28, 2023')).toBeTruthy();

  // Checking to see if all users are there
  await waitFor(() => {
    expect(screen.getByText('Chief')).toBeTruthy();
    expect(screen.getByText('keshi')).toBeTruthy();
    expect(screen.getByText('Richy')).toBeTruthy();
    expect(screen.getByText('Kung')).toBeTruthy();
  });
});

test('Render Long Name', async () => {
  preLoadData();

  await renderWithNavigation(params);

  expect(screen.getByText('Test Event with a Longer Name!')).toBeTruthy();
});

test('Click accept for status update', async () => {
  preLoadData();

  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '1',
    status: true,
  });

  preLoadData();

  await renderWithNavigation(params);

  await waitFor(() => {
    expect(screen.getByText('Chief')).toBeTruthy();
  });

  act(() => {
    fireEvent.press(screen.getByTestId('accept-invite'));
  });
});

test('Click decline for status update', async () => {
  preLoadData();

  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '1',
    status: false,
  });

  preLoadData();

  await renderWithNavigation(params);
  await waitFor(() => {
    expect(screen.getByText('Test Location')).toBeTruthy();
  });

  fireEvent.press(screen.getByTestId('decline-invite'));
});

test('Click Delete Event Button As Host - Success', async () => {
  preLoadData();

  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '4',
    status: null,
  });

  preLoadData();

  await renderWithNavigation(params2);

  await waitFor(() => {
    expect(screen.getByTestId('delete-label')).toBeTruthy();
    fireEvent.press(screen.getByTestId('delete-button'));
    fireEvent.press(screen.getByTestId('no-modal'));
    fireEvent.press(screen.getByTestId('delete-button'));
    fireEvent.press(screen.getByTestId('yes-modal'));
  });
  expect(Alert.alert).toHaveBeenCalledWith('Success!', 'Event deleted.');
});

test('Click Delete Event Button As Host - Fail', async () => {
  preLoadData();
  (Events.prototype.delete as jest.Mock).mockRejectedValue(new Error('test error'));

  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '4',
    status: null,
  });

  preLoadData();

  await renderWithNavigation(params2);

  await waitFor(() => {
    expect(screen.getByTestId('delete-label')).toBeTruthy();
    fireEvent.press(screen.getByTestId('delete-button'));
    fireEvent.press(screen.getByTestId('no-modal'));
    fireEvent.press(screen.getByTestId('delete-button'));
    fireEvent.press(screen.getByTestId('yes-modal'));
  });
  expect(Alert.alert).toHaveBeenCalledWith(
    'Error',
    'Something went wrong. Please try again later.'
  );
});

test('Click the "Go Back" button', async () => {
  preLoadData();

  await renderWithNavigation(params);

  fireEvent.press(screen.getByLabelText('Back Button'));
});
