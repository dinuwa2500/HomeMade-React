import React from 'react';
import CategoryCollapse from '../CategoryCollapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../SideBar/style.css';

const categories = [
  'Agricultural Products',
  'Bags',
  'Bamboo Products',
  'Batik Wear',
  'Beauty And Cosmetics',
  'Bedsheets',
  
];

const SideBar = () => {
  return (
    <aside className="sidebar ">
      <div className="box">
        <h2 className="mb-3 text-[16px] font-[600]">Shop by category</h2>
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
      </div>
    </aside>
  );
};

export default SideBar;
