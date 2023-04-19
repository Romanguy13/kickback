import { render, screen } from '@testing-library/react-native';
import Template from '../../components/template';

test('renders hello world', async () => {
  render(<Template />);
  expect(screen.getByText('Hello World')).toBeTruthy();
});
