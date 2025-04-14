import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import { FiPlus, FiMinus } from 'react-icons/fi';

const CartPage = () => {
  // Initial cart data with state
  const initialCartItems = [
    {
      id: 1,
      name: 'Palmyra Basket',
      brand: 'No Brand',
      price: 345.0,
      quantity: 2,
      image: 'https://ekade.lk/wp-content/uploads/2017/09/Palmyra-Basket-3.jpg',
      stock: 10,
    },
    {
      id: 2,
      name: 'Handloom Sarong',
      brand: 'Traditional Crafts',
      price: 1700.0,
      quantity: 1,
      image:
        'https://ekade.lk/wp-content/uploads/2023/06/8a20492ae76871335281b497742ea10b-420x420.jpg',
      stock: 5,
    },
    {
      id: 3,
      name: 'Palmyra Basket Design-2',
      brand: 'Traditional Crafts',
      price: 500.0,
      quantity: 3,
      image:
        'https://ekade.lk/wp-content/uploads/2023/06/466494a68509bd68ff1eb52e6a105f54.jpg',
      stock: 5,
    },
  ];

  const [cartItems, setCartItems] = useState(initialCartItems);

  // Increment item quantity
  const incrementQuantity = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrement item quantity
  const decrementQuantity = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove single item
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 200;
  const total = subtotal + shippingFee;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="section py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Shopping Cart
                </h2>
                <p className="text-gray-600">
                  <span className="font-bold text-red-500">{itemCount}</span>{' '}
                  {itemCount === 1 ? 'Item' : 'Items'} in your cart
                </p>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium text-gray-600 mb-4">
                    Your cart is empty
                  </h3>
                  <Link
                    to="/products"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="py-6 flex flex-col sm:flex-row gap-4"
                      >
                        {/* Product Image */}
                        <div className="w-full sm:w-1/6 flex-shrink-0">
                          <Link
                            to={`/product/${item.id}`}
                            className="block aspect-square overflow-hidden rounded-md"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                            />
                          </Link>
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow relative">
                          <div className="flex justify-between">
                            <div>
                              <span className="text-sm text-gray-500">
                                {item.brand}
                              </span>
                              <h3 className="text-lg font-medium text-gray-800 hover:text-red-600 transition-colors">
                                <Link to={`/product/${item.id}`}>
                                  {item.name}
                                </Link>
                              </h3>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <IoCloseSharp className="text-xl" />
                            </button>
                          </div>

                          {/* Price and Quantity */}
                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="text-lg font-bold text-red-600">
                              Rs {item.price.toFixed(2)}
                            </div>

                            <div className="flex items-center border border-gray-300 rounded-md w-fit">
                              <button
                                onClick={() => decrementQuantity(item.id)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <FiMinus />
                              </button>
                              <span className="px-4 py-1 text-center w-12">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => incrementQuantity(item.id)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                disabled={item.quantity >= item.stock}
                                aria-label="Increase quantity"
                              >
                                <FiPlus />
                              </button>
                            </div>

                            <div className="text-lg font-bold text-gray-800">
                              Rs {(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Shopping */}
                  <div className="mt-6 flex justify-between items-center">
                    <Link
                      to="/products"
                      className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      ← Continue Shopping
                    </Link>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary (only show if items exist) */}
          {cartItems.length > 0 && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({itemCount} items)
                    </span>
                    <span className="font-medium">
                      Rs {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      Rs {shippingFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-red-600">- Rs 0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-bold text-red-600">
                    Rs {total.toFixed(2)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md text-center transition-colors"
                >
                  Proceed to Checkout
                </Link>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  Free shipping on orders over Rs 2000
                </p>
              </div>

              {/* Payment Methods */}
              <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                <h4 className="font-medium text-gray-800 mb-3">We Accept</h4>
                <div className="flex gap-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
                    alt="Visa"
                    className="h-8"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
                    alt="Mastercard"
                    className="h-8"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/825/825454.png"
                    alt="PayPal"
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CartPage;
