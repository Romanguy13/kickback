import { render } from '@testing-library/react-native';
import HistoryCard from '../../../navigation/screens/HistoryCard';

test('renders', async () => {
  render(<HistoryCard eventId="test" eventLocation="test" eventName="Name" />);
});
