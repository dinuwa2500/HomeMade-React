import React, { useState } from 'react';
import {
  TextField,
  Button,
  Divider,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

// Sample cart data - in a real app, this would come from your state/context/API
const sampleCartItems = [
  { id: 1, name: 'Wireless Earbuds', price: 99.99, quantity: 1 },
  { id: 2, name: 'Smart Watch', price: 199.99, quantity: 2 },
  { id: 3, name: 'Phone Case', price: 19.99, quantity: 1 },
];

const CheckOut = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    email: '',
    phone: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Calculate cart total
  const cartTotal = sampleCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    alert(
      `Order placed successfully for ${sampleCartItems.length} items! Cash payment will be collected on delivery.`
    );
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* Left Column - Billing Details */}
        <div className="lg:w-[70%]">
          <div className="card bg-white shadow-md p-6 rounded-lg mb-6">
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
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </div>
              <TextField
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                fullWidth
                className="mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="ZIP Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  fullWidth
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
                />
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </div>

              <Divider className="my-6" />

              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              <div className="border rounded-lg p-4 bg-gray-50">
                <Typography variant="h6" className="font-bold">
                  Cash on Delivery
                </Typography>
                <Typography variant="body2" className="mt-2 text-gray-600">
                  Please have exact cash ready when our delivery agent arrives
                </Typography>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-[30%]">
          <div className="card bg-white shadow-md p-6 rounded-lg  top-6">
            <h2 className="text-2xl font-bold mb-4">Your Order</h2>

            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between mb-2 font-medium">
                <span>Product</span>
                <span>Subtotal</span>
              </div>

              {/* Dynamic Product List */}
              {sampleCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-t"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="flex justify-between py-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <Box className="mb-4">
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
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={!agreeTerms}
              className="py-3 bg-blue-600 hover:bg-blue-700"
            >
              Confirm Order
            </Button>

            <Typography
              variant="body2"
              className="mt-4 text-gray-500 text-center"
            >
              Our delivery agent will collect payment in cash
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
