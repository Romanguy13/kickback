import { render, fireEvent, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavBar from '../../../navigation/NavBar';

const Stack = createNativeStackNavigator();

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="NavBar" component={NavBar} />
        <Stack.Screen name="EventFeed" component={NavBar} />
        <Stack.Screen name="EventHistory" component={NavBar} />
        <Stack.Screen name="EventCreation" component={NavBar} />
        <Stack.Screen name="EventGroups" component={NavBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('renders', async () => {
  renderWithNavigation();
});

test('clicking on the groups button', async () => {
  renderWithNavigation();
  fireEvent.press(screen.getByLabelText('Groups'));
});

test('clicking on the feed button', async () => {
  renderWithNavigation();
  fireEvent.press(screen.getByLabelText('Feed'));
});

test('clicking on the History button', async () => {
  renderWithNavigation();
  fireEvent.press(screen.getByLabelText('History'));
});

test('clicking on the Create Event button', async () => {
  renderWithNavigation();
  fireEvent.press(screen.getByLabelText('Create Event'));
});
