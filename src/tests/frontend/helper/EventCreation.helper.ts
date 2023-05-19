// eslint-disable-next-line import/no-import-module-exports
import { screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import { UserReturn } from '../../../resources/schema/user.model';
import Users from '../../../resources/api/users';
import GroupMembers from '../../../resources/api/groupMembers';
import { GroupMemberModel, GroupReturnModel } from '../../../resources/schema/group.model';
import Groups from '../../../resources/api/groups';
import Events from '../../../resources/api/events';
import { EventReturn } from '../../../resources/schema/event.model';

export async function helpFindInitialText() {
  // Find the input fields by their labels
  expect(screen.getByPlaceholderText('Event Title')).toBeTruthy();
  expect(screen.getByText('Location')).toBeTruthy();
  expect(screen.getByText('Date')).toBeTruthy();
  expect(screen.getByText('Time')).toBeTruthy();
  expect(screen.getByText("Who's Invited")).toBeTruthy();
  expect(screen.getByText('Create')).toBeTruthy();
}

export async function preloadMocksEventCreationSuccess(
  invitees: UserReturn[],
  host: UserReturn,
  groupPassed: boolean,
  shouldBeSameGroup: boolean
) {
  // User to invite
  invitees.forEach((user: UserReturn) => {
    (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(user);
  });

  // For getting yourself in event creation handling
  (Users.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(host as UserReturn);

  if (!groupPassed) {
    // Returns the groups that host is in based off user ID
    (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
      {
        userId: host.id,
        groupId: 'group-id',
      },
    ] as GroupMemberModel[]);

    // Mock returns will be the members that were invited - Group has been created before
    if (!shouldBeSameGroup) {
      const inviteeGroupMembers: GroupMemberModel[] = invitees.map((user: UserReturn) => ({
        userId: user.id,
        groupId: 'group-id',
      }));

      // Returns the group members based off group ID
      (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
        {
          userId: host.id,
          groupId: 'group-id',
        },
        ...inviteeGroupMembers,
      ] as GroupMemberModel[]);

      // Returns the members of the group
      invitees.forEach((user: UserReturn) => {
        (Users.prototype.get as jest.Mock).mockResolvedValueOnce(user);
      });
    } else {
      // Group contains unique members
      // Random members of the group
      (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
        {
          userId: host.id,
          groupId: 'group-id',
        },
        {
          userId: 'random-id',
          groupId: 'group-id',
        },
      ] as GroupMemberModel[]);

      (Users.prototype.get as jest.Mock).mockResolvedValueOnce({
        id: 'random-id',
        name: 'Random User',
        email: 'random@kickback.com',
      } as UserReturn);
    }

    // Also returning the host of that group
    (Users.prototype.get as jest.Mock).mockResolvedValueOnce(host as UserReturn);

    // Due to the possibility that the group does not exist,
    // We need to mock the group creation
    (Groups.prototype.create as jest.Mock).mockResolvedValueOnce('new-group-id');
    // Group Member mock for all attendees
    invitees.forEach(() => {
      (GroupMembers.prototype.create as jest.Mock).mockResolvedValueOnce({});
    });
    // Group Member mock for host
    (GroupMembers.prototype.create as jest.Mock).mockResolvedValueOnce({});
  }

  (Events.prototype.create as jest.Mock).mockResolvedValueOnce({} as EventReturn);
}

export async function helpFillInEventCreationForm(
  usersToInvite: UserReturn[],
  groupPassed: boolean
) {
  const titleInput = screen.getByTestId('title-input');
  const locationInput = screen.getByTestId('location-input');
  const invitedInput = screen.getByTestId('invited-input');
  const inviteButton = screen.getByTestId('invite-button');
  const createButton = screen.getByTestId('create-button');

  // Title
  fireEvent.changeText(titleInput, 'Test Event');
  expect(titleInput).not.toBeNull();

  // Location
  fireEvent.changeText(locationInput, 'Testing Site');
  expect(locationInput).not.toBeNull();

  // Changing Date
  const dateButton = screen.getByTestId('date-input');
  await fireEvent.press(dateButton);

  const datePicker = screen.getByTestId('date-picker');
  await fireEvent(datePicker, 'onConfirm', new Date('2024-10-10T00:00:00.000Z'));

  // Time
  const timeButton = screen.getByTestId('time-input');
  await fireEvent.press(timeButton);

  // Change the date
  const timePicker = screen.getByTestId('time-picker');
  await fireEvent(timePicker, 'onConfirm', new Date('2024-10-10T12:40:00.000Z'));

  if (!groupPassed) {
    // invited - loop through users and invite them
    await usersToInvite.reduce(async (prevPromise, user) => {
      await prevPromise;

      await fireEvent.changeText(invitedInput, user.email);
      expect(invitedInput).not.toBeNull();

      await act(async () => {
        await fireEvent.press(inviteButton);
      });

      await waitFor(() => expect(screen.findByText(user.name)).resolves.toBeTruthy());
    }, Promise.resolve());

    // Check that the button was fired
    expect(inviteButton).not.toBeNull();
  } else {
    // Expect for the members to already be visible on screen
    usersToInvite.forEach((user) => {
      expect(screen.getByText(user.name)).toBeTruthy();
    });
  }

  await act(async () => {
    // Create Here
    await fireEvent.press(createButton);
  });
}
