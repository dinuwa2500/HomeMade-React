import React from 'react';
import SideBar from '../../components/SideBar';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItems from '../../components/ProductItems';
import { Button } from '@mui/material';
import { IoGridSharp } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu'

const ProductListing = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/fashions">
              Fashion
            </Link>
          </Breadcrumbs>
        </div>
      </div>

      <div className="bg-white p-3 mt-4">
        <div className="container flex gap-3">
          <div className="sidebarWrapper w-[20%] h-full bg-white">
            <SideBar />
          </div>

          <div className="rightContent w-[80%]">
            <div className="bg-[#f1f1f1] p-2 w-full mb-3 rounded-md flex items-center justify-between">
              <div className="col1 flex items-center gap-1 ">
                <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full flex items-center justify-between !text-[#000]">
                  <IoGridSharp className="text-[rgba(0,0,0,0.7)]" />
                </Button>
                <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full flex items-center justify-between !text-[#000]">
                  <LuMenu className="text-[rgba(0,0,0,0.7)]" />
                </Button>

                <span className='text-[14px] font-[500] pl-3'>There are 27 products</span>

              </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
              <ProductItems />
              <ProductItems />
              <ProductItems />
              <ProductItems />
              <ProductItems />
              <ProductItems />
              <ProductItems />
              <ProductItems />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
