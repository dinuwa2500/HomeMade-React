import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyList = () => {
  const purchaseHistory = [
    {
      id: 1,
      name: 'Palmyra Basket',
      brand: 'No Brand',
      price: 345.0,
      quantity: 2,
      image: 'https://ekade.lk/wp-content/uploads/2017/09/Palmyra-Basket-3.jpg',
      purchasedOn: '2024-03-21',
    },
    {
      id: 2,
      name: 'Handloom Sarong',
      brand: 'Traditional Crafts',
      price: 1700.0,
      quantity: 1,
      image:
        'https://ekade.lk/wp-content/uploads/2023/06/8a20492ae76871335281b497742ea10b-420x420.jpg',
      purchasedOn: '2024-04-02',
    },
    {
      id: 3,
      name: 'Wooden Mask',
      brand: 'Ceylon Art',
      price: 1200.0,
      quantity: 1,
      image:
        'https://ekade.lk/wp-content/uploads/2023/06/000e85bc0dfc377d08fc8a8d2528ab12-420x420.jpg',
      purchasedOn: '2024-04-03',
    },
    {
      id: 4,
      name: 'Batiks T-shirt',
      brand: 'Island Wear',
      price: 950.0,
      quantity: 1,
      image:
        'https://varna.lk/wp-content/uploads/2021/01/by-the-sea-600x600.jpg',
      purchasedOn: '2024-04-04',
    },
    {
      id: 5,
      name: 'Coconut Shell Bowl',
      brand: 'Eco Goods',
      price: 450.0,
      quantity: 3,
      image:
        'https://ekade.lk/wp-content/uploads/2023/06/354be36e922d83f85313f7840e8dbd70-420x420.jpg',
      purchasedOn: '2024-04-04',
    },
    {
      id: 6,
      name: 'Tea Gift Pack',
      brand: 'Ceylon Tea',
      price: 2500.0,
      quantity: 1,
      image:
        'https://ekade.lk/wp-content/uploads/2023/06/2df12b462a55756fa6b86437dfb8193d-600x600.jpg',
      purchasedOn: '2024-04-05',
    },
  ];

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(purchaseHistory.length / itemsPerPage);

  const currentItems = purchaseHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Purchase History
          </h2>
          <p className="text-gray-500">Your past purchases with us</p>
        </div>

        {purchaseHistory.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="mx-auto max-w-md">
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
                No purchase history found
              </h3>
              <p className="mt-2 text-gray-500">
                You haven't made any purchases yet.
              </p>
              <div className="mt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.brand}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Purchased: {item.purchasedOn}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                          <div className="text-gray-600">
                            <span className="font-medium">Quantity:</span>{' '}
                            {item.quantity}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Unit Price:</span> Rs{' '}
                            {item.price.toFixed(2)}
                          </div>
                          <div className="ml-auto">
                            <span className="text-lg font-bold text-red-600">
                              Rs {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, purchaseHistory.length)}
                </span>{' '}
                of <span className="font-medium">{purchaseHistory.length}</span>{' '}
                results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium ${
                        currentPage === index + 1
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MyList;
