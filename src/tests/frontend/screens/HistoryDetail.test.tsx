import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventDetail from '../../../navigation/screens/EventDetail';
import HistoryDetail from '../../../navigation/screens/HistoryDetail';

// import '@testing-library/jest-dom';
jest.mock('../../../resources/api/events');
jest.mock('../../../resources/api/groupMembers');
jest.mock('../../../resources/api/groups');
jest.mock('../../../resources/api/users');

const Stack = createNativeStackNavigator();

const params = {
  event: {
    name: 'Test Event',
    date: '2022-01-01',
    time: '12:00 PM',
    location: 'Test Location',
    user: 'Test User',
  },
};

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HistoryDetail" component={HistoryDetail} initialParams={params} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('Renders Event Screen', async () => {
  renderWithNavigation();
  await waitFor(() => {
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});
