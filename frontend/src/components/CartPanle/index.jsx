import React from 'react';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const CartPanel = () => {
  const navigate = useNavigate();

  const cartItems = Array.from({ length: 1 }, (_, i) => ({
    id: i,
    name: 'Handloom Sarong',
    qty: 2,
    price: 1700,
    img: 'https://ekade.lk/wp-content/uploads/2023/06/8a20492ae76871335281b497742ea10b-420x420.jpg',
  }));

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ height: 'calc(100% - 55px)' }}
    >
      <div className="flex-1 overflow-y-auto py-3 px-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4 mb-2"
            >
              <div className="w-[25%] h-[80px] rounded-md overflow-hidden">
                <Link to="/product/5463">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              <div className="w-[75%] pr-5 relative">
                <h4 className="text-[14px] font-medium">{item.name}</h4>
                <p className="flex items-center gap-5 mt-2 mb-2 text-sm">
                  <span>
                    Qty: <strong>{item.qty}</strong>
                  </span>
                  <span className="text-red-600 font-bold">
                    Price: Rs.{item.price}
                  </span>
                </p>
                <MdOutlineDeleteOutline className="absolute top-0 right-0 text-xl text-gray-500 hover:text-red-600 cursor-pointer" />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>
      <div className="w-full border-t border-[rgba(0,0,0,0.1)] py-3 px-4 bg-white">
        <div className="flex justify-between w-full">
          <span className="text-[14px] font-[600]">
            Total Items: {totalQty}
          </span>
          <span className="text-sm font-bold text-red-500">
            Total: Rs. {totalPrice}
          </span>
        </div>

        <div className="flex justify-between w-full mt-2">
          <span className="text-[14px] font-[600]">Shipping</span>
          <span className="text-[14px] font-bold text-red-500">Rs. 200</span>
        </div>

        <div className="flex justify-between w-full border-t mt-3 border-[rgba(0,0,0,0.1)] py-3">
          <span className="text-[14px] font-[600]">Total Price</span>
          <span className="text-[14px] font-bold text-red-500">
            Rs. {totalPrice + 200}
          </span>
        </div>

        <div className="flex justify-between w-full">
          <span className="text-[14px] font-[600]">Discount</span>
          <span className="text-[14px] font-bold text-red-500">Rs. 0</span>
        </div>

        <div className="flex gap-3 mt-3 w-full">
          <Button
            className="w-full !bg-red-600 !text-white hover:!bg-red-700"
            onClick={() => navigate('/cart')}
          >
            View Cart
          </Button>
          <Button
            className="w-full !bg-red-600 !text-white hover:!bg-red-700"
            onClick={() => navigate('/checkout')}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
