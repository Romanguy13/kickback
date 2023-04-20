import { fireEvent, render, screen } from '@testing-library/react-native';
import Welcome from '../../screens/Welcome';
import Login from '../../screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component: any) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={component} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

test('Renders Login Screen', async () => {
  renderWithNavigation(Welcome);
  expect(screen.getByText('Welcome to KickBack')).toBeTruthy();
});

test('Clicking Login Button', async () => {
  renderWithNavigation(Login);
  expect(screen.getByText('Welcome to KickBack')).toBeTruthy();
  expect(screen.getByText('Login')).toBeTruthy();
  fireEvent.press(screen.getByText('Login'));
  expect(screen.getByText('KickBack')).toBeTruthy();
});
