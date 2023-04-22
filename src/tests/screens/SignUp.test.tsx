import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserCredential, createUserWithEmailAndPassword } from 'firebase/auth';
import { DocumentData, DocumentReference, addDoc, doc, setDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import SignUp from '../../screens/SignUp';
import Login from '../../screens/Login';
import Welcome from '../../screens/Welcome';

jest.spyOn(Alert, 'alert');

jest.mock('firebase/auth');

jest.mock('firebase/firestore');

const Stack = createNativeStackNavigator();

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Welcome" component={Welcome} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders Login Screen', async () => {
  renderWithNavigation();
  expect(screen.getByText('Create Account')).toBeTruthy();
  expect(screen.getByText('Welcome to KickBack!')).toBeTruthy();
  expect(screen.getByText('Name')).toBeTruthy();
  expect(screen.getByPlaceholderText('First Last')).toBeTruthy();
  expect(screen.getByText('Email')).toBeTruthy();
  expect(screen.getByPlaceholderText('kickback@email.com')).toBeTruthy();
  expect(screen.getByText('Password')).toBeTruthy();
  expect(screen.getByPlaceholderText('mypassword123')).toBeTruthy();
  expect(screen.getByText('Confirm Password')).toBeTruthy();
  expect(screen.getByPlaceholderText('retype password')).toBeTruthy();
  expect(screen.getByText('Sign Up')).toBeTruthy();
  expect(screen.getByText('Already have an account? ')).toBeTruthy();
  expect(screen.getByText('Login!')).toBeTruthy();
});

test('Navigate to Login', async () => {
  renderWithNavigation();
  const signUpButton = screen.getByText('Login!');
  fireEvent.press(signUpButton);
  expect(screen.getByText('Login')).toBeTruthy();
});

test('Sign Up with no name', async () => {
  renderWithNavigation();
  const signUpButton = screen.getByText('Sign Up');
  fireEvent.press(signUpButton);
  expect(Alert.alert).toHaveBeenCalled();
});

test('Sign Up with mismatched passwords', async () => {
  renderWithNavigation();
  const nameInput = screen.getByPlaceholderText('First Last');
  const emailInput = screen.getByPlaceholderText('kickback@email.com');
  const passwordInput = screen.getByPlaceholderText('mypassword123');
  const confirmPasswordInput = screen.getByPlaceholderText('retype password');
  const signUpButton = screen.getByText('Sign Up');

  fireEvent.changeText(nameInput, 'Mia Moderator');
  fireEvent.changeText(emailInput, 'mia@kickback.com');
  fireEvent.changeText(passwordInput, 'mypassword123');
  fireEvent.changeText(confirmPasswordInput, 'mypassword1234');

  fireEvent.press(signUpButton);

  expect(Alert.alert).toHaveBeenCalled();
});

test('Sign Up', async () => {
  renderWithNavigation();
  const nameInput = screen.getByPlaceholderText('First Last');
  const emailInput = screen.getByPlaceholderText('kickback@email.com');
  const passwordInput = screen.getByPlaceholderText('mypassword123');
  const confirmPasswordInput = screen.getByPlaceholderText('retype password');
  const signUpButton = screen.getByText('Sign Up');

  fireEvent.changeText(nameInput, 'Mia Moderator');
  fireEvent.changeText(emailInput, 'mia@kickback.com');
  fireEvent.changeText(passwordInput, 'mypassword123');
  fireEvent.changeText(confirmPasswordInput, 'mypassword123');

  (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
    user: {
      uid: '12345',
      email: 'test@exmaple.com',
    },
  } as UserCredential);
  (doc as jest.Mock).mockResolvedValue({
    id: 'something',
  } as DocumentReference<DocumentData>);

  (addDoc as jest.Mock).mockResolvedValue({
    id: 'testId',
  } as DocumentReference<unknown>);

  fireEvent.press(signUpButton);

  await waitFor(() => {
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
  });
});

test('Sign Up error', async () => {
  renderWithNavigation();
  const nameInput = screen.getByPlaceholderText('First Last');
  const emailInput = screen.getByPlaceholderText('kickback@email.com');
  const passwordInput = screen.getByPlaceholderText('mypassword123');
  const confirmPasswordInput = screen.getByPlaceholderText('retype password');
  const signUpButton = screen.getByText('Sign Up');

  fireEvent.changeText(nameInput, 'Mia Moderator');
  fireEvent.changeText(emailInput, 'mia@kickback.com');
  fireEvent.changeText(passwordInput, 'mypassword123');
  fireEvent.changeText(confirmPasswordInput, 'mypassword123');

  (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
    message: 'Error',
  });

  fireEvent.press(signUpButton);

  await waitFor(() => {
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalled();
  });
});
