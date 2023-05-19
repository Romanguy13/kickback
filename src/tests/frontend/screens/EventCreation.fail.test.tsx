import { Timestamp } from 'firebase/firestore';
import { render, waitFor } from '@testing-library/react-native';
import { Alert, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { UserReturn } from '../../../resources/schema/user.model';
import Users from '../../../resources/api/users';
import { helpFillInEventCreationForm } from '../helper/EventCreation.helper';
import EventCreation from '../../../navigation/screens/EventCreation';

jest.spyOn(Alert, 'alert');

jest.mock('firebase/auth');

jest.mock('firebase/firestore');

jest.mock('../../../resources/api/events');

jest.mock('../../../resources/api/users');

jest.mock('../../../resources/api/groupMembers');

jest.mock('../../../resources/api/groups');

jest.mock('../../../../firebaseConfig', () => ({
  FB_AUTH: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    currentUser: null,
  },
}));

function MockFeed(): JSX.Element {
  return <View />;
}

const Stack = createNativeStackNavigator();

const renderWithNavigation = async () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventCreation" component={EventCreation} />
        <Stack.Screen name="Feed" component={MockFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Inviting Members - User not Logged-in - Error', async () => {
  const randomHuman: UserReturn = {
    id: '23453',
    email: 'Random Human',
    name: 'Random Human',
    updatedAt: new Date() as unknown as Timestamp,
    createdAt: new Date() as unknown as Timestamp,
  };

  // User to invite
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(randomHuman as UserReturn);

  await renderWithNavigation();

  await helpFillInEventCreationForm([randomHuman], false);

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Please log in.');
  });
});
