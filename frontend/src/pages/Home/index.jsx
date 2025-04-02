import React from 'react';
import HomeSlider from '../../components/HomeSlider';
import HomeCatSlider from '../../components/HomeCatSlider';
import { LiaShippingFastSolid } from 'react-icons/lia';
import AdsBannerSlider from '../../components/AdsBannerSlider';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ProductsSlider from '../../components/ProductsSlider';


const Home = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <HomeSlider />
      <HomeCatSlider />

      <section className="py-5 bg-white">
        <div className="container">
          <div className="flex item-center justify-between">
            <div className="leftSec">
              <h3 className="text-[22px] font-[600]">Popular Products</h3>
            </div>

            <div className="rightSec w-[75%] ">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Fashion" />
                <Tab label="Bamboo Products" />
                <Tab label="Bowls" />
                <Tab label="Bags" />
                <Tab label="Carpets" />
              </Tabs>
            </div>
          </div>

          <ProductsSlider items={5} />
        </div>
      </section>

      <section className="py-5 bg-white ">
        <div className="container">
          <div className="freeShipping w-[80%] m-auto p-4 py-2 border border-[red] flex items-center justify-between">
            <div className="col1 flex items-center gap-4 ">
              <LiaShippingFastSolid className="text-[50px]" />
              <span className="text-[20px] font-[600]">Free Shipping </span> |
            </div>
            <div className="col2 mb-0 font-[500] ">
              <p>Free Delivery Now On Your First Order and over Rs.2000</p>
            </div>
            |<p className="font-bold text-[30px]">Only Rs.2000</p>
          </div>

          <AdsBannerSlider items={3} />
        </div>
      </section>

      <section className="py-5 bg-white ">
        <div className="container ">
          <div className="leftsec p-5">
            <h2 className="text-[20px] font-[600]">Latest Products</h2>
            <ProductsSlider items={5} />
          </div>
        </div>
      </section>


      <br />
      <br />
    </>
  );
};

export default Home;
