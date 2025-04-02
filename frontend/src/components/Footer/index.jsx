import React from 'react';
import { LiaGiftSolid, LiaShippingFastSolid } from 'react-icons/lia';
import { PiKeyReturnLight } from 'react-icons/pi';
import { BsWallet2 } from 'react-icons/bs';
import { BiSupport } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { IoChatboxOutline } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="py-6 bg-[#fafafa]">
      <div className="container">
        <div className="flex items-center justify-center gap-9 py-8 pb-8">
          <div className="flex items-center justify-center flex-col group w-[20%]">
            <LiaShippingFastSolid className="text-[50px] transition-all duration-300 group-hover:text-red-600 group-hover:-translate-y-1" />
            <h3 className="text-[18px] font-[600]">Free Shipping</h3>
            <p className="text-[13px] font-[500]">
              For all orders Over Rs.5000
            </p>
          </div>

          <div className="flex items-center justify-center flex-col group w-[20%]">
            <PiKeyReturnLight className="text-[50px] transition-all duration-300 group-hover:text-red-600 group-hover:-translate-y-1" />
            <h3 className="text-[18px] font-[600]">30 Days Returns</h3>
            <p className="text-[13px] font-[500]">For an exchange product</p>
          </div>

          <div className="flex items-center justify-center flex-col group w-[20%]">
            <BsWallet2 className="text-[50px] transition-all duration-300 group-hover:text-red-600 group-hover:-translate-y-1" />
            <h3 className="text-[18px] font-[600]">Secured Payment</h3>
            <p className="text-[13px] font-[500]">Payment Card Accepted</p>
          </div>

          <div className="flex items-center justify-center flex-col group w-[20%]">
            <LiaGiftSolid className="text-[50px] transition-all duration-300 group-hover:text-red-600 group-hover:-translate-y-1" />
            <h3 className="text-[18px] font-[600]">Special Gifts</h3>
            <p className="text-[13px] font-[500]">Our First Product Order</p>
          </div>

          <div className="flex items-center justify-center flex-col group w-[20%]">
            <BiSupport className="text-[50px] transition-all duration-300 group-hover:text-red-600 group-hover:-translate-y-1" />
            <h3 className="text-[18px] font-[600]">Support 24/7</h3>
            <p className="text-[13px] font-[500]">Contact us anytime</p>
          </div>
        </div>
        <hr />
        <div className="flex py-8">
          <div className="w-[30%]">
            <h2 className="text-[20px] font-[600] mb-4">Contact US</h2>
            <p className="text-[13px] font-[600] pb-4">
              Craftipia - 44/3, 3rd Floor, <br />
              Narahenpita Road, Nawala, Sri Lanka.
            </p>
            <Link to="mailto:someone@example.com" className="link">
              sales@craftopia.com
            </Link>

            <span className="text-[25px] font-[600] mt-3 block w-full">
              +94 729 380 830
            </span>

            <div className="flex items-center gap-2 py-3">
              <IoChatboxOutline className="text-[40px]" />
              <span className="text-[16px] font-[600]">
                Online Chat <br /> Get expert help
              </span>
            </div>
          </div>

          <div className="w-[40%] flex">
            <div className="w-[50%]">
              <h2 className="text-[20px] font-[600] mb-4">Products</h2>
              <ul className="text-[13px] font-[400]">
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">Prices Drop</Link>
                </li>
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">New Products</Link>
                </li>
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">Contact Us</Link>
                </li>
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">Sitemap</Link>
                </li>
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">Stores</Link>
                </li>
              </ul>
            </div>
            <div className="w-[50%]">
              <h2 className="text-[20px] font-[600] mb-4">Our Company</h2>
              <ul className="text-[13px] font-[400]">
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">Delivery</Link>
                </li>
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">Legal Notice</Link>
                </li>
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">Terms And Condition</Link>
                </li>
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">About us</Link>
                </li>
                <li className="py-2 text-[14px] mb-2">
                  <Link to="/">Secure Payment</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-[30%] pl-8">
            <h2 className="text-[18px] font-[600] mb-4">
              Subscribe to newsletter
            </h2>
            <p className="text-[13px] mb-4">
              Subscribe to our latest newsletter to get news about special
              discounts.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 border rounded-md flex-1"
              />
              <button
                type="submit"
                className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
