import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventDetail from '../../../navigation/screens/EventDetail';
import '@testing-library/jest-dom';

const Stack = createNativeStackNavigator();

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventDetail" component={EventDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders Event Screen', async () => {
  renderWithNavigation();
  // Find the input fields by their labels
  expect(screen.getByText('Title')).toBeTruthy();
  expect(screen.getByText('Santa Cruz Cinema')).toBeTruthy();
  expect(screen.getByText('Date')).toBeTruthy();
  expect(screen.getByText('1405 Pacific Ave, Santa Cruz, CA 95060')).toBeTruthy();
});
