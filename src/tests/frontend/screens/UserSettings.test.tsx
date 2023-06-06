import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { updateEmail, updatePassword, reauthenticateWithCredential, signOut } from 'firebase/auth';
import { Alert } from 'react-native';
import UserSettings from '../../../navigation/screens/UserSettings';
import Users from '../../../resources/api/users';
import { FB_AUTH } from '../../../../firebaseConfig';

// mocks the firebase user object for type checking
interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

// mocks the current user object
const currentUser: FirebaseUser = {
  uid: '1',
  email: 'john@wick.com',
  displayName: 'John Wick',
  emailVerified: true,
};

jest.mock('../../../resources/api/users');

// mocks the navigation container passed down from App.tsx
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigation: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// mocks the Alert component
jest.spyOn(Alert, 'alert');

// mocks the firebaseConfig file that contains the firebase auth object
jest.mock('../../../../firebaseConfig');

// mocks the firebase auth object
jest.mock('firebase/auth');

jest.mock('../../../../firebaseConfig', () => ({
  FB_AUTH: {
    reauthenticateWithCredential: jest.fn(),
    updateEmail: jest.fn(),
    signOut: jest.fn().mockImplementation(() => Promise.resolve()),
    updatePassword: jest.fn(),
  },
}));

// creates a stack navigator to wrap the UserSettings screen
const Stack = createNativeStackNavigator();

// renders the UserSettings screen with the stack navigator
const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="UserSettings" component={UserSettings} />
      </Stack.Navigator>
    </NavigationContainer>
  );

// tests the UserSettings screen with a signed in user
test('Renders User Settings Screen with signed in user email', async () => {
  (FB_AUTH.currentUser as FirebaseUser) = currentUser;
  renderWithNavigation();
  expect(screen.getByText('User Settings')).toBeTruthy();
  expect(screen.getByText('john@wick.com')).toBeTruthy();
});

/*
Test to verify a user can update their name.
Expects an alert to be called with the success message.
*/
test('Change Name - Success', async () => {
  // mocks the updateEmail function to return a success
  (Users.prototype.edit as jest.Mock).mockImplementationOnce(() => Promise.resolve());

  // mocks the current user object
  (FB_AUTH.currentUser as FirebaseUser) = {
    ...currentUser,
    displayName: 'John',
  };

  renderWithNavigation();
  fireEvent.changeText(screen.getByTestId('new-name-input'), 'John');
  fireEvent.press(screen.getByTestId('update-button'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

  // verifies that the updateEmail function was called
  expect(Users.prototype.edit).toHaveBeenCalled();
});

/*
Change email unexpected error
*/
test('Change Email - Error', async () => {
  // mocks the updateEmail function to return a success
  (updateEmail as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('error')));
  (Users.prototype.edit as jest.Mock).mockImplementationOnce(() => Promise.resolve());

  // mocks the current user object
  (FB_AUTH.currentUser as FirebaseUser) = {
    ...currentUser,
    email: 'john@wick.com',
  };

  renderWithNavigation();
  fireEvent.changeText(screen.getByTestId('new-email-input'), 'john@test.com');
  fireEvent.press(screen.getByTestId('update-button'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
});

/*
Test to verify a user can update their email.
Expects an alert to be called with the success message.
Expects the email to be updated on the screen.
*/
test('Change Email - Success', async () => {
  // mocks the updateEmail function to return a success
  (updateEmail as jest.Mock).mockImplementationOnce(() => Promise.resolve());
  (Users.prototype.edit as jest.Mock).mockImplementationOnce(() => Promise.resolve());

  // mocks the current user object
  (FB_AUTH.currentUser as FirebaseUser) = {
    ...currentUser,
    email: 'john@new.com',
  };

  renderWithNavigation();
  fireEvent.changeText(screen.getByTestId('new-email-input'), 'john@new.com');
  fireEvent.press(screen.getByTestId('update-button'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

  // verifies that the updateEmail function was called
  expect(updateEmail).toHaveBeenCalled();
  // verifies that the email was updated
  expect(screen.getByText('john@new.com')).toBeTruthy();
});

/*
Test to verify a user cannot change their password without entering a new password of at least 6 characters.
Expects an alert to be called with the error message.
*/
test('Change Password - New password too short', async () => {
  // mocks the updatePassword function to return an error
  (updatePassword as jest.Mock).mockImplementationOnce(() =>
    Promise.reject(new Error('shortPassword'))
  );
  (reauthenticateWithCredential as jest.Mock).mockImplementationOnce(() => Promise.resolve());

  // mocks the current user object
  (FB_AUTH.currentUser as FirebaseUser) = currentUser;

  renderWithNavigation();
  fireEvent.changeText(screen.getByTestId('current-password-input'), 'currentPassword');
  fireEvent.changeText(screen.getByTestId('new-password-input'), 'short');
  fireEvent.changeText(screen.getByTestId('confirm-new-password-input'), 'short');
  fireEvent.press(screen.getByTestId('update-button'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

  // verifies that the password was not updated
  expect(screen.queryByText('short')).toBeFalsy();
});

/*
Test to verify a user cannot change their password without entering a new password that matches the confirm password.
Expects an alert to be called with the error message.
*/
test('Change Password - New password does not match confirm password', async () => {
  // mocks the updatePassword function to return an error
  (updatePassword as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('noMatch')));
  (reauthenticateWithCredential as jest.Mock).mockImplementationOnce(() => Promise.resolve());

  // mocks the current user object
  (FB_AUTH.currentUser as FirebaseUser) = currentUser;

  renderWithNavigation();
  fireEvent.changeText(screen.getByTestId('current-password-input'), 'currentPassword');
  fireEvent.changeText(screen.getByTestId('new-password-input'), 'newPassword');
  fireEvent.changeText(screen.getByTestId('confirm-new-password-input'), 'noMatch');
  fireEvent.press(screen.getByTestId('update-button'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
});

/*
Test for verifying that a user can change their password.
Expects an alert to be called with the success message.
*/
test('Change Password - Success', async () => {
  const promise = Promise.resolve();

  (updatePassword as jest.Mock).mockImplementationOnce(() => promise);
  (reauthenticateWithCredential as jest.Mock).mockImplementationOnce(() => promise);
  // mocks the updatePassword function to return an error
  // (reauthenticateWithCredential as jest.Mock).mockImplementationOnce(() =>
  //   Promise.reject(new Error('error'))
  // );

  // mocks the current user object
  (FB_AUTH.currentUser as FirebaseUser) = currentUser;

  renderWithNavigation();
  fireEvent.changeText(screen.getByTestId('current-password-input'), 'currentPassword');
  fireEvent.changeText(screen.getByTestId('new-password-input'), 'newPassword');
  fireEvent.changeText(screen.getByTestId('confirm-new-password-input'), 'newPassword');
  fireEvent.press(screen.getByTestId('update-button'));
  await promise;
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
});

/*
Test for alternate error catching when unexpected errors occur.
Expects an alert to be called with the error message.
*/
test('Change Password - Error', async () => {
  // mocks the updatePassword function to return an error
  (updatePassword as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('error')));
  (reauthenticateWithCredential as jest.Mock).mockImplementationOnce(() =>
    Promise.reject(new Error('error'))
  );

  // mocks the current user object
  (FB_AUTH.currentUser as FirebaseUser) = currentUser;

  renderWithNavigation();
  fireEvent.changeText(screen.getByTestId('current-password-input'), 'currentPassword');
  fireEvent.changeText(screen.getByTestId('new-password-input'), 'newPassword');
  fireEvent.changeText(screen.getByTestId('confirm-new-password-input'), 'newPassword');
  fireEvent.press(screen.getByTestId('update-button'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
});

/*
Test to verify a user can change their password.
Expects an alert to be called with the success message.
*/
test('Change Password - Success', async () => {
  // mocks the updatePassword function to return a success
  (updatePassword as jest.Mock).mockResolvedValue({});

  (reauthenticateWithCredential as jest.Mock).mockResolvedValue({});

  // I am trying to make it so the .then() in the updatePassword function is called
  // but I am not sure how to do that

  // mocks the current user object
  (FB_AUTH.currentUser as FirebaseUser) = currentUser;

  renderWithNavigation();
  fireEvent.changeText(screen.getByTestId('current-password-input'), 'currentPassword');
  fireEvent.changeText(screen.getByTestId('new-password-input'), 'newPassword');
  fireEvent.changeText(screen.getByTestId('confirm-new-password-input'), 'newPassword');
  fireEvent.press(screen.getByTestId('update-button'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

  // verifies that the updatePassword function was called
  await waitFor(() => expect(updatePassword).toHaveBeenCalled());
  await waitFor(() => expect(reauthenticateWithCredential).toHaveBeenCalled());
  expect(updatePassword).toHaveBeenCalled();

  expect(reauthenticateWithCredential).toHaveBeenCalled();

  // verifies that the password was updated
});

/*
Test to verify error handling when a user tries to logout.
Expects an alert to be called with the error message.
*/
test('Logout - Error', async () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut as jest.Mock;
  (FB_AUTH.currentUser as FirebaseUser) = currentUser;
  renderWithNavigation();
  fireEvent.press(screen.getByTestId('log-out-button'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
});

/*
Test to verify a user can logout.
Expects an alert to be called with the success message.
*/
test('Logout - Success', async () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (signOut as jest.Mock).mockImplementationOnce(() => Promise.resolve());

  (FB_AUTH.currentUser as FirebaseUser) = currentUser;
  renderWithNavigation();
  fireEvent.press(screen.getByTestId('log-out-button'));
  await waitFor(() => expect(screen.getByTestId('logout-modal')).toBeTruthy());
  fireEvent.press(screen.getByTestId('log-out-confirm-button'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
});

/*
Test to click the back button.
Expects the navigation to go back to the previous screen.
*/
test('Back Button', async () => {
  (FB_AUTH.currentUser as FirebaseUser) = currentUser;
  useNavigation as jest.Mock;
  renderWithNavigation();
  fireEvent.press(screen.getByTestId('back-button'));
});
