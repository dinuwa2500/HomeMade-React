import { render, screen } from '@testing-library/react';
import Deliveries from './index';

test('renders My Deliveries page', () => {
  render(<Deliveries />);
  expect(screen.getByText(/My Deliveries/i)).toBeInTheDocument();
});
