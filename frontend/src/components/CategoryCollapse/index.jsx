import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/1-2.png',
    name: 'Agricultural Products',
    link: '/category/agricultural-products',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/2.png',
    name: 'Bags',
    link: '/category/bags',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/3.png',
    name: 'Bamboo Products',
    link: '/category/bamboo-products',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/4.png',
    name: 'Batik Wear',
    link: '/category/batik-wear',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/5.png',
    name: 'Beauty And Cosmetics',
    link: '/category/beauty-and-cosmetics',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/7.png',
    name: 'Bedsheets',
    link: '/category/bedsheets',
  },
];

const CategoryCollapse = () => {
  return (
    <div className="scroll">
      <ul className="w-full">
        {categories.map((category, index) => (
          <li className="p-3" key={index}>
            <Link to={category.link} className="w-full block">
              <Button className="w-full !text-left !justify-start !px-3 !gap-2 !text-[13px] !text-black">
                {category.name}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryCollapse;
