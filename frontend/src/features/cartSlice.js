import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserCart, addCartItem, updateCartItemAPI, deleteCartItemAPI } from './cartAPI';

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
  loading: false,
  error: null,
};

const syncUserCart = createAsyncThunk(
  'cart/syncUserCart',
  async (token, thunkAPI) => {
    const res = await fetchUserCart(token);
    const cart = (res.data || []).map(item => ({
      _id: item.productId._id,
      name: item.productId.name,
      image: item.productId.images?.[0],
      price: item.productId.price,
      size: item.size || 'Default',
      qty: item.quantity,
      countInStock: item.productId.countInStock,
      cartId: item._id,
      discount: item.productId.discount || 0,
      originalPrice: item.productId.price
    }));
    localStorage.setItem('cartItems', JSON.stringify(cart));
    return cart;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(x => x._id === item._id && x.size === item.size);
      if (existItem) {
        existItem.qty += item.qty;
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x._id !== action.payload._id || x.size !== action.payload.size);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateCartItem: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(x => x._id === item._id && x.size === item.size);
      if (existItem) {
        existItem.qty = item.qty;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    setCart: (state, action) => {
      state.cartItems = action.payload;
      localStorage.setItem('cartItems', JSON.stringify(action.payload));
    }
  },
  extraReducers: builder => {
    builder
      .addCase(syncUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(syncUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { addToCart, removeFromCart, updateCartItem, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
export { syncUserCart };
