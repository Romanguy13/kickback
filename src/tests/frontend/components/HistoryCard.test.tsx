import { fireEvent, render, waitFor, screen, act } from '@testing-library/react-native';
import { Timestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import HistoryCard from '../../../components/HistoryCard';
import { EventReturn } from '../../../resources/schema/event.model';
import KickbackImage from '../../../resources/api/kickbackImage';
import Events from '../../../resources/api/events';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('../../../resources/api/kickbackImage');
jest.mock('expo-image-picker');
jest.mock('../../../resources/api/events');

jest.spyOn(Alert, 'alert');

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

let event: EventReturn = {
  id: '124',
  hostId: '12345',
  name: 'Name',
  location: 'Location',
  datetime: new Timestamp(2, 2),
  paidStatus: [
    {
      id: '12345',
      status: true,
    },
    {
      id: '02',
      status: true,
    },
  ],
  inviteeStatus: [
    {
      id: '12345',
      status: null,
    },
  ],
  gId: '123',
  updatedAt: new Timestamp(2, 2),
  createdAt: new Timestamp(2, 2),
};

const backupEvent: EventReturn = { ...event };

// Due to changing variables in the global event variable, we need to reset it before each test
beforeEach(() => {
  event = { ...backupEvent };
});

const renderHistoryCard = async () => render(<HistoryCard event={event} navigation={jest.fn()} />);

test('History Card Renders', async () => {
  render(<HistoryCard event={event} navigation={jest.fn()} />);
});

test('History Card - Able to Click', async () => {
  const navigate = jest.fn();
  render(<HistoryCard event={event} navigation={{ navigate }} />);

  await act(() => {
    fireEvent.press(screen.getByText('Name'));
  });

  expect(navigate).toHaveBeenCalled();
});

test('History Card - Upload image - No permission', async () => {
  (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
    status: 'denied',
  });

  await renderHistoryCard();

  await act(() => {
    fireEvent.press(screen.getByTestId('receiptButton'));
  });

  expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
});

test('History Card - Upload image', async () => {
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

  await renderHistoryCard();

  await act(() => {
    fireEvent.press(screen.getByTestId('receiptButton'));
  });

  expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
  expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
  await waitFor(() => expect(screen.getByLabelText('View Receipt')).toBeTruthy());
});

test('History Card - Image Modal - As Host', async () => {
  event.receipt = 'test';

  await renderHistoryCard();

  await waitFor(() => expect(screen.getByLabelText('View Receipt')).toBeTruthy());

  act(() => {
    fireEvent.press(screen.getByLabelText('View Receipt'));
  });

  await waitFor(() => expect(screen.getByLabelText('Close')).toBeTruthy());
  expect(screen.getByText('Receipt')).toBeTruthy();
});

test('History Card - Image Modal Change Picture - As Host', async () => {
  event.receipt = 'test';

  (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
    status: 'granted',
  });
  (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
    assets: [
      {
        uri: 'test-2',
      },
    ],
  });
  (KickbackImage.prototype.uploadImage as jest.Mock).mockResolvedValueOnce('test-2');
  (Events.prototype.edit as jest.Mock).mockResolvedValueOnce('test-2');

  await renderHistoryCard();

  act(() => {
    fireEvent.press(screen.getByLabelText('View Receipt'));
  });

  await waitFor(() => expect(screen.getByLabelText('Close')).toBeTruthy());
  expect(screen.getByLabelText('Reupload Button')).toBeTruthy();

  act(() => {
    fireEvent.press(screen.getByLabelText('Reupload Button'));
  });

  await waitFor(() => expect(screen.getByLabelText('View Receipt')).toBeTruthy());

  expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
  expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
});

// Open and close the image modal
test('History Card - Image Modal - As Invitee', async () => {
  event.receipt = 'test';
  event.hostId = '02';

  await renderHistoryCard();

  await waitFor(() => expect(screen.getByLabelText('View Receipt')).toBeTruthy());

  act(() => {
    fireEvent.press(screen.getByLabelText('View Receipt'));
  });

  await waitFor(() => expect(screen.getByLabelText('Close')).toBeTruthy());
  expect(screen.getByText('Receipt')).toBeTruthy();

  act(() => {
    fireEvent.press(screen.getByLabelText('Close'));
  });
});

test('History Card - Image Modal w/o Image - As Invitee', async () => {
  event.hostId = '02';

  await renderHistoryCard();

  await waitFor(() => expect(screen.getByLabelText('View Receipt')).toBeTruthy());

  act(() => {
    fireEvent.press(screen.getByLabelText('View Receipt'));
  });

  await waitFor(() => expect(screen.getByLabelText('Close')).toBeTruthy());
  expect(screen.getByText('No Receipt Uploaded')).toBeTruthy();
});

test('History Card - Paid Status is True - As Attendee', async () => {
  event.hostId = '02';

  await renderHistoryCard();

  await waitFor(() => expect(screen.getByText('paid')).toBeTruthy());
});

test('History Card - Paid Status is False - As Attendee', async () => {
  event.hostId = '02';
  event.paidStatus = [
    {
      id: '12345',
      status: false,
    },
  ];

  await renderHistoryCard();

  await waitFor(() => expect(screen.getByText('unpaid')).toBeTruthy());
});

// Uploading an image caused an error in the KickbackImage class
test('History Card - Image Modal Reupload - Error', async () => {
  event.receipt = 'test';

  (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
    status: 'granted',
  });
  (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
    assets: [
      {
        uri: 'test-2',
      },
    ],
  });
  (KickbackImage.prototype.uploadImage as jest.Mock).mockRejectedValueOnce('Error uploading image');

  await renderHistoryCard();

  act(() => {
    fireEvent.press(screen.getByLabelText('View Receipt'));
  });

  await waitFor(() => expect(screen.getByLabelText('Close')).toBeTruthy());
  expect(screen.getByText('Receipt')).toBeTruthy();

  act(() => {
    fireEvent.press(screen.getByLabelText('Reupload Button'));
  });

  await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

  expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
  expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
});
