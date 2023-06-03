import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Modal, View, Alert } from 'react-native';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import GroupMembers from '../../../resources/api/groupMembers';
import Users from '../../../resources/api/users';
import Groups from '../../../resources/api/groups';
import Events from '../../../resources/api/events';
import GroupDetails from '../../../navigation/screens/GroupDetails';
import { UserModel } from '../../../resources/schema/user.model';
import { EventReturn } from '../../../resources/schema/event.model';
import { GroupMemberModel, GroupReturnModel } from '../../../resources/schema/group.model';

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
jest.spyOn(Alert, 'alert');
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

test('Group Details Modal - Open and Closes modal', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);

  render(<GroupDetails navigation={undefined} route={{ params: { group: { id: '12345' } } }} />);

  expect(screen.getByTestId('edit-icon-button')).toBeTruthy();

  const groupModal = screen.getByTestId('edit-icon-button');

  act(() => {
    fireEvent.press(groupModal);
  });

  await waitFor(() => {
    expect(screen.getByTestId('edit-modal')).toBeTruthy();
    expect(screen.getByText('Edit Group Name:')).toBeTruthy();
    expect(screen.getByText('Done')).toBeTruthy();
    expect(screen.getByText('Close')).toBeTruthy();
    expect(screen.getByTestId('new-name-input')).toBeTruthy();
  });

  const closeModal = screen.getByText('Close');

  act(() => {
    fireEvent.press(closeModal);
  });
});

test('Group Details Modal - Edit', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);
  (Groups.prototype.edit as jest.Mock).mockResolvedValueOnce({});

  render(<GroupDetails navigation={undefined} route={{ params: { group: { id: '12345' } } }} />);

  const groupModal = screen.getByTestId('edit-icon-button');

  act(() => {
    fireEvent.press(groupModal);
  });

  const inputName = screen.getByTestId('new-name-input');
  const doneButton = screen.getByText('Done');
  fireEvent.changeText(inputName, 'Test Name');

  act(() => {
    fireEvent.press(doneButton);
  });

  await waitFor(() => {
    screen.getByText('Test Name');
  });
});

test('Group Details Modal - Edit Less Than 3 Chars', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);
  (Groups.prototype.edit as jest.Mock).mockResolvedValueOnce({});

  render(<GroupDetails navigation={undefined} route={{ params: { group: { id: '12345' } } }} />);

  const groupModal = screen.getByTestId('edit-icon-button');

  act(() => {
    fireEvent.press(groupModal);
  });

  const inputName = screen.getByTestId('new-name-input');
  const doneButton = screen.getByText('Done');
  fireEvent.changeText(inputName, '');

  act(() => {
    fireEvent.press(doneButton);
  });

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith('Group name must be at least 3 characters long');
  });
});

test('Group Details Modal - Same Name', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);
  (Groups.prototype.edit as jest.Mock).mockResolvedValueOnce({});

  render(
    <GroupDetails
      navigation={undefined}
      route={{ params: { group: { id: '12345', name: 'Test' } } }}
    />
  );

  const groupModal = screen.getByTestId('edit-icon-button');

  act(() => {
    fireEvent.press(groupModal);
  });

  const inputName = screen.getByTestId('new-name-input');
  const doneButton = screen.getByText('Done');
  fireEvent.changeText(inputName, 'Test');

  act(() => {
    fireEvent.press(doneButton);
  });

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith('Group name must be different from current name');
  });
});

test('Group Card Ordering', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);
  (Events.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      id: 'event-1',
      hostId: 'host-1',
      gId: 'group-1',
      name: 'Richy Rizz 101',
      datetime: Timestamp.fromDate(moment('2022-12-25 10:00', 'YYYY-MM-DD HH:mm').toDate()),
      location: 'MEP',
    },
    {
      id: 'event-2',
      hostId: 'host-1',
      gId: 'group-1',
      name: 'MEP Cookout',
      datetime: Timestamp.fromDate(moment('2023-12-26 11:00', 'YYYY-MM-DD HH:mm').toDate()),
      location: 'Baskin',
    },
  ] as EventReturn[]);

  render(<GroupDetails navigation={undefined} route={{ params: { group: { id: '12345' } } }} />);

  await waitFor(() => {
    // Past Event
    expect(screen.getByText('Group Events')).toBeTruthy();
    expect(screen.getByText('Richy Rizz 101')).toBeTruthy();
    expect(screen.getByText('Dec 25th 2022, 10:00 am')).toBeTruthy();
    expect(screen.getByText('Past')).toBeTruthy();
    // Upcoming Event
    expect(screen.getByText('MEP Cookout')).toBeTruthy();
    expect(screen.getByText('Dec 26th 2023, 11:00 am')).toBeTruthy();
    expect(screen.getByText('Upcoming')).toBeTruthy();
  });
});

test('Renders GroupDetails - All Members Appear', async () => {
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
        },
      }}
    />
  );

  await waitFor(() => {
    expect(screen.getByText('Group Event')).toBeTruthy();
  });
});
