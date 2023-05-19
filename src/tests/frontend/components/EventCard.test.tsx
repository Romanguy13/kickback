import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, View } from 'react-native';
import React from 'react';
import EventCard from '../../../components/EventCard';

const renderSimple = async () =>
  render(
    <EventCard
      event={{
        id: '12345',
        hostId: '12346',
        name: 'Test Event',
        location: 'Test Location',
        date: '10/10/2023',
        status: null,
        time: '10:00',
        gId: '12347',
        createdAt: 'Test Date',
        updatedAt: 'Test Time',
      }}
      navigation={{
        navigate: jest.fn(),
      }}
    />
  );

test('Renders Event Card', async () => {
  await renderSimple();

  expect(screen.getByText('Test Event')).toBeTruthy();
  expect(screen.getByText('Test Location')).toBeTruthy();
  expect(screen.getByText('10:00')).toBeTruthy();
  expect(screen.getByText('10/10/2023')).toBeTruthy();
  expect(screen.getByText('Pending')).toBeTruthy();
});

test('Click Event Card', async () => {
  await renderSimple();

  expect(screen.getByText('Test Event')).toBeTruthy();
  expect(screen.getByText('Test Location')).toBeTruthy();
  expect(screen.getByText('10:00')).toBeTruthy();
  expect(screen.getByText('10/10/2023')).toBeTruthy();
  expect(screen.getByText('Pending')).toBeTruthy();
  await fireEvent.press(screen.getByText('Test Event'));
});

// will need to update tests to check when the status changes to going