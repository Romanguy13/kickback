import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventDetail from '../../../navigation/screens/EventDetail';
import '@testing-library/jest-dom';

const Stack = createNativeStackNavigator();

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventDetail" component={EventDetail} />
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
  it('renders event details correctly', () => {
    const { getByText } = render(<EventDetail route={mockRoute} />);
    expect(getByText('Test Event')).toBeTruthy();
    expect(getByText('2022-01-01')).toBeTruthy();
    expect(getByText('12:00 PM')).toBeTruthy();
    expect(getByText('Test Location')).toBeTruthy();
    expect(getByText('Test User')).toBeTruthy();
  });
});
