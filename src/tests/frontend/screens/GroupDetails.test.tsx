import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import GroupMembers from '../../../resources/api/groupMembers';
import Users from '../../../resources/api/users';
import Events from '../../../resources/api/events';
import GroupDetails from '../../../navigation/screens/GroupDetails';
import { UserModel } from '../../../resources/schema/user.model';
import { EventReturn } from '../../../resources/schema/event.model';
import { GroupReturnModel } from '../../../resources/schema/group.model';

// jest.mock('firebase/firestore');
jest.mock('../../../resources/api/kickbackFirebase');
jest.mock('../../../resources/api/events');
jest.mock('../../../resources/api/groupMembers');
jest.mock('../../../resources/api/groups');
jest.mock('../../../resources/api/users');
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: jest.fn(),
  };
});

const Stack = createNativeStackNavigator();
function EventGroupsMock(): JSX.Element {
  return <View />;
}

function TabBarMock(): JSX.Element {
  return <View />;
}

export interface GroupCardProps {
  group: GroupReturnModel;
  events: EventReturn[];
  topMembers: UserModel[];
  extraMembers: number;
  navigation: any;
}

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventGroups" component={EventGroupsMock} />
        <Stack.Screen
          name="GroupDetails"
          component={GroupDetails}
          initialParams={{
            group: {
              name: 'Android Gang',
              id: '12345',
            },
            events: [
              {
                id: 'event1',
                name: 'Event 1',
                groupId: '12345',
              },
            ],
            topMembers: [
              {
                id: 'user1',
                name: 'User 1',
                email: 'email1',
              },
              {
                id: 'user2',
                name: 'User 2',
                email: 'email2',
              },
            ],
            extraMembers: 0,
          }}
        />
        <Stack.Screen name="TabBar" component={TabBarMock} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('renders', async () => {
  // Calls a GroupMembers GetAll
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);

  render(<GroupDetails navigation={undefined} route={{ params: { group: { id: '12345' } } }} />);
});

test('Click Back Button', async () => {
  // Calls a GroupMembers GetAll
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);

  render(
    <GroupDetails
      navigation={{
        goBack: jest.fn(),
        navigate: jest.fn(),
        useIsFocused: jest.fn(),
      }}
      route={{
        params: {
          group: {
            id: '12345',
          },
        },
      }}
    />
  );

  const backButton = screen.getByTestId('back-button');
  fireEvent.press(backButton);
});

test('Render Group Details', async () => {
  // Calls a GroupMembers GetAll
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      name: 'Event 1',
      gId: '12345',
      id: 'event1',
      hostId: 'user1',
      location: '123 Main St',
      datetime: Timestamp.fromDate(moment('2021-10-10 12:00').toDate()),
    },
  ] as EventReturn[]);
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      id: 'user1',
      name: 'User 1',
      email: 'email1',
    },
    {
      id: 'user2',
      name: 'User 2',
      email: 'email2',
    },
  ]);

  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'User 1',
    email: 'user1@kickback.com',
  });

  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'User 2',
    email: 'user2@kickback.com',
  });

  render(
    <GroupDetails
      navigation={{
        goBack: jest.fn(),
        navigate: jest.fn(),
      }}
      route={{
        params: {
          group: {
            id: '12345',
          },
          topMembers: [
            {
              id: 'user1',
              name: 'User 1',
            },
          ],
        },
      }}
    />
  );

  await waitFor(() => {
    expect(screen.getByText('Group Event')).toBeTruthy();
  });
  const createButton = screen.getByText('Group Event');

  fireEvent.press(createButton);
});
