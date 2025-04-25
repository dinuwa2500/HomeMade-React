import { render, screen } from '@testing-library/react';
import AdminDeliveries from './index';

test('renders Delivery Management page', () => {
  render(<AdminDeliveries />);
  expect(screen.getByText(/Delivery Management/i)).toBeInTheDocument();
});
