import { act, render, screen } from '@testing-library/react-native';
import EventGroups from '../../../navigation/screens/EventGroups';
import GroupMembers from '../../../resources/api/groupMembers';
import Groups from '../../../resources/api/groups';

jest.mock('firebase/firestore');
jest.mock('../../../resources/api/kickbackFirebase');
jest.mock('../../../resources/api/groupMembers');
jest.mock('../../../resources/api/groups');

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
  await act(async () => {
    expect(screen.getByText('Android Gang')).toBeTruthy();
  });
});
