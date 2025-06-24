import React, { useState } from "react";
import {
  TextField,
  Button,
  Divider,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../../features/cartSlice";

const CheckOut = () => {
  const userInfo =
    useSelector((state) => state.user.userInfo) ||
    JSON.parse(localStorage.getItem("userInfo")) ||
    {};
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    email: userInfo.email || "",
    phone: userInfo.phone || "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Use real cart data
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      Swal.fire({
        icon: "warning",
        title: "Please agree to the terms and conditions",
        confirmButtonColor: "#ca0815",
      });
      return;
    }
    try {
      // Submit order to backend
      const userId = userInfo._id || localStorage.getItem("userId");
      const token = userInfo.token || localStorage.getItem("accesstoken");
      const delivery_address = formData.address;
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/order/place`,
        {
          userId,
          cartItems,
          delivery_address,
          subTotalAmt: cartTotal,
          totalAmt: cartTotal + (cartTotal > 0 ? 200 : 0),
        },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const orderId = res.data.orderId;
      Swal.fire({
        icon: "success",
        title: "Order placed!",
        text:
          res.data.message ||
          "Order placed successfully! Cash payment will be collected on delivery.",
        confirmButtonColor: "#ca0815",
      }).then(() => {
        dispatch(clearCart());
        navigate("/order-confirmation", { state: { orderId } });
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Order failed",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#ca0815",
      });
    }
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column - Billing Details */}
        <div className="lg:w-[70%]">
          <div className="bg-white shadow-md p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-4">Billing Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                  className="[&_.MuiFormHelperText-root]:text-xs"
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                  className="[&_.MuiFormHelperText-root]:text-xs"
                />
              </div>
              <TextField
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                fullWidth
                className="mb-4 [&_.MuiFormHelperText-root]:text-xs"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  fullWidth
                  className="[&_.MuiFormHelperText-root]:text-xs"
                />
                <TextField
                  label="ZIP Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  fullWidth
                  className="[&_.MuiFormHelperText-root]:text-xs"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  className="[&_.MuiFormHelperText-root]:text-xs"
                  disabled
                />
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  fullWidth
                  className="[&_.MuiFormHelperText-root]:text-xs"
                  disabled={!!userInfo.phone}
                />
              </div>

              <Divider className="my-6" />

              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                <Typography variant="h6" className="font-bold">
                  Cash on Delivery
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Please have exact cash ready when our delivery agent arrives.
                </Typography>
              </div>

              <Box className="mb-4 mt-6 -ml-1">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I agree to the terms and conditions"
                />
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="!bg-primary !text-white font-semibold py-3 rounded-md text-lg mt-2 hover:!bg-primary-dark transition-colors"
                disabled={cartItems.length === 0}
              >
                Place Order
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-[30%]">
          <div className="bg-white shadow-md p-6 rounded-lg h-full">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="divide-y divide-gray-200 mb-4 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.length === 0 ? (
                <div className="text-gray-500 py-4 text-center">
                  Your cart is empty.
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={item._id + item.size + idx}
                    className="py-3 flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 min-w-[56px] rounded object-cover border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Size: {item.size}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: {item.qty}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 text-right min-w-[70px]">
                      Rs {(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Divider className="my-2" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">
                  Rs {cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">
                  {cartTotal > 0 ? "Rs 200" : "Rs 0"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                <span>Total</span>
                <span>
                  Rs {(cartTotal + (cartTotal > 0 ? 200 : 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
