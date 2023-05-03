import { render, waitFor } from '@testing-library/react-native';
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
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      id: '123',
      hostId: '123',
      name: 'string',
      location: 'string',
      date: 'string',
      time: 'string',
      gId: '123',
    },
  ] as EventReturn[]);

  renderWithNavigation();

  // Required to wait for the screen to load
  await waitFor(() => {
    // TODO: Components should appear here
  });
});
