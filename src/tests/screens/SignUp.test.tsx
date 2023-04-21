import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../../screens/SignUp';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component: React.FC) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={component} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders Login Screen', async () => {
  renderWithNavigation(SignUp);
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
