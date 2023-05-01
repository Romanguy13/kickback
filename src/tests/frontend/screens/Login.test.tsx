import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { Alert } from 'react-native';
import Login from '../../../screens/Login';
import Welcome from '../../../screens/Welcome';
import SignUp from '../../../screens/SignUp';
import EventFeed from '../../../screens/EventFeed';

jest.spyOn(Alert, 'alert');

jest.mock('firebase/auth');

const Stack = createNativeStackNavigator();
const MockEventFeed = jest.fn();

const renderWithNavigation = (component: React.FC) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={component} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="EventFeed" component={MockEventFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders Login Screen', async () => {
  renderWithNavigation(Login);
  expect(screen.getByText('Login')).toBeTruthy();
  expect(screen.getByText('Please sign in to your account.')).toBeTruthy();
  expect(screen.getByText('Email')).toBeTruthy();
  expect(screen.getByPlaceholderText('kickback@email.com')).toBeTruthy();
  expect(screen.getByText('Password')).toBeTruthy();
  expect(screen.getByPlaceholderText('mypassword123')).toBeTruthy();
  expect(screen.getByText("Don't have an account? ")).toBeTruthy();
  expect(screen.getByText('Sign Up!')).toBeTruthy();
});

test('Navigate to Sign Up', async () => {
  renderWithNavigation(Login);
  const signUpButton = screen.getByText('Sign Up!');
  fireEvent.press(signUpButton);
  expect(screen.getByText('Create Account')).toBeTruthy();
});

test('Login with no email', async () => {
  renderWithNavigation(Login);
  const loginButton = screen.getByText('Continue');
  fireEvent.press(loginButton);
  expect(Alert.alert).toHaveBeenCalled();
});

test('Login', async () => {
  renderWithNavigation(Login);
  // Mock the signInWithEmailAndPassword function
  (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
    user: {
      uid: '12345',
      email: 'test@exmaple.com',
    },
  } as UserCredential);

  // const mockedSignIn = jest.mocked(signInWithEmailAndPassword);
  const loginButton = screen.getByText('Continue');

  // Simulate user input
  // fireEvent.changeText(screen.getByText('Email'), 'validEmail'); without changeText
  fireEvent.changeText(screen.getByLabelText('Email'), 'test@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'password');
  fireEvent.press(loginButton);
  // Wait for the mocked function to be called
  await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalled());
});

test('Login with error', async () => {
  renderWithNavigation(Login);
  // Mock the signInWithEmailAndPassword function
  (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
    new Error('Invalid email or password')
  );

  const loginButton = screen.getByText('Continue');

  // Simulate user input
  fireEvent.changeText(screen.getByLabelText('Email'), 'test@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'password');
  fireEvent.press(loginButton);
  // Wait for the mocked function to be called
  await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalled());
  expect(Alert.alert).toHaveBeenCalled();
});
