import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import EventGroups from '../../../navigation/screens/EventGroups';
import GroupMembers from '../../../resources/api/groupMembers';
import Groups from '../../../resources/api/groups';

jest.mock('firebase/firestore');
jest.mock('../../../resources/api/kickbackFirebase');
jest.mock('../../../resources/api/groupMembers');
jest.mock('../../../resources/api/groups');

const Stack = createNativeStackNavigator();
function GroupDetailsMock(): JSX.Element {
  return <View />;
}

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventGroups" component={EventGroups} />
        <Stack.Screen name="GroupDetails" component={GroupDetailsMock} />
      </Stack.Navigator>
    </NavigationContainer>
  );

test('renders', async () => {
  // Calls a GroupMembers GetAll
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([]);
  render(<EventGroups />);
});

test('Render Groups', async () => {
  // Calls a GroupMembers GetAll
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([{ groupId: '12345' }]);

  // Calls for Groups.get for each group
  (Groups.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'Android Gang',
    id: '12345',
  });

  render(<EventGroups />);

  await waitFor(() => {
    expect(screen.getByText('Android Gang')).toBeTruthy();
  });
});

test('Render Groups - Able to Click', async () => {
  // Calls a GroupMembers GetAll
  (GroupMembers.prototype.getAll as jest.Mock).mockResolvedValueOnce([{ groupId: '12345' }]);

  // Calls for Groups.get for each group
  (Groups.prototype.get as jest.Mock).mockResolvedValueOnce({
    name: 'Android Gang',
    id: '12345',
  });

  renderWithNavigation();

  await waitFor(() => {
    expect(screen.getByText('Android Gang')).toBeTruthy();
  });

  const group = screen.getByText('Android Gang');
  act(() => {
    fireEvent.press(group);
  });
});
