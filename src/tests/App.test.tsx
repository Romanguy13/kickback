import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '../../App';

test('Renders Welcome Screen', async () => {
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
  // expect(screen.getByText('Login')).toBeTruthy();
  expect(screen.getByText('Please sign in to your account.')).toBeTruthy();
  expect(screen.getByText('Email')).toBeTruthy();
  expect(screen.getByPlaceholderText('kickback@email.com')).toBeTruthy();
  expect(screen.getByText('Password')).toBeTruthy();
  expect(screen.getByPlaceholderText('mypassword123')).toBeTruthy();
  expect(screen.getByText("Don't have an account? ")).toBeTruthy();
  expect(screen.getByText('Sign Up!')).toBeTruthy();
});

test('Clicking SignUp Button', async () => {
  render(<App />);
  expect(screen.getByText('KickBack')).toBeTruthy();
  expect(screen.getByText('Sign Up')).toBeTruthy();
  fireEvent.press(screen.getByText('Sign Up'));
  expect(screen.getByText('Create Account')).toBeTruthy();
  expect(screen.getByText('Welcome to KickBack!')).toBeTruthy();
  expect(screen.getByText('Name')).toBeTruthy();
  expect(screen.getByPlaceholderText('First Last')).toBeTruthy();
  expect(screen.getByText('Email')).toBeTruthy();
  expect(screen.getByPlaceholderText('kickback@email.com')).toBeTruthy();
  expect(screen.getByText('Password')).toBeTruthy();
  expect(screen.getByPlaceholderText('mypassword123')).toBeTruthy();
  expect(screen.getByText('Confirm Password')).toBeTruthy();
  expect(screen.getByPlaceholderText('retype password')).toBeTruthy();
  expect(screen.getByText('Sign Up')).toBeTruthy();
  expect(screen.getByText('Already have an account? ')).toBeTruthy();
  expect(screen.getByText('Login!')).toBeTruthy();
});
