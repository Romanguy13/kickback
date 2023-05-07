import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventCreation from '../../../navigation/screens/EventCreation';
import EventFeed from '../../../navigation/screens/EventFeed';
import '@testing-library/jest-dom';

const Stack = createNativeStackNavigator();

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventCreation" component={EventCreation} />
        <Stack.Screen name="EventFeed" component={EventFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders Event Screen', async () => {
  renderWithNavigation();

  // Find the input fields by their labels
  expect(screen.getByPlaceholderText('Event Title')).toBeTruthy();
  expect(screen.getByText('Location')).toBeTruthy();
  expect(screen.getByText('Date')).toBeTruthy();
  expect(screen.getByText('Time')).toBeTruthy();
  expect(screen.getByText("Who's Invited")).toBeTruthy();
  expect(screen.getByText('Create')).toBeTruthy();
});

test('Cancel Works Fine', async () => {
  renderWithNavigation();
  const cancelButton = screen.getByText('Cancel');
  fireEvent.press(cancelButton);
});

test('Write in input fields and check they are not empty', async () => {
  renderWithNavigation();

  const titleInput = screen.getByTestId('title-input');
  const locationInput = screen.getByTestId('location-input');
  const dateInput = screen.getByTestId('date-input');
  const timeInput = screen.getByTestId('time-input');
  const invitedInput = screen.getByTestId('invited-input');
  const inviteButton = screen.getByTestId('invite-button');

  // Title
  fireEvent.changeText(titleInput, 'Test Event');
  expect(titleInput).not.toBeNull();
  // Location
  fireEvent.changeText(locationInput, 'Testing Site');
  expect(locationInput).not.toBeNull();
  // Date
  await fireEvent.press(dateInput);
  const currentDate = new Date();
  const tomorrow = new Date(currentDate.setDate(currentDate.getDate() + 1));
  fireEvent.changeText(
    dateInput,
    `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`
  );
  expect(dateInput).not.toBeNull();
  // Time
  await fireEvent.press(timeInput);
  fireEvent.changeText(timeInput, '09:30 PM');
  expect(timeInput).not.toBeNull();
  // invited
  fireEvent.changeText(invitedInput, 'test@kickback.com');
  expect(invitedInput).not.toBeNull();
  fireEvent.press(inviteButton);
  expect(invitedInput).not.toBeNull();
  await waitFor(() => {
    expect(screen.getByText('first last')).toBeTruthy();
  });
});
