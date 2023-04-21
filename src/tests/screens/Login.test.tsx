import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../screens/Login';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component: React.FC) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={component} />
        <Stack.Screen name="Login" component={Login} />
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
