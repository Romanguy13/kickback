import {render, screen, fireEvent} from '@testing-library/react-native';
import App from '../../App';

test('renders learn react link', async () => {
  render(<App />);
  expect(screen.getByText('KickBack')).toBeTruthy();
});

test('renders create event button', async () => {
  render(<App />);
  expect(screen.getByText('Create Event')).toBeTruthy();
});

test('clicking create event button', async () => {
  render(<App />);
  expect(screen.getByText('Create Event')).toBeTruthy();
  fireEvent.press(screen.getByText('Create Event'));
  expect(screen.getByText('Create Event')).toBeTruthy();
});