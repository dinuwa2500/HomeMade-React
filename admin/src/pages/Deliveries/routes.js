import AdminDeliveries from './index';
import AdminDeliveryDetails from './DeliveryDetails';

export const adminDeliveriesRoutes = [
  {
    path: '/deliveries',
    element: <AdminDeliveries />,
  },
  {
    path: '/deliveries/:orderId',
    element: <AdminDeliveryDetails />,
  },
];
