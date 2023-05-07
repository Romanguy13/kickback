import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import EventGroups from '../../../navigation/screens/EventGroups';
import GroupMembers from '../../../resources/api/groupMembers';
import Groups from '../../../resources/api/groups';
import Users from '../../../resources/api/users';
import Events from '../../../resources/api/events';

jest.mock('firebase/firestore');
jest.mock('../../../resources/api/kickbackFirebase');
jest.mock('../../../resources/api/groupMembers');
jest.mock('../../../resources/api/groups');
jest.mock('../../../resources/api/users');

const Stack = createNativeStackNavigator();
function GroupDetailsMock(): JSX.Element {
  return <View />;
}

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventGroups" component={EventGroups} />
        <Stack.Screen name="GroupDetails" component={GroupDetailsMock} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('renders', async () => {
  // Calls a GroupMembers GetAll
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);

  render(<EventGroups />);
});

test('Render Groups - Able to Click', async () => {
  // Calls a GroupMembers GetAll
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([{ groupId: '12345' }]);

  // Calls for Groups.get for each group
  (Groups.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'Android Gang',
    id: '12345',
  });

  // Calls for GroupMembers.getAll for each group
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      groupId: '12345',
      userId: 'user1',
    },
    {
      groupId: '12345',
      userId: 'user2',
    },
  ]);

  // Calls for Users.get for each user
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'User 1',
    email: 'user1@kickback.com',
  });
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'User 2',
    email: 'user2@kickback.com',
  });

  // Lastly calls for Events.getAll for the groups joined
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      name: 'Event 1',
      gId: '12345',
      id: 'event1',
      hostId: 'user1',
      date: '2021-10-10',
      time: '12:00',
      location: '123 Main St',
    },
  ]);

  renderWithNavigation();

  await waitFor(() => {
    expect(screen.getByText('Android Gang')).toBeTruthy();
  });

  const group = screen.getByText('Android Gang');
  act(() => {
    fireEvent.press(group);
  });
});

test('Render Groups - More than 4 Members', async () => {
  // Calls a GroupMembers GetAll
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([{ groupId: '12345' }]);

  // Calls for Groups.get for each group
  (Groups.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'Android Gang',
    id: '12345',
  });

  // Calls for GroupMembers.getAll for each group
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      groupId: '12345',
      userId: 'user1',
    },
    {
      groupId: '12345',
      userId: 'user2',
    },
    {
      groupId: '12345',
      userId: 'user3',
    },
    {
      groupId: '12345',
      userId: 'user4',
    },
    {
      groupId: '12345',
      userId: 'user5',
    },
  ]);

  // Calls for Users.get for each user
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'User 1',
    email: 'user1@kickback.com',
  });
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'User 2',
    email: 'user2@kickback.com',
  });
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'User 3',
    email: 'user3@kickback.com',
  });
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'User 4',
    email: 'user4@kickback.com',
  });
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'User 5',
    email: 'user5@kickback.com',
  });

  // Lastly calls for Events.getAll for the groups joined
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      name: 'Event 1',
      gId: '12345',
      id: 'event1',
      hostId: 'user1',
      date: '2021-10-10',
      time: '12:00',
      location: '123 Main St',
    },
  ]);

  renderWithNavigation();

  await waitFor(() => {
    expect(screen.getByText('Android Gang')).toBeTruthy();
    expect(screen.getByText('+1')).toBeTruthy();
  });
});
