import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Timestamp } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import moment from 'moment';
import EventDetail from '../../../navigation/screens/EventDetail';
import Events from '../../../resources/api/events';
import GroupMembers from '../../../resources/api/groupMembers';
import Users from '../../../resources/api/users';
import preLoadData from '../helper/EventDetails.helper';

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

const renderWithNavigation = async (params: any) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventDetail" component={EventDetail} initialParams={{ ...params }} />
      </Stack.Navigator>
    </NavigationContainer>
  );

const params = {
  event: {
    hostId: '2',
    name: 'Test Event with a Longer Name!',
    datetime: Timestamp.fromDate(moment('2023-07-28 12:00:00', 'YYYY-MM-DD hh:mm:ss').toDate()),
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
  canVote: true,
};

const params2 = {
  event: {
    hostId: '4',
    name: 'Test Event',
    datetime: Timestamp.fromDate(moment('2023-07-28 12:00:00', 'YYYY-MM-DD hh:mm:ss').toDate()),
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
  canVote: true,
};

test('Renders Event Screen', async () => {
  preLoadData();

  await renderWithNavigation(params2);

  expect(screen.getByText('Test Event')).toBeTruthy();
  expect(screen.getByText('Test Location')).toBeTruthy();
  expect(screen.getByText('Fri, July 28, 2023')).toBeTruthy();
  expect(screen.getByText('12:00 PM')).toBeTruthy();

  // Checking to see if all users are there
  await waitFor(() => {
    expect(screen.getByText('Chief Keef')).toBeTruthy();
    expect(screen.getByText('keshi')).toBeTruthy();
    expect(screen.getByText('Richy Rich')).toBeTruthy();
    expect(screen.getByText('Kung Fu Kenny')).toBeTruthy();
  });
});

test('Render Long Name', async () => {
  preLoadData();

  await renderWithNavigation(params);

  expect(screen.getByText('Test Event wit..')).toBeTruthy();
});

test('Click accept for status update', async () => {
  preLoadData();

  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '1',
    status: true,
  });

  preLoadData();

  await renderWithNavigation(params);

  await waitFor(() => {
    expect(screen.getByText('Chief Keef')).toBeTruthy();
  });

  act(() => {
    fireEvent.press(screen.getByTestId('accept-invite'));
  });
});

test('Click decline for status update', async () => {
  preLoadData();

  (Events.prototype.edit as jest.Mock).mockResolvedValue({
    id: '4',
    status: false,
  });

  preLoadData();

  await renderWithNavigation(params2);
  await waitFor(() => {
    expect(screen.getByText('Test Location')).toBeTruthy();
  });

  fireEvent.press(screen.getByTestId('decline-invite'));
});

test('Click the "Go Back" button', async () => {
  preLoadData();

  await renderWithNavigation(params);

  // get the button with accessibility label "Back Button"
  // const backButton = screen.getByLabelText('Back Button');
  fireEvent.press(screen.getByLabelText('Back Button'));
});
