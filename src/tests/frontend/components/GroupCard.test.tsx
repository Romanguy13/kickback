import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import GroupCard from '../../../components/GroupCard';

const Stack = createNativeStackNavigator();

function MockLogin(): JSX.Element {
  return <View />;
}
const renderSimple = async () =>
  render(
    <GroupCard
      item={{
        group: {
          id: '12345',
          name: 'Test Group But It Is Very Long Oops',
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
        },
        navigation: jest.fn(),
        events: [
          {
            id: '12346',
            hostId: '12347',
            name: 'Test Event',
            location: 'Test Location',
            date: 'Test Date',
            time: 'Test Time',
            gId: '12345',
            createdAt: serverTimestamp() as Timestamp,
            updatedAt: serverTimestamp() as Timestamp,
          },
        ],
        extraMembers: 0,
        topMembers: [],
      }}
    />
  );

test('Renders Group Card', async () => {
  await renderSimple();

  expect(screen.getByText('Test Group But ...')).toBeTruthy();
});
