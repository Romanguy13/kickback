import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import EventDetail from '../../../navigation/screens/EventDetail';
import Events from '../../../resources/api/events';
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
jest.mock('../../../../firebaseConfig');
jest.mock('firebase/auth');

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

const currentUser: FirebaseUser = {
  uid: '1',
  email: 'john@wick.com',
  displayName: 'John Wick',
  emailVerified: true,
};

jest.mock('../../../../firebaseConfig', () => ({
  FB_AUTH: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    currentUser,
  },
}));

const Stack = createNativeStackNavigator();

const renderWithNavigation = (params: any) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventDetail" component={EventDetail} initialParams={params} />
      </Stack.Navigator>
    </NavigationContainer>
  );

const params = {
  event: {
    hostId: '2',
    name: 'Test Event',
    date: '2022-01-01',
    time: '12:00 PM',
    location: 'Test Location',
    gId: '1',
    inviteeStatus: [
      {
        id: '1',
        status: null,
      },
      {
        id: '2',
        status: null,
      },
      {
        id: '3',
        status: null,
      },
      {
        id: '4',
        status: null,
      },
    ],
  },
};

const params2 = {
  event: {
    hostId: '4',
    name: 'Test Event',
    date: '2022-01-01',
    time: '12:00 PM',
    location: 'Test Location',
    gId: '1',
    inviteeStatus: [
      {
        id: '1',
        status: true,
      },
      {
        id: '2',
        status: true,
      },
      {
        id: '3',
        status: true,
      },
      {
        id: '4',
        status: null,
      },
    ],
  },
};

test('Renders Event Screen', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '2',
      groupId: '1',
    },
    {
      userId: '1',
      groupId: '1',
    },
    {
      userId: '3',
      groupId: '1',
    },
    {
      userId: '4',
      groupId: '1',
    },
  ]);

  renderWithNavigation(params);
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});

test('Click "Yes" for status update', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '2',
      groupId: '1',
    },
    {
      userId: '1',
      groupId: '1',
    },
    {
      userId: '3',
      groupId: '1',
    },
    {
      userId: '4',
      groupId: '1',
    },
  ]);
  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '1',
    status: true,
  });

  renderWithNavigation(params);
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });

  fireEvent.press(screen.getByText('Yes'));
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});

test('Click "No" for status update', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '1',
      groupId: '1',
    },
    {
      userId: '2',
      groupId: '1',
    },
    {
      userId: '3',
      groupId: '1',
    },
    {
      userId: '4',
      groupId: '1',
    },
  ]);
  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '4',
    status: false,
  });

  renderWithNavigation(params2);
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });

  fireEvent.press(screen.getByText('No'));
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});

// test('Click the "Go Back" button', async () => {
//   (Users.prototype.get as jest.Mock).mockResolvedValue({
//     name: 'Test User',
//   });
//   (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
//     {
//       userId: '1',
//       groupId: '1',
//     },
//     {
//       userId: '2',
//       groupId: '1',
//     },
//     {
//       userId: '3',
//       groupId: '1',
//     },
//     {
//       userId: '4',
//       groupId: '1',
//     },
//   ]);

//   renderWithNavigationForEventDetails();
//   await waitFor(() => {
//     expect(screen.getByText('Test Event')).toBeTruthy();
//   });

//   expect(screen.getByTestId('accept-button')).toBeTruthy();
//   expect(screen.getByTestId('decline-button')).toBeTruthy();
// });

test('Renders Event Screen', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '2',
      groupId: '1',
    },
    {
      userId: '1',
      groupId: '1',
    },
    {
      userId: '3',
      groupId: '1',
    },
    {
      userId: '4',
      groupId: '1',
    },
  ]);

  renderWithNavigation(params);
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});

test('Click "Yes" for status update', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '2',
      groupId: '1',
    },
    {
      userId: '1',
      groupId: '1',
    },
    {
      userId: '3',
      groupId: '1',
    },
    {
      userId: '4',
      groupId: '1',
    },
  ]);
  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '1',
    status: true,
  });

  renderWithNavigation(params);
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });

  fireEvent.press(screen.getByText('Yes'));
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});

test('Click "No" for status update', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '1',
      groupId: '1',
    },
    {
      userId: '2',
      groupId: '1',
    },
    {
      userId: '3',
      groupId: '1',
    },
    {
      userId: '4',
      groupId: '1',
    },
  ]);
  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '4',
    status: false,
  });

  renderWithNavigation(params2);
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });

  fireEvent.press(screen.getByText('No'));
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});

test('Click the "Go Back" button', async () => {
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    name: 'Test User',
  });
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '1',
      groupId: '1',
    },
    {
      userId: '2',
      groupId: '1',
    },
    {
      userId: '3',
      groupId: '1',
    },
    {
      userId: '4',
      groupId: '1',
    },
  ]);

  renderWithNavigation(params);
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });

  // get the button with accessibility label "Back Button"
  // const backButton = screen.getByLabelText('Back Button');
  fireEvent.press(screen.getByLabelText('Back Button'));
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});

// test('Renders History Screen - Go Back', async () => {
//   (Users.prototype.get as jest.Mock).mockResolvedValue({
//     name: 'Test User',
//   });
//   (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
//     {
//       userId: '1',
//       groupId: '1',
//     },
//   ]);

//   // await renderView();
//   await waitFor(() => {
//     expect(screen.getByText('Test Event')).toBeTruthy();
//   });

//   const backButton = screen.getByTestId('backButton');

//   await fireEvent.press(backButton);
// });
