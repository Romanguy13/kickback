import { fireEvent, render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../screens/Login';
import SignUp from '../../screens/SignUp';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component: React.FC) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={component} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders Login Screen', async () => {
  renderWithNavigation(Login);
  expect(screen.getByText('Login')).toBeTruthy();
});

test('Click Continue', async () => {
  renderWithNavigation(Login);
  expect(screen.getByText('Login')).toBeTruthy();
  fireEvent.press(screen.getByText('Continue'));
});

test('Click Sign Up', async () => {
  renderWithNavigation(Login);
  expect(screen.getByText('Login')).toBeTruthy();
  fireEvent.press(screen.getByText('Sign Up!'));
});
