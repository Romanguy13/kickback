import { render, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, View } from 'react-native';
import React from 'react';
import EventHistory from '../../../navigation/screens/EventHistory';
import { EventReturn } from '../../../resources/schema/event.model';
import Events from '../../../resources/api/events';

jest.spyOn(Alert, 'alert');

jest.mock('firebase/auth');

jest.mock('firebase/firestore');

jest.mock('../../../resources/api/events');

const mockUseIsFocused = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: () => mockUseIsFocused(),
  };
});

const Stack = createNativeStackNavigator();
function MockLogin(): JSX.Element {
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
        <Stack.Screen name="EventFeed" component={EventHistory} />
        <Stack.Screen name="Login" component={MockLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders History Screen - With events', async () => {
  // Set up the mock return value for getAll
  (Events.prototype.getAllByUserId as jest.Mock).mockResolvedValueOnce([
    {
      id: '123',
      hostId: '123',
      name: 'Event Title',
      location: 'Event Location',
      date: 'March 23, 2023',
      time: '5:00 PM',
      gId: '123',
    },
  ] as EventReturn[]);

  mockUseIsFocused.mockReturnValue(true); // or false

  renderWithNavigation();

  // Required to wait for the screen to load
  await waitFor(() => {
    expect(screen.getByText('Previous KickBacks')).toBeTruthy();
    expect(screen.getByText('Event Title')).toBeTruthy();
    expect(screen.getByText('Event Location')).toBeTruthy();
  });
});

/**
 * Despite the fact that the mockUseIsFocused is set to false, the screen still renders
 * However it does not render the data that is passed.
 * Look at the test above for the same screen with the same data, but with mockUseIsFocused set to true
 * to which IT IS rendered.
 */
test('Renders History Screen - No update', async () => {
  // Set up the mock return value for getAll
  (Events.prototype.getAllByUserId as jest.Mock).mockResolvedValueOnce([
    {
      id: '123',
      hostId: '123',
      name: 'Event Title',
      location: 'Event Location',
      date: 'March 23, 2023',
      time: '5:00 PM',
      gId: '123',
    },
  ] as EventReturn[]);

  mockUseIsFocused.mockReturnValue(false);

  renderWithNavigation();

  // Required to wait for the screen to load
  await waitFor(() => {
    expect(screen.getByText('Previous KickBacks')).toBeTruthy();
    expect(screen.queryByText('Event Title')).toBeNull();
    expect(screen.queryByText('Event Location')).toBeNull();
  });
});
