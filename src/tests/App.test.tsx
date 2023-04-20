import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '../../App';

test('Renders Login Screen', async () => {
  render(<App />);
  expect(screen.getByText('KickBack')).toBeTruthy();
  expect(screen.getByText('Login')).toBeTruthy();
  expect(screen.getByText('Sign Up')).toBeTruthy();
});

test('Clicking Login Button', async () => {
  render(<App />);
  expect(screen.getByText('KickBack')).toBeTruthy();
  expect(screen.getByText('Login')).toBeTruthy();
  fireEvent.press(screen.getByText('Login'));
  expect(screen.getByText('Login')).toBeTruthy();
});
