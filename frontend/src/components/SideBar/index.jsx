import React from 'react';
import CategoryCollapse from '../CategoryCollapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../SideBar/style.css';
import { Collapse } from 'react-collapse';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const categories = [
  'Agricultural Products',
  'Bags',
  'Bamboo Products',
  'Batik Wear',
  'Beauty And Cosmetics',
  'Bedsheets',
];

const Availability = ['Available', 'In Stock'];

const Sizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];

const SideBar = () => {
  return (
    <aside className="sidebar ">
      <div className="box">
        <h2 className="mb-3 text-[16px] font-[600]">Shop by category</h2>
        <Collapse isOpened={false} />
        <div className="scroll px-2">
          {categories.map((category, index) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  size="small"
                  sx={{
                    color: '#000000',
                    '&.Mui-checked': {
                      color: '#000000',
                    },
                  }}
                />
              }
              label={category}
              className="w-full"
            />
          ))}
          {/*<div className="mx-[-20px]">
          {' '}
          <CategoryCollapse />
        </div>
        */}
        </div>
        <Collapse />
      </div>

      <div className="box mt-3">
        <h2 className="mb-3 text-[16px] font-[600]">Availability</h2>
        <Collapse isOpened={false} />
        <div className="scroll px-2">
          {Availability.map((category, index) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  size="small"
                  sx={{
                    color: '#000000',
                    '&.Mui-checked': {
                      color: '#000000',
                    },
                  }}
                />
              }
              label={category}
              className="w-full"
            />
          ))}
          {/*<div className="mx-[-20px]">
          {' '}
          <CategoryCollapse />
        </div>
        */}
        </div>
        <Collapse />
      </div>

      <div className="box mt-3">
        <h2 className="mb-3 text-[16px] font-[600]">Sizes</h2>
        <Collapse isOpened={false} />
        <div className="scroll px-2">
          {Sizes.map((category, index) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  size="small"
                  sx={{
                    color: '#000000',
                    '&.Mui-checked': {
                      color: '#000000',
                    },
                  }}
                />
              }
              label={category}
              className="w-full"
            />
          ))}
          {/*<div className="mx-[-20px]">
          {' '}
          <CategoryCollapse />
        </div>
        */}
        </div>
        <Collapse />
      </div>

      <div className="box mt-3  py-3">
        <h2 className="w-full mb-3 mt-3 text-[16px] font-[600] flex items-center pr-5">
          Filter By Price
        </h2>
        <RangeSlider />
        <div className="flex pt-2 pb-2 priceRange">
          <span className='text-[13px]'>
            From: <strong className="text-dark">Rs:{500}</strong>
          </span>

          <span className='ml-auto text-[13px]'>
            From: <strong className="text-dark">Rs:{1000}</strong>
          </span>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
