import { fireEvent, render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '../../screens/Welcome';
import Login from '../../screens/Login';
import SignUp from '../../screens/SignUp';
import EventFeed from '../../screens/EventFeed';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component: any) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={component} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="EventFeed" component={EventFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Rendering Welcome Page', async () => {
  renderWithNavigation(Welcome);
  expect(screen.getByText('KickBack')).toBeTruthy();
  expect(screen.getByText('Login')).toBeTruthy();
  expect(screen.getByText('Sign Up')).toBeTruthy();
});

test('Clicking Login Button', async () => {
  renderWithNavigation(Welcome);
  expect(screen.getByText('KickBack')).toBeTruthy();
  expect(screen.getByText('Login')).toBeTruthy();
  fireEvent.press(screen.getByText('Login'));
  expect(screen.getByText('Login')).toBeTruthy();
});

test('Clicking SignUp Button', async () => {
  renderWithNavigation(Welcome);
  expect(screen.getByText('KickBack')).toBeTruthy();
  expect(screen.getByText('Sign Up')).toBeTruthy();
  fireEvent.press(screen.getByText('Sign Up'));
  expect(screen.getByText('Create Account')).toBeTruthy();
});
