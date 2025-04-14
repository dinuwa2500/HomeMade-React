import { useState } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import Footer from './components/Footer';
import ProductDetails from './pages/ProductListing/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import { IoCloseSharp } from 'react-icons/io5';
import MyContext from '../src/context'; // Adjust path if needed
import Cartpanel from './components/CartPanle';
import CartPage from './pages/Cart';
import Verify from './pages/Verify';
import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './pages/ForgotPassword';
import CheckOut from './pages/checkout';
import { CartProvider } from './components/CartContext';
import MyAccount from './pages/Myaccount';
import MyList from './pages/MyList';
import Orders from './pages/Orders';
import MyProfile from './components/MyProfile';

function App() {
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isLogin, setisLogin] = useState(false);

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const Toast = (status, msg) => {
    if (status === 'success') {
      toast.success(msg);
    }
    if (status === 'error') {
      toast.error(msg);
    }
  };

  const values = {
    setOpenCartPanel,
    Toast,
    isLogin,
    setisLogin,
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productListing" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* ✅ NESTED ROUTES for MyAccount */}
            <Route path="/profile" element={<MyAccount />}>
              <Route index element={<MyProfile />} /> {/* default view */}
              <Route path="my-list" element={<MyList />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Routes>
          <Footer />
        </MyContext.Provider>

        <Drawer
          open={openCartPanel}
          s
          onClose={toggleCartPanel(false)}
          anchor="right"
          className=" cartPanel"
        >
          <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.1)]">
            <h4>Shopping Cart</h4>
            <IoCloseSharp
              className="text-[20px] cursor-pointer"
              onClick={toggleCartPanel(false)}
            />
          </div>

          <Cartpanel />
        </Drawer>
      </BrowserRouter>

      <Toaster />
    </>
  );
}

export default App;
