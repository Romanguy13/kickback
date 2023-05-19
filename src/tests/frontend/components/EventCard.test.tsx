import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import moment from 'moment';
import { Timestamp } from 'firebase/firestore';
import EventCard from '../../../components/EventCard';

const renderSimple = async () => {
  const randomTime = moment('10/10/2023 10:00 PM', 'MM/DD/YYYY hh:mm AA').toDate();

  console.log(randomTime);

  render(
    <EventCard
      event={{
        id: '12345',
        hostId: '12346',
        name: 'Test Event',
        location: 'Test Location',
        datetime: Timestamp.fromDate(randomTime),
        gId: '12347',
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        inviteeStatus: [],
      }}
      navigation={{
        navigate: jest.fn(),
      }}
    />
  );
};

test('Renders Event Card', async () => {
  await renderSimple();

  expect(screen.getByText('Test Event')).toBeTruthy();
  expect(screen.getByText('Test Location')).toBeTruthy();
  expect(screen.getByText('10:00 PM')).toBeTruthy();
  expect(screen.getByText('October 10, 2023')).toBeTruthy();
});

test('Click Event Card', async () => {
  await renderSimple();

  expect(screen.getByText('Test Event')).toBeTruthy();
  expect(screen.getByText('Test Location')).toBeTruthy();
  expect(screen.getByText('10:00 PM')).toBeTruthy();
  expect(screen.getByText('October 10, 2023')).toBeTruthy();

  await fireEvent.press(screen.getByText('Test Event'));
});
