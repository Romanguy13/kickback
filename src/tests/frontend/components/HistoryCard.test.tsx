import { fireEvent, render, waitFor, screen } from '@testing-library/react-native';
import { Timestamp } from 'firebase/firestore';
import HistoryCard from '../../../navigation/screens/HistoryCard';
import { EventReturn } from '../../../resources/schema/event.model';

const event: EventReturn = {
  id: '124',
  hostId: '12345',
  name: 'Name',
  location: 'Location',
  date: 'April 23, 2023',
  time: '5:00 PM',
  gId: '123',
  updatedAt: new Timestamp(2, 2),
  createdAt: new Timestamp(2, 2),
};

test('History Card Renders', async () => {
  render(<HistoryCard event={event} navigation={jest.fn()} />);
});

test('History Card - Able to Click', async () => {
  const navigate = jest.fn();
  render(<HistoryCard event={event} navigation={{ navigate }} />);

  await waitFor(async () => {
    await fireEvent.press(screen.getByText('Name'));
  });

  expect(navigate).toHaveBeenCalled();
});
