import React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './style.css';
import { Link } from 'react-router-dom';

import { FaRegHeart } from 'react-icons/fa';
import { IoGitCompareOutline } from 'react-icons/io5';
import { MdZoomOutMap } from 'react-icons/md';
import { Button } from '@mui/material';

const ProductItems = ({ product }) => {
  const demo = {
    images: [
      'https://ekade.lk/wp-content/uploads/2023/06/8a20492ae76871335281b497742ea10b-420x420.jpg',
    ],
    name: 'Handloom Sarong',
    price: 1999,
    discount: 0,
    rating: 4.5,
    _id: 'demo',
    brand: 'Demo',
  };
  const p = product || demo;
  return (
    <div className="ProductItems shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)]">
      <div className="img-wrapper group relative rounded-md w-full h-[250px] overflow-hidden">
        <Link to={`/product/${p._id}`} className="block group">
          <img
            src={p.images?.[0] || "/placeholder.jpg"}
            alt={p.name}
            className="w-full h-56 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="actions absolute top-[-200px] right-[-12px] flex items-center gap-2 flex-col w-[80px] z-50 transition-all duration-300 group-hover:top-[15px]">
          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full"
            sx={{
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'black',
                color: 'white',
              },
            }}
          >
            <MdZoomOutMap className="text-[18px]" />
          </Button>
          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full"
            sx={{
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'black',
                color: 'white',
              },
            }}
          >
            <IoGitCompareOutline className="text-[18px]" />
          </Button>
          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full"
            sx={{
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'black',
                color: 'white',
              },
            }}
          >
            <FaRegHeart className="text-[18px]" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Link to={`/product/${p._id}`} className="block font-semibold text-lg mb-1 hover:text-blue-600 transition-colors">
          {p.name}
        </Link>
        <div className="flex items-center gap-2 mb-2">
          {p.discount && p.discount > 0 ? (
            <>
              <span className="text-red-600 font-bold text-xl">Rs.{p.price - (p.price * p.discount) / 100}</span>
              <span className="line-through text-gray-400">Rs.{p.price}</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 text-xs rounded">-{p.discount}%</span>
            </>
          ) : (
            <span className="text-gray-900 font-bold text-xl">Rs.{p.price}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Stack spacing={1}>
            <Rating name="product-rating" value={Number(p.rating) || 0} precision={0.5} readOnly size="small" />
          </Stack>
          <span className="text-xs text-gray-500">{p.brand}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItems;
