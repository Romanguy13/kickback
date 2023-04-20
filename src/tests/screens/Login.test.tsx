import { render, screen } from '@testing-library/react-native';
import Login from '../../screens/Login';

test('Renders Home Screen', async () => {
  render(<Login />);
  expect(screen.getByText('KickBack')).toBeTruthy();
});
