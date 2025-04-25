import React from "react";
import "./index.css";
import {
  createBrowserRouter,
  BrowserRouter,
  Routes,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard/index.jsx";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AdminSignIn from "./pages/AdminSignIn";
import AdminSignUp from "./pages/AdminSignUp";
import RequireAdmin from "./components/RequireAdmin";
import Profile from "./pages/Profile";
import CategoryPage from "./pages/Category";
import ProductsPage from "./pages/Products";
import AdminPayments from "./pages/AdminPayments";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminDeliveries from "./pages/Deliveries";
import AdminDeliveryDetails from "./pages/Deliveries/DeliveryDetails";
import AdminUsers from "./pages/AdminUsers";
import AdminReviews from "./pages/AdminReviews"; // added import statement
import AdminDrivers from "./pages/AdminDrivers"; // added import statement
import { Toaster } from "react-hot-toast";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <AdminSignIn />,
    },
    {
      path: "/register",
      element: <AdminSignUp />,
    },
    {
      path: "/profile",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <Profile />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/category",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <CategoryPage />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/products",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <ProductsPage />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/payments",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[82%] py-4 px-5">
                <AdminPayments />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/orders",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <AdminOrders />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/orders/:id",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <AdminOrderDetails />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/deliveries",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <AdminDeliveries />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/deliveries/:orderId",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <AdminDeliveryDetails />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/reviews",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <AdminReviews />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/users",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <AdminUsers />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/admin/drivers",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[82%] py-4 px-5">
                <AdminDrivers />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <RequireAdmin>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <Dashboard />
              </div>
            </div>
          </section>
        </RequireAdmin>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
