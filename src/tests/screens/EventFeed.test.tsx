import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { Alert } from 'react-native';
import EventFeed from '../../screens/EventFeed';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component: React.FC) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventFeed" component={component} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders Login Screen', async () => {
  renderWithNavigation(EventFeed);
  expect(screen.getByText("Let's start a KickBack!")).toBeTruthy();
});
