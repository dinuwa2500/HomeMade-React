import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  // Dummy order data
  const orders = [
    {
      id: 'ORD-2023-001',
      date: '2023-05-15',
      status: 'Delivered',
      total: 5245.0,
      items: [
        {
          id: 1,
          name: 'Handwoven Cotton Sarong',
          price: 2500.0,
          quantity: 1,
          image:
            'https://ekade.lk/wp-content/uploads/2023/06/8a20492ae76871335281b497742ea10b-420x420.jpg',
          deliveredOn: '2023-05-18',
        },
        {
          id: 2,
          name: 'Ceylon Spice Gift Pack',
          price: 2745.0,
          quantity: 1,
          image:
            'https://img.drz.lazcdn.com/static/lk/p/bd72b669af3b6e229dbc2b90ced263d9.jpg_400x400q75.avif',
          deliveredOn: '2023-05-18',
        },
      ],
    },
    {
      id: 'ORD-2023-002',
      date: '2023-06-22',
      status: 'Shipped',
      total: 3890.0,
      items: [
        {
          id: 3,
          name: 'Traditional Wooden Mask',
          price: 1890.0,
          quantity: 1,
          image:
            'https://img.drz.lazcdn.com/static/lk/p/23ffb6983d8b8d6d935c522c2b4e3f48.jpg_400x400q75.avif',
        },
        {
          id: 4,
          name: 'Handmade Ceramic Vase',
          price: 2000.0,
          quantity: 1,
          image:
            'https://img.drz.lazcdn.com/static/lk/p/91339f8f8341f65fce3a0e9c56d51382.jpg_400x400q75.avif',
        },
      ],
    },
    {
      id: 'ORD-2023-003',
      date: '2023-07-05',
      status: 'Processing',
      total: 1450.0,
      items: [
        {
          id: 5,
          name: 'Pure Ceylon Tea Sampler',
          price: 1450.0,
          quantity: 1,
          image:
            'https://img.drz.lazcdn.com/static/lk/p/adeb88518b71436e970fe76f09c9d444.jpg_400x400q75.avif',
        },
      ],
    },
  ];

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage your recent purchases
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-2 text-gray-500">
              You haven't placed any orders yet.
            </p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200"
              >
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Placed on {order.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <p className="text-lg font-semibold text-gray-900">
                        Rs {order.total.toFixed(2)}
                      </p>
                      <button
                        onClick={() => toggleOrder(order.id)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        {expandedOrder === order.id
                          ? 'Hide details'
                          : 'View details'}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Order Items
                    </h4>
                    <div className="space-y-6">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                        >
                          <div className="flex-shrink-0 mb-4 sm:mb-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 rounded-md object-cover"
                            />
                          </div>
                          <div className="flex-1 sm:ml-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <h5 className="text-base font-medium text-gray-900">
                                  {item.name}
                                </h5>
                                <p className="mt-1 text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <p className="mt-2 sm:mt-0 text-lg font-semibold text-gray-900">
                                Rs {item.price.toFixed(2)}
                              </p>
                            </div>
                            {item.deliveredOn && (
                              <p className="mt-2 text-sm text-gray-500">
                                Delivered on {item.deliveredOn}
                              </p>
                            )}
                            <div className="mt-4 flex space-x-4">
                              <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Buy it again
                              </button>
                              <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                View product
                              </button>
                              {order.status === 'Delivered' && (
                                <button
                                  type="button"
                                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  Leave review
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h5 className="text-sm font-medium text-gray-900">
                          Shipping Address
                        </h5>
                        <p className="mt-1 text-sm text-gray-500">
                          123 Main St
                          <br />
                          Colombo 01
                          <br />
                          Sri Lanka
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          Payment Method
                        </h5>
                        <p className="mt-1 text-sm text-gray-500">
                          Credit card ending in 4242
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Total: Rs {order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
