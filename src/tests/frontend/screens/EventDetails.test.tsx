import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventDetail from '../../../navigation/screens/EventDetail';
import Events from '../../../resources/api/events';
import GroupMembers from '../../../resources/api/groupMembers';
import Groups from '../../../resources/api/groups';

// import '@testing-library/jest-dom';
jest.mock('../../../resources/api/events');
jest.mock('../../../resources/api/groupMembers');
jest.mock('../../../resources/api/groups');

const Stack = createNativeStackNavigator();

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventDetail" component={EventDetail} initialParams={mockRoute} />
      </Stack.Navigator>
    </NavigationContainer>
  );

const mockRoute = {
  params: {
    event: {
      name: 'Test Event',
      date: '2022-01-01',
      time: '12:00 PM',
      location: 'Test Location',
      user: 'Test User',
    },
  },
};

describe('EventDetail', () => {
  it('renders event details correctly', async () => {
    (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([
      {
        userId: '1',
        groupId: '1',
      },
    ]);
    const { getByText } = render(<EventDetail route={mockRoute} />);

    await waitFor(() => {
      expect(getByText('Test Event')).toBeTruthy();
      // expect(getByText('2022-01-01')).toBeTruthy();
      // expect(getByText('12:00 PM')).toBeTruthy();
      // expect(getByText('Test Location')).toBeTruthy();
    });
  });
});
