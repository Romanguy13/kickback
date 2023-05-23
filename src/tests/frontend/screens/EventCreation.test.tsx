import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Alert, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import EventCreation from '../../../navigation/screens/EventCreation';
import Events from '../../../resources/api/events';
import { EventReturn } from '../../../resources/schema/event.model';
import Users from '../../../resources/api/users';
import GroupMembers from '../../../resources/api/groupMembers';
import { UserReturn } from '../../../resources/schema/user.model';
import { GroupMemberModel, GroupReturnModel } from '../../../resources/schema/group.model';
import Groups from '../../../resources/api/groups';
import {
  helpFillInEventCreationForm,
  helpFindInitialText,
  preloadMocksEventCreationSuccess,
} from '../helper/EventCreation.helper';

jest.spyOn(Alert, 'alert');

jest.mock('firebase/auth');

jest.mock('firebase/firestore');

jest.mock('../../../resources/api/events');

jest.mock('../../../resources/api/users');

jest.mock('../../../resources/api/groupMembers');

jest.mock('../../../resources/api/groups');

const Stack = createNativeStackNavigator();

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

const currentUser: FirebaseUser = {
  uid: '12345',
  email: 'john@wick.com',
  displayName: 'John Wick',
  emailVerified: true,
};

const currUser: UserReturn = {
  id: '12345',
  email: 'john@wick.com',
  name: 'John Wick',
  createdAt: serverTimestamp() as Timestamp,
  updatedAt: serverTimestamp() as Timestamp,
};

jest.mock('../../../../firebaseConfig', () => ({
  FB_AUTH: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    currentUser,
  },
}));

function MockFeed(): JSX.Element {
  return <View />;
}

const renderWithNavigation = async () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventCreation" component={EventCreation} />
        <Stack.Screen name="Feed" component={MockFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );

const renderWithNavigationAndData = async (invitees: UserReturn[]) => {
  function TestEventCreation(): JSX.Element {
    return (
      <EventCreation
        navigation={jest.fn()}
        route={{
          params: {
            groupId: '123456',
            topMembers: invitees,
          },
        }}
      />
    );
  }

  return render(
    <NavigationContainer>
      <Stack.Navigator>
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Stack.Screen name="EventCreation" component={TestEventCreation} />
        <Stack.Screen name="EventFeed" component={MockFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

test('Renders Event Screen', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);

  await renderWithNavigation();

  await helpFindInitialText();
});

test('Date and Time Modals - Appear', async () => {
  await renderWithNavigation();

  const dateAppear = screen.getByTestId('date-appear');
  fireEvent.press(dateAppear);
  expect(dateAppear).not.toBeNull();

  const timePicker = screen.getByTestId('time-appear');
  fireEvent.press(timePicker);
  expect(timePicker).not.toBeNull();
});

test('Handles Date Change - Confirm', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);

  await renderWithNavigation();

  const dateButton = screen.getByTestId('date-input');
  await fireEvent.press(dateButton);

  // Change the date
  const datePicker = screen.getByTestId('date-picker');
  await fireEvent(datePicker, 'onConfirm', new Date('2024-10-10T00:00:00.000Z'));

  // Date picker disappears
  expect(screen.queryByTestId('date-picker')).toBeNull();
});

test('Handles Date Change - Cancel', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);

  await renderWithNavigation();

  const dateButton = screen.getByTestId('date-input');
  await fireEvent.press(dateButton);

  // Change the date
  const datePicker = screen.getByTestId('date-picker');
  await fireEvent(datePicker, 'onCancel');

  // Date picker disappears
  expect(screen.queryByTestId('date-picker')).toBeNull();
});

test('Handles Date Change - Error', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);

  await renderWithNavigation();

  const dateButton = screen.getByTestId('date-input');
  fireEvent.press(dateButton);

  // Change the date
  const datePicker = screen.getByTestId('date-picker');
  act(() => {
    fireEvent(datePicker, 'onConfirm', undefined);
  });

  // Date picker disappears
  expect(screen.queryByTestId('date-picker')).toBeNull();
});

test('Handles Time Change - Confirm', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);

  await renderWithNavigation();

  const dateButton = screen.getByTestId('time-input');
  await fireEvent.press(dateButton);

  // Change the date
  const datePicker = screen.getByTestId('time-picker');
  await fireEvent(datePicker, 'onConfirm', new Date('2024-10-10T12:40:00.000Z'));

  // Date picker disappears
  expect(screen.queryByTestId('time-picker')).toBeNull();
});

test('Handles Time Change - Cancel', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);

  await renderWithNavigation();

  const dateButton = screen.getByTestId('time-input');
  await fireEvent.press(dateButton);

  // Change the date
  const datePicker = screen.getByTestId('time-picker');
  await fireEvent(datePicker, 'onCancel');

  // Date picker disappears
  expect(screen.queryByTestId('time-picker')).toBeNull();
});

test('Handles Time Change - Error', async () => {
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([] as GroupMemberModel[]);

  await renderWithNavigation();

  const dateButton = screen.getByTestId('time-input');
  fireEvent.press(dateButton);

  // Change the date
  const datePicker = screen.getByTestId('time-picker');
  act(() => {
    fireEvent(datePicker, 'onConfirm', undefined);
  });

  // Date picker disappears
  expect(screen.queryByTestId('time-picker')).toBeNull();
});

test('Cancel Works Fine', async () => {
  (Events.prototype.getAll as jest.Mock).mockResolvedValue([] as EventReturn[]);
  await renderWithNavigation();
  const cancelButton = screen.getByText('Cancel');
  fireEvent.press(cancelButton);
});

test('Error catching', async () => {
  (Users.prototype.getUserByEmail as jest.Mock).mockRejectedValue(new Error('test error'));
  await renderWithNavigation();

  const invitedInput = screen.getByTestId('invited-input');
  const inviteButton = screen.getByTestId('invite-button');

  fireEvent.changeText(invitedInput, 'Fail');
  fireEvent.press(inviteButton);

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalled();
  });
});

test('Inviting Members - No member - Error', async () => {
  await renderWithNavigation();

  await helpFillInEventCreationForm([], false);

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Please invite at least one user.');
  });
});

test('Write in input fields and check they are not empty', async () => {
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValue({
    id: '123456',
    email: 'test@testing.com',
    name: 'tester',
  });
  await renderWithNavigation();

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
  fireEvent.changeText(invitedInput, 'test@testing.com');
  expect(invitedInput).not.toBeNull();
  await fireEvent.press(inviteButton);
  expect(screen.getByText('tester')).toBeTruthy();
  // Check that the button was fired
  expect(inviteButton).not.toBeNull();
});

test('Invite Errors Check', async () => {
  // For inviting once
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce({
    id: '123456',
    email: 'test@testing.com',
    name: 'tester',
  });

  // For wrong email
  (Users.prototype.getUserByEmail as jest.Mock).mockRejectedValueOnce(
    new Error('User with email isabella@kickback.com does not exist')
  );

  await renderWithNavigation();

  await helpFillInEventCreationForm([], false);

  const invitedInput = screen.getByTestId('invited-input');
  const inviteButton = screen.getByTestId('invite-button');

  // Empty invite
  fireEvent.changeText(invitedInput, '');
  fireEvent.press(inviteButton);
  expect(Alert.alert).toBeCalledWith('Please enter an email.');

  // Inv yourself
  fireEvent.changeText(invitedInput, 'john@wick.com');
  fireEvent.press(inviteButton);
  expect(Alert.alert).toBeCalledWith('You cannot invite yourself, silly goose.');

  // Inv twice
  fireEvent.changeText(invitedInput, 'test@testing.com');
  act(() => {
    fireEvent.press(inviteButton);
  });
  await waitFor(() => expect(screen.getByText('tester')).toBeTruthy());

  fireEvent.changeText(invitedInput, 'test@testing.com');
  fireEvent.press(inviteButton);
  expect(Alert.alert).toBeCalledWith('User already invited.');

  // Email doesn't exist
  fireEvent.changeText(invitedInput, 'isabella@kickback.com');
  act(() => {
    fireEvent.press(inviteButton);
  });
  await waitFor(() => expect(Alert.alert).toBeCalledWith('User does not exist.'));
});

test('Create Event - Host not in Firebase', async () => {
  const isabellaInvitee: UserReturn = {
    id: '23423',
    name: 'Isabella',
    email: 'isabella@kickback.com',
    updatedAt: new Date() as unknown as Timestamp,
    createdAt: new Date() as unknown as Timestamp,
  };
  const invitees = [isabellaInvitee];

  // User to invite
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(
    isabellaInvitee as UserReturn
  );

  // Yourself
  (Users.prototype.getUserByEmail as jest.Mock).mockRejectedValueOnce(
    new Error('Cannot find user')
  );

  await renderWithNavigation();

  await helpFillInEventCreationForm(invitees, false);

  expect(Alert.alert).toBeCalledWith('Cannot find user.');
});

test('Create Event', async () => {
  const testerAttendee: UserReturn = {
    id: '32432',
    email: 'test@testing.com',
    name: 'tester',
    updatedAt: new Date() as unknown as Timestamp,
    createdAt: new Date() as unknown as Timestamp,
  };

  await preloadMocksEventCreationSuccess([testerAttendee], currUser, false, false);

  await renderWithNavigation();

  await helpFillInEventCreationForm([testerAttendee], false);
});

test('Create Event with Pre-Existing Group', async () => {
  const mobAttendee: UserReturn = {
    id: '243243',
    email: 'mob@kickback.com',
    name: 'Shigeo Kageyama',
    updatedAt: new Date() as unknown as Timestamp,
    createdAt: new Date() as unknown as Timestamp,
  };

  await preloadMocksEventCreationSuccess([mobAttendee], currUser, true, true);

  await renderWithNavigationAndData([mobAttendee]);

  await helpFillInEventCreationForm([mobAttendee], true);
});

test('Create an event - Same Group', async () => {
  // User to invite
  const sammyUser: UserReturn = {
    id: '67890',
    email: 'sammy@slug.edu',
    name: 'Sammy Slug',
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  const usersToInvite: UserReturn[] = [sammyUser];

  await preloadMocksEventCreationSuccess(usersToInvite, currUser, false, true);

  await renderWithNavigation();

  await helpFillInEventCreationForm(usersToInvite, false);
});

test('Create an event - Not Same Group', async () => {
  // User to invite
  const sammyUser: UserReturn = {
    id: '67890',
    email: 'sammy@slug.edu',
    name: 'Sammy Slug',
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  const isabelleUser: UserReturn = {
    id: '90876',
    email: 'isabelle@kickback.com',
    name: 'Isabelle',
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  const usersToInvite: UserReturn[] = [sammyUser, isabelleUser];

  // User to invite
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(sammyUser as UserReturn);
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(isabelleUser as UserReturn);

  // For getting yourself in event creation handling
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(currUser as UserReturn);

  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      userId: currUser.id,
      groupId: 'group-id',
    },
  ] as GroupMemberModel[]);

  (Groups.prototype.get as jest.Mock).mockResolvedValueOnce({
    id: 'group-id',
    name: 'group-name',
  } as GroupReturnModel);

  // Returns yourself and the user you are inviting
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      userId: currUser.id,
      groupId: 'group-id',
    },
    {
      userId: isabelleUser.id,
      groupId: 'group-id',
    },
    {
      userId: sammyUser.id,
      groupId: 'group-id',
    },
    {
      userId: 'some-other-user-id',
      groupId: 'group-id',
    },
  ] as GroupMemberModel[]);

  // Mocking invitee - When adding
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce(sammyUser);
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce(isabelleUser);
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
    id: 'some-other-user-id',
    email: 'someother@kickback.com',
    name: 'Some Other User',
  } as UserReturn);

  // Mocking yourself - Creating event
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce(currUser as UserReturn);

  (Events.prototype.create as jest.Mock).mockResolvedValueOnce({} as EventReturn);

  await renderWithNavigation();

  await helpFillInEventCreationForm(usersToInvite, false);
});

test('Create an event - Different Group - Close to Same Group', async () => {
  // User to invite
  const sammyUser: UserReturn = {
    id: '67890',
    email: 'sammy@slug.edu',
    name: 'Sammy Slug',
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  // User to invite
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(sammyUser as UserReturn);

  // For getting yourself in event creation handling
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(currUser as UserReturn);

  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      userId: currUser.id,
      groupId: 'group-id',
    },
  ] as GroupMemberModel[]);

  (Groups.prototype.get as jest.Mock).mockResolvedValueOnce({
    id: 'group-id',
    name: 'group-name',
  } as GroupReturnModel);

  // Returns yourself and the user you are inviting
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
    {
      userId: currUser.id,
      groupId: 'group-id',
    },
    {
      userId: sammyUser.id,
      groupId: 'group-id',
    },
    {
      userId: '89564',
      groupId: 'group-id',
    },
  ] as GroupMemberModel[]);

  (Users.prototype.get as jest.Mock).mockResolvedValueOnce(sammyUser);
  (Users.prototype.get as jest.Mock).mockResolvedValueOnce(currUser as UserReturn);

  // Due to not having any groups in common, new group will be made
  (Groups.prototype.create as jest.Mock).mockResolvedValueOnce('new-group');

  // In general call than individual calls - would be 3 calls
  (GroupMembers.prototype.create as jest.Mock).mockResolvedValue({});

  (Events.prototype.create as jest.Mock).mockResolvedValueOnce({} as EventReturn);

  await renderWithNavigation();

  const titleInput = screen.getByTestId('title-input');
  const locationInput = screen.getByTestId('location-input');
  const dateInput = screen.getByTestId('date-input');
  const timeInput = screen.getByTestId('time-input');
  const invitedInput = screen.getByTestId('invited-input');
  const inviteButton = screen.getByTestId('invite-button');
  const createButton = screen.getByTestId('create-button');

  await act(async () => {
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
    await fireEvent.changeText(
      dateInput,
      `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`
    );
    expect(dateInput).not.toBeNull();
    // Time
    await fireEvent.press(timeInput);
    await fireEvent.changeText(timeInput, '09:30 PM');
    expect(timeInput).not.toBeNull();

    // invited
    await fireEvent.changeText(invitedInput, sammyUser.email);
    expect(invitedInput).not.toBeNull();
    await fireEvent.press(inviteButton);

    expect(screen.getByText(sammyUser.name)).toBeTruthy();
    // Check that the button was fired
    expect(inviteButton).not.toBeNull();
  });

  await waitFor(async () => {
    // Create Here
    await fireEvent.press(createButton);
  });
});
