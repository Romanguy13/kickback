import { fireEvent, render, screen } from '@testing-library/react-native';
import Login from '../../screens/Login';
import Home from '../../screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component: any) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={component} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

test('Renders Login Screen', async () => {
  renderWithNavigation(Login);
  expect(screen.getByText('Welcome to KickBack')).toBeTruthy();
});

test('Clicking Login Button', async () => {
  renderWithNavigation(Login);
  expect(screen.getByText('Welcome to KickBack')).toBeTruthy();
  expect(screen.getByText('Login')).toBeTruthy();
  fireEvent.press(screen.getByText('Login'));
  expect(screen.getByText('KickBack')).toBeTruthy();
});
