import reportWebVitals from "./reportWebVitals";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./index.css";
import "./App.css";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutV2 from "./pages/CheckoutV2";
import OrderSuccess from "./pages/OrderSuccess";
import OrderFailed from "./pages/OrderFailed";
import ShippingPolicy from "./pages/ShippingPolicy";
import Contact from "./pages/Contact";
import BlogsList from "./pages/BlogsList";
import BlogDetail from "./pages/BlogDetail";
import ReturnPolicy from "./pages/ReturnPolicy";
import CookiesPolicy from "./pages/CookiesPolicy";
import TermsOfService from "./pages/TermsOfService";
import ForgotPassword from "./pages/ForgotPassword";
import MyAccount from "./pages/MyAccount";
import Orders from "./pages/Orders";
import Addresses from "./pages/Addresses";
import OrderDetails from "./pages/OrderDetails";
import Wishlists from "./pages/Wishlists";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

function ProtectedRoute({ children, redirectTo = "/403" }) {
  const token = localStorage.getItem("Token");
  const location = useLocation();
  console.log("ProtectedRoute token", token);
  if (!token)
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          from: location.pathname,
          message: "Please login to continue",
        }}
      />
    );
  return children;
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AppHead />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="/shop" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />

            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:slug" element={<CollectionDetail />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutV2 />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-failed" element={<OrderFailed />} />

            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ForgotPassword />} />

            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/returns-policy" element={<ReturnPolicy />} />
            <Route path="/cookies-policy" element={<CookiesPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsOfService />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/blogs" element={<BlogsList />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />

            <Route
              path="/my-account/notifications"
              element={
                <ProtectedRoute redirectTo="/login">
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-account/wishlist"
              element={
                <ProtectedRoute redirectTo="/login">
                  <Wishlists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account/addresses"
              element={
                <ProtectedRoute redirectTo="/login">
                  <Addresses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account/orders"
              element={
                <ProtectedRoute redirectTo="/login">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account/orders/:id"
              element={
                <ProtectedRoute redirectTo="/login">
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account/profile"
              element={
                <ProtectedRoute redirectTo="/login">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account"
              element={
                <ProtectedRoute redirectTo="/login">
                  <MyAccount />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#2c3a34",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

const AppHead = () => {
  return (
    <>
      <title>Ecomus - Ultimate HTML</title>

      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="shortcut icon" href="#" type="image/x-icon" />
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

reportWebVitals();
