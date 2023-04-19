import { render, screen } from '@testing-library/react-native';
import Home from '../../screens/Home';

test('Renders Home Screen', async () => {
  render(<Home />);
  expect(screen.getByText('KickBack')).toBeTruthy();
});
