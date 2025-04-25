import React, { useState, useEffect } from "react";
import ProductZoom from "../../../components/ProductZoom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { Button, TextField } from "@mui/material";
import { MdAddShoppingCart } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import ProductsSlider from "../../../components/ProductsSlider";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../features/cartSlice";
import axios from "axios";
import { addCartItem as addCartItemAPI } from "../../../features/cartAPI";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState({
    userName: "",
    rating: 0,
    comment: "",
  });
  const [ProductActionIndex, setProductActionIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const sizes = ["S", "M", "L", "XL"];
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const user = useSelector((state) => state.user?.userInfo);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetch(
        `${
          import.meta.env.VITE_BACKEND_URI || "http://localhost:8000"
        }/api/products/${id}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.product) {
            setProduct(data.product);
          }
        });
    }
  }, [id]);

  const handleReviewSubmit = async () => {
    setReviewError("");
    setReviewSuccess("");
    if (!user) {
      setReviewError("You must be logged in to write a review.");
      return;
    }
    if (!review.rating || !review.comment) {
      setReviewError("Please provide a rating and comment.");
      return;
    }
    setReviewLoading(true);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URI || "http://localhost:8000"
        }/api/products/${id}/reviews`,
        { rating: review.rating, comment: review.comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReviewSuccess("Review submitted successfully!");
      setProduct((prev) => ({
        ...prev,
        reviews: response.data.reviews,
        rating: response.data.review
          ? response.data.review.rating
          : prev.rating,
      }));
      setReview({ userName: "", rating: 0, comment: "" });
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const selectedSize = sizes[ProductActionIndex] || sizes[0];
    if (user && user.token) {
      await addCartItemAPI(product._id, user.token);
    }
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.images?.[0],
        price: product.price,
        size: selectedSize,
        qty: quantity,
        countInStock: product.countInStock,
      })
    );
  };

  if (!product) return <div className="container py-10">Loading...</div>;

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
            <span>{product.name}</span>
          </Breadcrumbs>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="bg-white py-5">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image */}
            <div className="w-full lg:w-1/3">
              <ProductZoom images={product.images} />
            </div>

            {/* Product Content */}
            <div className="w-full lg:w-2/3">
              <h1 className="text-[25px] font-semibold mb-2">{product.name}</h1>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-400">
                  Brand:{" "}
                  <span className="font-medium text-black">
                    {product.brand || "No Brand"}
                  </span>
                </span>
                <Rating
                  name="size-small"
                  value={Number(product.rating) || 0}
                  size="small"
                  readOnly
                />
                <span className="text-[13px] cursor-pointer">0 Review</span>
              </div>

              <div className="flex items-center gap-4 mt-2 mb-2">
                <span className="text-[20px] text-[#ca0815]">
                  Rs{" "}
                  {product.discount && product.discount > 0
                    ? product.price - (product.price * product.discount) / 100
                    : product.price}
                </span>
                {product.discount && product.discount > 0 && (
                  <>
                    <span className="line-through text-gray-600 text-[14px]">
                      Rs {product.price}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 text-xs rounded">
                      -{product.discount}%
                    </span>
                  </>
                )}
                <span className="text-[14px] text-gray-600">
                  Available Stock: {product.countInStock} items
                </span>
              </div>

              <p className="text-gray-700 mb-4">{product.description}</p>

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
                          ? "!bg-black !text-white"
                          : "!bg-white !text-black"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-4 group relative w-full max-w-[320px]">
                {/* Quantity Selector */}
                <div className="flex items-center border rounded-md overflow-hidden w-[110px] bg-white">
                  <button
                    type="button"
                    className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-lg font-medium bg-white min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.countInStock, q + 1))
                    }
                    disabled={quantity === product.countInStock}
                  >
                    +
                  </button>
                </div>
                {/* Add to Cart Button - only visible on hover */}
                <Button
                  onClick={handleAddToCart}
                  className="absolute right-0 top-0 h-full w-[170px] opacity-100 group-hover:opacity-100 transition-all duration-300 !bg-black !text-white !rounded-md !py-2 flex items-center justify-center gap-2 text-lg font-semibold  disabled:cursor-not-allowed shadow-lg"
                  disabled={product?.countInStock === 0}
                  style={{ pointerEvents: "auto" }}
                >
                  <MdAddShoppingCart className="inline-block text-2xl mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Wishlist */}
              <Button
                startIcon={<FaHeart />}
                className="!bg-white !text-red-600 border border-red-600 px-4 py-2 rounded-md"
              >
                Add to Wishlist
              </Button>

              {/* Tabs for Description/Reviews */}
              <div className="mt-8">
                <div className="flex gap-4 mb-4">
                  <button
                    className={`px-4 py-2 rounded-md ${
                      activeTab === "description"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    Description
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      activeTab === "reviews"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    Reviews
                  </button>
                </div>
                {activeTab === "description" ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Product Description
                    </h3>
                    <p>{product.description}</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Write a Review
                    </h3>
                    {reviewError && (
                      <div className="text-red-600 mb-2">{reviewError}</div>
                    )}
                    {reviewSuccess && (
                      <div className="text-green-600 mb-2">{reviewSuccess}</div>
                    )}
                    {user ? (
                      <>
                        <Rating
                          name="review-rating"
                          value={review.rating}
                          onChange={(_, newValue) =>
                            setReview({ ...review, rating: newValue })
                          }
                        />
                        <TextField
                          label="Comment"
                          value={review.comment}
                          onChange={(e) =>
                            setReview({ ...review, comment: e.target.value })
                          }
                          fullWidth
                          margin="normal"
                          multiline
                          rows={3}
                        />
                        <Button
                          variant="contained"
                          className="!bg-black text-white mt-2"
                          onClick={handleReviewSubmit}
                          disabled={reviewLoading}
                        >
                          {reviewLoading ? "Submitting..." : "Submit Review"}
                        </Button>
                      </>
                    ) : (
                      <div className="text-red-600 font-medium mb-6">
                        Please log in to write a review.
                      </div>
                    )}
                    {/* Show reviews */}
                    <div className="mt-8">
                      <h4 className="text-md font-semibold mb-2">
                        User Reviews
                      </h4>
                      {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-4">
                          {product.reviews.map((r, idx) => (
                            <div
                              key={idx}
                              className="border rounded-md p-3 bg-gray-50"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{r.name}</span>
                                <span className="text-gray-400 text-xs">
                                  ({r.email})
                                </span>
                                <Rating
                                  value={Number(r.rating)}
                                  size="small"
                                  readOnly
                                />
                              </div>
                              <div className="text-gray-700">{r.comment}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(r.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500">No reviews yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Slider */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-[20px] font-[600] mb-4">Related Products</h2>
          <ProductsSlider items={4} />
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
