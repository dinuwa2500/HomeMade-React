import Deliveries from './index';
import DeliveryDetails from './DeliveryDetails';

export const deliveriesRoutes = [
  {
    path: '/deliveries',
    element: <Deliveries />,
  },
  {
    path: '/deliveries/:orderId',
    element: <DeliveryDetails />,
  },
];
