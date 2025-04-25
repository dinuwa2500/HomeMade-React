import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URI;

export const fetchUserCart = async (token) => {
  const { data } = await axios.get(`${API_URL}/api/cart/getcartitems`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return data;
};

export const addCartItem = async (productId, token) => {
  const { data } = await axios.post(
    `${API_URL}/api/cart/addcart`,
    { productId },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
  return data;
};

export const updateCartItemAPI = async (_id, qty, token) => {
  const { data } = await axios.put(
    `${API_URL}/api/cart/updatecart`,
    { _id, qty },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
  return data;
};

export const deleteCartItemAPI = async (_id, token) => {
  const { data } = await axios.delete(
    `${API_URL}/api/cart/deletecart`,
    {
      data: { _id },
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
  return data;
};
