import { useState } from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductListing/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { IoCloseSharp } from "react-icons/io5";
import MyContext from "../src/context"; 
import Cartpanel from "./components/CartPanle";
import CartPage from "./pages/Cart";
import Verify from "./pages/Verify";
import toast, { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import CheckOut from "./pages/checkout";
import { CartProvider } from "./components/CartContext";
import MyAccount from "./pages/Myaccount";
import MyList from "./pages/MyList";
import Orders from "./pages/Orders";
import MyProfile from "./components/MyProfile";
import { useEffect } from "react";
import { fetchDataFromApi } from "./pages/api";
import MyTickets from "./pages/SupportTicket/MyTickets";
import TicketRaisePage from "./pages/SupportTicket/TicketRaisePage";
import RequireAuth from "./components/RequireAuth";
import CategoryCollapse from "./components/CategoryCollapse"; 

import OrderConfirmation from "./pages/OrderConfirmation";
import PaymentSlip from "./pages/PaymentSlip";
import Deliveries from "./pages/Deliveries";
import DeliveryDetails from "./pages/Deliveries/DeliveryDetails";
import AdminAssignedOrderDetails from "./pages/AdminAssignedOrderDetails";
import AdminAssignedOrders from "./pages/AdminAssignedOrders";
import TwoFactorSetup from "./pages/TwoFactorSetup";
import TwoFactorVerify from "./pages/TwoFactorVerify";
import Verify2FA from "./pages/Verify2FA/index";
import FashionMens from "./pages/FashionMens";

function App() {
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isLogin, setisLogin] = useState(false);
  const [user, setUser] = useState(null);
  const apiURl = import.meta.env.VITE_BACKEND_URI;

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const Toast = (status, msg) => {
    if (status === "success") {
      toast.success(msg);
    }
    if (status === "error") {
      toast.error(msg);
    }
  };

  const values = {
    setOpenCartPanel,
    Toast,
    isLogin,
    setisLogin,
    user,
    setUser,
  };

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      setisLogin(true);

      fetchDataFromApi(`/api/users/allusers?authHeader=${token}`).then(
        (data) => {
          setUser(data.user);
          console.log(data);
        }
      );
    }
  }, []);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productListing" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<RequireAuth><CheckOut /></RequireAuth>} />
            <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/verify2fa" element={<Verify2FA />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/order-confirmation" element={<RequireAuth><OrderConfirmation /></RequireAuth>} />
            <Route path="/payment-slip" element={<RequireAuth><PaymentSlip /></RequireAuth>} />
            <Route path="/deliveries" element={<RequireAuth><Deliveries /></RequireAuth>} />
            <Route path="/deliveries/:orderId" element={<RequireAuth><DeliveryDetails /></RequireAuth>} />
            <Route path="/raise-ticket" element={<RequireAuth><TicketRaisePage /></RequireAuth>} />

            <Route path="/category/:categoryName" element={<RequireAuth><CategoryCollapse /></RequireAuth>} />

            <Route path="/profile" element={<RequireAuth><MyAccount /></RequireAuth>}>
              <Route index element={<MyProfile />} /> 
              <Route path="my-list" element={<MyList />} />
              <Route path="orders" element={<Orders />} />
              <Route path="my-tickets" element={<MyTickets />} />
              <Route path="my-deliveries" element={<AdminAssignedOrders />} />
              <Route
                path="my-deliveries/:orderId"
                element={<AdminAssignedOrderDetails />}
              />
            </Route>

            <Route
              path="/2fa/setup"
              element={
                <TwoFactorSetup
                  secret="JBSWY3DPEHPK3PXP"
                  onVerify={(code) => alert("Verify code: " + code)}
                />
              }
            />
            <Route
              path="/2fa/verify"
              element={
                <TwoFactorVerify
                  onVerify={(code) => alert("Verify code: " + code)}
                  error={null}
                />
              }
            />
            <Route path="/fashion/mens" element={<FashionMens />} />
          </Routes>
          <Footer />
        </MyContext.Provider>

        <Drawer
          open={openCartPanel}
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
    </>
  );
}

export default App;
