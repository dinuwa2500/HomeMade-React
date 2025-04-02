import React from 'react';
import SideBar from '../../components/SideBar';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

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
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
