import { render, waitFor, screen, fireEvent, act } from '@testing-library/react-native';
import { Timestamp } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, View } from 'react-native';
import React from 'react';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { EventReturn } from '../../../resources/schema/event.model';
import EventHistoryDetail from '../../../navigation/screens/EventHistoryDetail';
import GroupMembers from '../../../resources/api/groupMembers';
import { GroupMemberModel } from '../../../resources/schema/group.model';
import Users from '../../../resources/api/users';
import { UserReturn } from '../../../resources/schema/user.model';
import KickbackImage from '../../../resources/api/kickbackImage';
import Events from '../../../resources/api/events';

jest.spyOn(Alert, 'alert');

jest.mock('expo-image-picker');
jest.mock('firebase/auth');

jest.mock('../../../resources/api/events');
jest.mock('../../../resources/api/groupMembers');
jest.mock('../../../resources/api/users');
jest.mock('../../../resources/api/kickbackImage');

const currentUser = {
  uid: '12345',
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

const mockUseIsFocused = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: () => mockUseIsFocused(),
  };
});

const Stack = createNativeStackNavigator();
function MockLogin(): JSX.Element {
  return <View />;
}

const event: { event: EventReturn } = {
  event: {
    createdAt: Timestamp.fromDate(moment('2023-06-28 12:00:00', 'YYYY-MM-DD hh:mm:ss').toDate()),
    datetime: Timestamp.fromDate(moment('2023-07-28 12:00:00', 'YYYY-MM-DD hh:mm:ss').toDate()),
    gId: '567',
    hostId: '12345',
    inviteeStatus: [],
    location: 'MEP',
    name: 'Waffle Party',
    paidStatus: [
      {
        id: '12345',
        status: true,
      },
    ],
    updatedAt: Timestamp.fromDate(moment('2023-06-28 12:00:00', 'YYYY-MM-DD hh:mm:ss').toDate()),
    id: '709',
  },
};
const backupParms: { event: EventReturn } = { ...event };

beforeEach(() => {
  event.event = { ...backupParms.event };
});

const renderWithNavigation = async (params: { event: EventReturn }) =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HistoryDetail"
          component={EventHistoryDetail}
          initialParams={{ ...params }}
        />
        <Stack.Screen name="Login" component={MockLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('EventHistoryDetail renders correctly', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      userId: '12345',
      groupId: '567',
    },
  ] as GroupMemberModel[]);
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    id: '12345',
    name: 'John Wick',
    email: 'john@wick.com',
  } as UserReturn);

  await renderWithNavigation(event);

  await waitFor(() => {
    expect(screen.getByText('Waffle Party')).toBeTruthy();
    expect(screen.getByText('MEP')).toBeTruthy();
    expect(screen.getByText('John')).toBeTruthy();
  });
});

test('Event History Detail - Select Paid Status', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '12345',
      groupId: '567',
    },
  ] as GroupMemberModel[]);
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    id: '12345',
    name: 'John Wick',
    email: 'john@wick.com',
  } as UserReturn);

  await renderWithNavigation(event);

  await waitFor(() => expect(screen.getByTestId('accept-payment')).toBeTruthy());

  fireEvent.press(screen.getByTestId('accept-payment'));

  await waitFor(() => expect(screen.getByTestId('paid-icon')).toBeTruthy());
});

test('Event History Detail - Select Deny Paid Status', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '12345',
      groupId: '567',
    },
  ] as GroupMemberModel[]);
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    id: '12345',
    name: 'John Wick',
    email: 'john@wick.com',
  } as UserReturn);

  await renderWithNavigation(event);

  await waitFor(() => expect(screen.getByTestId('decline-payment')).toBeTruthy());

  fireEvent.press(screen.getByTestId('decline-payment'));

  await waitFor(() => expect(screen.getByTestId('unpaid-icon')).toBeTruthy());
});

test('Event History Detail - Select Redo', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '12345',
      groupId: '567',
    },
  ] as GroupMemberModel[]);
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    id: '12345',
    name: 'John Wick',
    email: 'john@wick.com',
  } as UserReturn);

  await renderWithNavigation(event);

  await waitFor(() => expect(screen.getByTestId('redo-button')).toBeTruthy());

  fireEvent.press(screen.getByTestId('redo-button'));
});

test('Event History Detail - Select Delete - Yes', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '12345',
      groupId: '567',
    },
  ] as GroupMemberModel[]);
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    id: '12345',
    name: 'John Wick',
    email: 'john@wick.com',
  } as UserReturn);

  await renderWithNavigation(event);

  await waitFor(() => expect(screen.getByTestId('delete-button')).toBeTruthy());

  act(() => fireEvent.press(screen.getByTestId('delete-button')));

  await waitFor(() => expect(screen.getByTestId('edit-modal')).toBeTruthy());

  act(() => fireEvent.press(screen.getByTestId('yes-modal')));
});

test('Event History Detail - Select Delete - No', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '12345',
      groupId: '567',
    },
  ] as GroupMemberModel[]);
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    id: '12345',
    name: 'John Wick',
    email: 'john@wick.com',
  } as UserReturn);

  await renderWithNavigation(event);

  await waitFor(() => expect(screen.getByTestId('delete-button')).toBeTruthy());

  act(() => fireEvent.press(screen.getByTestId('delete-button')));

  await waitFor(() => expect(screen.getByTestId('edit-modal')).toBeTruthy());

  act(() => fireEvent.press(screen.getByTestId('no-modal')));

  await waitFor(() => expect(screen.getByTestId('edit-modal')).toBeTruthy());
});

test('Event History Detail - Select Receipt - w/ Receipt', async () => {
  event.event.receipt = 'test';

  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '12345',
      groupId: '567',
    },
  ] as GroupMemberModel[]);
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    id: '12345',
    name: 'John Wick',
    email: 'john@wick.com',
  } as UserReturn);
  (KickbackImage.prototype.downloadImage as jest.Mock).mockResolvedValueOnce('test');

  await renderWithNavigation(event);

  await waitFor(() => expect(screen.getByTestId('receipt-button')).toBeTruthy());

  await act(() => fireEvent.press(screen.getByTestId('receipt-button')));

  await waitFor(() => expect(screen.getByTestId('close-receipt-modal')).toBeTruthy());

  act(() => fireEvent.press(screen.getByTestId('close-receipt-modal')));
});

test('Event History Detail - Select Receipt - w/ Receipt - Reupload', async () => {
  event.event.receipt = 'test';

  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '12345',
      groupId: '567',
    },
  ] as GroupMemberModel[]);
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    id: '12345',
    name: 'John Wick',
    email: 'john@wick.com',
  } as UserReturn);
  (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
    status: 'granted',
  });
  (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
    assets: [
      {
        uri: 'test',
      },
    ],
  });
  (KickbackImage.prototype.uploadImage as jest.Mock).mockResolvedValueOnce('test');
  (Events.prototype.edit as jest.Mock).mockResolvedValueOnce('test');

  await renderWithNavigation(event);

  await waitFor(() => expect(screen.getByTestId('receipt-button')).toBeTruthy());

  await act(() => fireEvent.press(screen.getByTestId('receipt-button')));

  await waitFor(() => expect(screen.getByTestId('close-receipt-modal')).toBeTruthy());

  await act(() => fireEvent.press(screen.getByTestId('reupload-button')));

  await waitFor(() => expect(screen.getByTestId('close-receipt-modal')).toBeTruthy());

  expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
  expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
});

test('Event History Detail - Select Receipt - w/ Receipt - Reupload - Rejected', async () => {
  event.event.receipt = 'test';

  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValue([
    {
      userId: '12345',
      groupId: '567',
    },
  ] as GroupMemberModel[]);
  (Users.prototype.get as jest.Mock).mockResolvedValue({
    id: '12345',
    name: 'John Wick',
    email: 'john@wick.com',
  } as UserReturn);
  (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
    status: 'denied',
  });

  await renderWithNavigation(event);

  await waitFor(() => expect(screen.getByTestId('receipt-button')).toBeTruthy());

  await act(() => fireEvent.press(screen.getByTestId('receipt-button')));

  await waitFor(() => expect(screen.getByTestId('close-receipt-modal')).toBeTruthy());

  await act(() => fireEvent.press(screen.getByTestId('reupload-button')));

  await waitFor(() => expect(screen.getByTestId('close-receipt-modal')).toBeTruthy());
});
