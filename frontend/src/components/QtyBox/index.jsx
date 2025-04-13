import { Button } from '@mui/material';
import React from 'react';
import { FaAngleUp } from 'react-icons/fa6';
import { FaAngleDown } from 'react-icons/fa6';
import { useState } from 'react';


const QtyBox = () => {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Prevent less than 1

  return (
    <div className="qtyBox flex items-center">
      <input
        type="number"
        value={quantity}
        readOnly
        className="w-full h-[40px] p-2 text-[15px] text-center focus:outline-none border border-[rgba(0,0,0,0.3)] rounded-md"
      />

      <div className="flex items-center flex-col justify-between h-[40px] ml-5">
        <Button
          onClick={increment}
          className="!min-w-[30px] !w-[30px] !h-[20px] !text-black !p-0"
        >
          <FaAngleUp />
        </Button>
        <Button
          onClick={decrement}
          className="!min-w-[30px] !w-[30px] !h-[20px] !text-black !p-0"
        >
          <FaAngleDown />
        </Button>
      </div>
    </div>
  );
};

export default QtyBox;
