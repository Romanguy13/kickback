import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Timestamp } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Alert } from 'react-native';
import moment from 'moment';
import Events from '../../../resources/api/events';
import EventHistoryDetail from '../../../navigation/screens/EventHistoryDetail';
import EventCreation from '../../../navigation/screens/EventCreation';
import preLoadData from '../helper/EventDetails.helper';
import { EventModel } from '../../../resources/schema/event.model';

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
        <Stack.Screen
          name="EventDetail"
          component={EventHistoryDetail}
          initialParams={{ ...params }}
        />
        <Stack.Screen name="EventCreation" component={EventCreation} />
      </Stack.Navigator>
    </NavigationContainer>
  );

const params: {
  event: EventModel;
} = {
  event: {
    hostId: '2',
    name: 'Test Event with a Longer Name!',
    datetime: Timestamp.fromDate(moment('2023-07-28 12:00:00', 'YYYY-MM-DD hh:mm:ss').toDate()),
    location: 'Test Location',
    gId: '1',
    paidStatus: [
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
        status: false,
      },
      {
        id: '4',
        status: true,
      },
    ],
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
};

const params2: {
  event: EventModel;
} = {
  event: {
    hostId: '4',
    name: 'Test Event',
    datetime: Timestamp.fromDate(moment('2023-07-28 12:00:00', 'YYYY-MM-DD hh:mm:ss').toDate()),
    location: 'Test Location',
    gId: '1',
    paidStatus: [
      {
        id: '1',
        status: true,
      },
      {
        id: '2',
        status: false,
      },
      {
        id: '3',
        status: true,
      },
      {
        id: '4',
        status: false,
      },
    ],
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
};

test('Renders Event Screen', async () => {
  preLoadData();

  await renderWithNavigation(params2);

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

  expect(screen.getByText('Test Event wit..')).toBeTruthy();
});

test('Click the "Go Back" button', async () => {
  preLoadData();

  await renderWithNavigation(params);

  fireEvent.press(screen.getByLabelText('Back Button'));
});

test('Click the "Redo Event" button', async () => {
  preLoadData();

  await renderWithNavigation(params2);

  const redo = screen.getByText('Redo Event');
  fireEvent.press(redo);
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
