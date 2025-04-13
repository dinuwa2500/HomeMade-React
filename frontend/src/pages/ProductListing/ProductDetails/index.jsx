import React, { useState } from 'react';
import ProductZoom from '../../../components/ProductZoom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button, TextField } from '@mui/material';
import QtyBox from '../../../components/QtyBox';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';
import ProductsSlider from '../../../components/ProductsSlider';

const ProductDetails = () => {
  const [review, setReview] = useState({
    userName: '',
    rating: 0,
    comment: '',
  });
  const [ProductActionIndex, setProductActionIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const sizes = ['S', 'M', 'L', 'XL'];

  const handleReviewSubmit = () => {
    // Logic to send review to the server (you can use Axios or Fetch)
    console.log('Review submitted:', review);
    // Reset form after submission
    setReview({ userName: '', rating: 0, comment: '' });
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" className="text-blue-600">
              Home
            </Link>
            <Link to="/fashions" className="text-blue-600">
              Fashion
            </Link>
          </Breadcrumbs>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="bg-white py-5">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image */}
            <div className="w-full lg:w-1/3">
              <ProductZoom />
            </div>

            {/* Product Content */}
            <div className="w-full lg:w-2/3">
              <h1 className="text-[25px] font-semibold mb-2">
                Handloom Sarong (Green and Orange)
              </h1>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-400">
                  Brand:{' '}
                  <span className="font-medium text-black">No Brand</span>
                </span>
                <Rating
                  name="size-small"
                  defaultValue={4}
                  size="small"
                  readOnly
                />
                <span className="text-[13px] cursor-pointer">0 Review</span>
              </div>

              <div className="flex items-center gap-4 mt-2 mb-2">
                <span className="text-[20px] text-[#ca0815]">Rs 1,700.00</span>
                <span className="text-[14px] text-gray-600">
                  Available Stock: 147 items
                </span>
              </div>

              <p className="text-gray-700 mb-4">
                There is a growing demand for authenticity around the globe
                today. Environmentally friendly products such as handloom
                textiles are becoming increasingly popular.
              </p>

              {/* Size Selection */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[14px]">Size:</span>
                <div className="flex items-center gap-2">
                  {sizes.map((size, index) => (
                    <Button
                      key={size}
                      onClick={() => setProductActionIndex(index)}
                      className={`!border !rounded-md ${
                        ProductActionIndex === index
                          ? '!bg-black !text-white'
                          : '!bg-white !text-black'
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[100px]">
                  <QtyBox />
                </div>
                <Button
                  variant="contained"
                  startIcon={<MdAddShoppingCart />}
                  className="!bg-orange-600 hover:!bg-orange-700 !text-white px-4 py-2 rounded-md"
                >
                  Add To Cart
                </Button>
              </div>

              {/* Wishlist */}
              <div className="mb-4">
                <Button
                  variant="outlined"
                  startIcon={<FaHeart />}
                  className="!text-red-600 hover:!bg-red-100 !rounded-md border !border-[#000]"
                >
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Section */}
        <div className="container pt-10">
          <div className="flex items-center gap-6 border-b pb-2 mb-4">
            {['description', 'product', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`text-[18px] font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'description'
                  ? 'Description'
                  : tab === 'product'
                  ? 'Product Details'
                  : 'Reviews'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="shadow-md w-full p-5 rounded-md text-[14px] font-[400] leading-relaxed text-gray-700">
            {activeTab === 'description' && (
              <p>
                Join hands to revive distinctive local industries of Sri Lanka.
                <br />
                Nature inspired forms and patterns. Enjoy handloom products
                especially saree, sarong, lungi, bedsheets, blouses and shirts
                with a wide variety.
                <br />
                Colour – Dark green and orange <br />
                Colours Available – Combination of different colour <br />
                Sizes Available – Standard sizes of gents sarong <br />
                Materials Used – Fabric material with natural dyes <br />
                Uses – A gents sarong
              </p>
            )}

            {activeTab === 'product' && (
              <div className="space-y-2">
                <p>
                  <strong>
                    Product details of Sandstone Batik Sarong Set Indian Sarong
                    2M (Random Design)
                  </strong>
                </p>
                <ul className="list-disc pl-5">
                  <li>Material: Cotton</li>
                  <li>Size: 2.10 Mts</li>
                  <li>Blue Mixed Check Design On Sarong</li>
                  <li>Original Tumbler Sarongs</li>
                  <li>High Quality</li>
                  <li>Long Lasting</li>
                  <li>Eye Catching Colours</li>
                  <li>
                    Place Your Order & We Will Send You A Random Blue Sarong
                  </li>
                  <li>
                    Sarong Colour Can Be A Shade Darker Or Lighter Than The
                    Picture
                  </li>
                </ul>

                <p>
                  <strong>Service Guarantee</strong>
                </p>
                <ol className="list-decimal pl-5">
                  <li>
                    We guarantee all the items are in 100% good condition and
                    high quality.
                  </li>
                  <li>
                    If you are not satisfied with the quality of the products
                    you received, contact us and we will do our best to serve
                    you until you are satisfied. If still unsatisfied, we can
                    resend the package or refund your money. Please note this
                    must be done within 7 days after receiving your parcel.
                  </li>
                  <li>
                    We guarantee you a zero-risk purchase experience here.
                  </li>
                </ol>

                <p>
                  <strong>
                    Specifications of Sandstone Batik Sarong Set Indian Sarong
                    2M (Random Design)
                  </strong>
                </p>
                <ul className="list-disc pl-5">
                  <li>Brand: No Brand</li>
                  <li>SKU: 178665443_LK-1140005500</li>
                </ul>

                <p>
                  <strong>What’s in the box</strong>
                </p>
                <ul className="list-disc pl-5">
                  <li>1 x Sarong</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className=" w-full py-5 px-8 rounded-md space-y-6">
                <h2 className="text-[18px] font-semibold mb-4">
                  Customer Reviews
                </h2>

                {/* Customer Reviews List */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start border-b pb-4"
                    >
                      <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                        <img
                          src="../../../../src/assets/profile.png"
                          alt="Profile"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-semibold">User {i}</h4>
                        <p className="text-[13px] text-gray-500 mb-1">
                          2025-04-10
                        </p>
                        <Rating value={4} size="small" readOnly />
                        <p className="text-[14px] mt-2">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Praesent sit amet semper lorem. Aenean nec
                          ullamcorper justo.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Review Form */}
                <div className="pt-6">
                  <h3 className="text-[18px] font-semibold mb-4">
                    Leave a Review
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReviewSubmit();
                    }}
                    className="space-y-4"
                  >
                    <TextField
                      fullWidth
                      label="Name"
                      value={review.userName}
                      onChange={(e) =>
                        setReview({ ...review, userName: e.target.value })
                      }
                    />
                    <div>
                      <label className="block text-sm font-medium mb-1 mt-3">
                        Rating
                      </label>
                      <Rating
                        name="user-rating"
                        value={review.rating}
                        onChange={(_, newValue) =>
                          setReview({ ...review, rating: newValue })
                        }
                      />
                    </div>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      label="Comment"
                      value={review.comment}
                      onChange={(e) =>
                        setReview({ ...review, comment: e.target.value })
                      }
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      className="!bg-black hover:!bg-gray-800 text-white !mt-3"
                    >
                      Submit Review
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        <section className="py-5 bg-white pb-0 mt-3">
          <div className="container ">
            <div className="leftsec p-5">
              <h2 className="text-[20px] font-[600]">Related Products</h2>
              <ProductsSlider items={5} />
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default ProductDetails;
