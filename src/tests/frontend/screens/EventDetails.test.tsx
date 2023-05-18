import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import EventDetail from '../../../navigation/screens/EventDetail';
import GroupMembers from '../../../resources/api/groupMembers';
import Users from '../../../resources/api/users';

jest.mock('../../../resources/api/events');
jest.mock('../../../resources/api/groupMembers');
jest.mock('../../../resources/api/groups');
jest.mock('../../../resources/api/users');
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigation: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

const Stack = createNativeStackNavigator();

const params = {
  event: {
    name: 'Test Event',
    date: '2022-01-01',
    time: '12:00 PM',
    location: 'Test Location',
    user: 'Test User',
  },
};

function MockFeed() {
  return <View />;
}

/**
 * This is a test for the EventHistory screen.
 */
const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventDetail" component={EventDetail} initialParams={params} />
        <Stack.Screen name="EventFeed" component={MockFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );

const renderView = async () =>
  render(
    <EventDetail
      route={{
        params: {
          ...params,
          canVote: true,
        },
      }}
      navigation={{
        navigate: jest.fn(),
        goBack: jest.fn(),
      }}
    />
  );
const renderWithNavigationForEventDetails = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="EventDetail"
          component={EventDetail}
          initialParams={{ ...params, canVote: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders History Screen', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '1',
      groupId: '1',
    },
  ]);

  renderWithNavigationForEventDetails();
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });

  expect(screen.getByTestId('accept-button')).toBeTruthy();
  expect(screen.getByTestId('decline-button')).toBeTruthy();
});

test('Renders Event Screen', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '1',
      groupId: '1',
    },
  ]);

  renderWithNavigation();
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});

test('Renders History Screen - Go Back', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '1',
      groupId: '1',
    },
  ]);

  await renderView();
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });

  const backButton = screen.getByTestId('backButton');

  await fireEvent.press(backButton);
});
