import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { FiPlus, FiMinus } from "react-icons/fi";
import {
  removeFromCart,
  updateCartItem,
  clearCart,
  syncUserCart,
} from "../../features/cartSlice";
import {
  addCartItem,
  updateCartItemAPI,
  deleteCartItemAPI,
} from "../../features/cartAPI";

const CartPage = () => {
  const user = useSelector((state) => state.user.userInfo);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.token) {
      dispatch(syncUserCart(user.token));
    }
  }, []);

  const incrementQuantity = async (item) => {
    if (item.qty < item.countInStock) {
      dispatch(updateCartItem({ ...item, qty: item.qty + 1 }));
      if (user && user.token && item.cartId) {
        await updateCartItemAPI(item.cartId, item.qty + 1, user.token);
      }
    }
  };

  const decrementQuantity = async (item) => {
    if (item.qty > 1) {
      dispatch(updateCartItem({ ...item, qty: item.qty - 1 }));
      if (user && user.token && item.cartId) {
        await updateCartItemAPI(item.cartId, item.qty - 1, user.token);
      }
    }
  };

  const removeItem = async (item) => {
    dispatch(removeFromCart(item));
    if (user && user.token && item.cartId) {
      await deleteCartItemAPI(item.cartId, user.token);
    }
  };

  const handleClearCart = async () => {
    for (const item of cartItems) {
      if (user && user.token && item.cartId) {
        await deleteCartItemAPI(item.cartId, user.token);
      }
    }
    dispatch(clearCart());
  };

  const getOriginalPrice = (item) => item.originalPrice || item.price;
  const getDiscountedPrice = (item) => {
    if (item.discount && item.discount > 0) {
      return getOriginalPrice(item) - (getOriginalPrice(item) * item.discount) / 100;
    }
    return getOriginalPrice(item);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getDiscountedPrice(item) * item.qty,
    0
  );
  const shippingFee = cartItems.length > 0 ? 200 : 0;
  const total = subtotal + shippingFee;
  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.discount && item.discount > 0) {
      return sum + ((getOriginalPrice(item) - getDiscountedPrice(item)) * item.qty);
    }
    return sum;
  }, 0);
  const uniqueProductCount = cartItems.length;
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <section className="section py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Shopping Cart
                </h2>
                <p className="text-gray-600">
                  <span className="font-bold text-red-500">
                    {uniqueProductCount}
                  </span> Items |{" "}
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
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div
                        key={item._id + item.size}
                        className="py-6 flex flex-col sm:flex-row gap-4"
                      >
                        <div className="w-full sm:w-1/6 flex-shrink-0">
                          <Link
                            to={`/product/${item._id}`}
                            className="block aspect-square overflow-hidden rounded-md"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                            />
                          </Link>
                        </div>

                        <div className="flex-grow relative">
                          <div className="flex justify-between">
                            <div>
                              <span className="text-sm text-gray-500">
                                {item.brand}
                              </span>
                              <h3 className="text-lg font-medium text-gray-800 hover:text-red-600 transition-colors">
                                <Link to={`/product/${item._id}`}>
                                  {item.name}
                                </Link>
                              </h3>
                            </div>
                            <button
                              onClick={() => removeItem(item)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <IoCloseSharp className="text-xl" />
                            </button>
                          </div>

                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              {item.discount && item.discount > 0 ? (
                                <>
                                  <span className="text-lg font-bold text-red-600">
                                    Rs {getDiscountedPrice(item).toFixed(2)}
                                  </span>
                                  <span className="text-sm line-through text-gray-500 pl-2">
                                    Rs {getOriginalPrice(item).toFixed(2)}
                                  </span>
                                  <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 text-xs rounded">
                                    -{item.discount}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-red-600">
                                  Rs {getOriginalPrice(item).toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center border border-gray-300 rounded-md w-fit">
                              <button
                                onClick={() => decrementQuantity(item)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                disabled={item.qty <= 1}
                                aria-label="Decrease quantity"
                              >
                                <FiMinus />
                              </button>
                              <span className="px-4 py-1 text-center w-12">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => incrementQuantity(item)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                disabled={item.qty >= item.countInStock}
                                aria-label="Increase quantity"
                              >
                                <FiPlus />
                              </button>
                            </div>

                            <div className="text-lg font-bold text-gray-800">
                              Rs {(getDiscountedPrice(item) * item.qty).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <Link
                      to="/products"
                      className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      ← Continue Shopping
                    </Link>
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {cartItems.length > 0 && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({uniqueProductCount} items)
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
                    <span className="font-medium text-red-600">
                      - Rs {totalDiscount.toFixed(2)}
                    </span>
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
