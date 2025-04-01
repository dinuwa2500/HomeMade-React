import React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './style.css';
import { Link } from 'react-router-dom';

import { FaRegHeart } from 'react-icons/fa';
import { IoGitCompareOutline } from 'react-icons/io5';
import { MdZoomOutMap } from 'react-icons/md';
import { Button } from '@mui/material';

const ProductItems = () => {
  return (
    <div className="ProductItems shadow-lg rounded-md overflow-hidden border-1  border-[rgba(0,0,0,0.1)]">
      <div className="img-wrapper group rounded-md w-full h-[250px] overflow-hidden">
        <img
          src="https://ekade.lk/wp-content/uploads/2023/06/8a20492ae76871335281b497742ea10b-420x420.jpg"
          alt=""
          className="w-full"
        />

        <div className="actions absolute top-[-200px] right-[-12px] flex items-center gap-2 flex-col w-[80px] z-50 transition-all  duration-400 group-hover:top-[15px]">
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

      <div className="info p-3  ">
        <h6 className="text-[12px]">
          <Link to="/" className="link">
            Green and Orange
          </Link>
        </h6>
        <h3 className="text-[16px] title mt-2 mb-2 font-[500] text-[rgba(0,0,0,0.9)]">
          <Link to="/" className="link">
            Handloom Sarong
          </Link>
        </h3>
        <Rating name="size-small" defaultValue={4} size="small" readOnly />

        <div className="flex items-center font-[500] text-[16px]">
          <span>Rs.1500</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItems;
