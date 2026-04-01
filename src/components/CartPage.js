import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../api/utils";

// Icon Components
const Icon = ({ name, className = "" }) => {
  const icons = {
    // 'arrow1-top-left': '↖',
    // 'arrow-right': '→',
    // 'arrow-left': '←',
    // 'delete': '🗑',
  };
  return <i className={`icon icon-${name} ${className}`}>{icons[name]}</i>;
};

// Countdown Timer Component
const CountdownTimer = ({
  timer,
  labels = { days: "d:", hours: "h:", minutes: "m:", seconds: "s" },
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = Date.now() + timer * 1000;
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="js-countdown timer-count">
      {/* {timeLeft.days}{labels.days}
      {timeLeft.hours}{labels.hours}
      {timeLeft.minutes}{labels.minutes}
      {timeLeft.seconds}{labels.seconds} */}
    </div>
  );
};

// Cart Item Component
const FALLBACK_PRODUCT_IMAGE = "/assets/images/product-placeholder.svg";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  console.log("Rendering CartItem:", item);
  const handleQuantityChange = (type) => {
    let newQuantity = item.quantity;
    if (type === "increase") {
      newQuantity += 1;
    } else if (type === "decrease" && item.quantity > 1) {
      newQuantity -= 1;
    }
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <tr className="tf-cart-item file-delete">
      <td className="tf-cart-item_product">
        <Link to={`/products/${item.product_slug}`} className="img-box">
          <img
            src={getImageUrl(item.image) || FALLBACK_PRODUCT_IMAGE}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
            }}
            alt={item.title}
          />
        </Link>
        <div className="cart-info">
          <Link
            to={`/products/${item.product_slug}`}
            className="cart-title link"
          >
            {item.title}
          </Link>
          <div className="cart-meta-variant">
            {item.color} / {item.size}
          </div>
          <span className="remove-cart link remove" onClick={handleRemove}>
            Remove
          </span>
        </div>
      </td>
      <td
        className="tf-cart-item_price tf-variant-item-price"
        cart-data-title="Price"
      >
        <div className="cart-price price">₹{item.price.toFixed(2)}</div>
      </td>
      <td className="tf-cart-item_quantity" cart-data-title="Quantity">
        <div className="cart-quantity">
          <div className="wg-quantity">
            <span
              className="btn-quantity btndecrease"
              onClick={() => handleQuantityChange("decrease")}
            >
              <svg
                className="d-inline-block"
                width="9"
                height="1"
                viewBox="0 0 9 1"
                fill="currentColor"
              >
                <path d="M9 1H5.14286H3.85714H0V1.50201e-05H3.85714L5.14286 0L9 1.50201e-05V1Z"></path>
              </svg>
            </span>
            <input type="text" name="number" value={item.quantity} readOnly />
            <span
              className="btn-quantity btnincrease"
              onClick={() => handleQuantityChange("increase")}
            >
              <svg
                className="d-inline-block"
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="currentColor"
              >
                <path d="M9 5.14286H5.14286V9H3.85714V5.14286H0V3.85714H3.85714V0H5.14286V3.85714H9V5.14286Z"></path>
              </svg>
            </span>
          </div>
        </div>
      </td>
      <td
        className="tf-cart-item_total tf-variant-item-total"
        cart-data-title="Total"
      >
        <div className="cart-total price">₹{itemTotal.toFixed(2)}</div>
      </td>
    </tr>
  );
};

// Free Shipping Bar Component
const FreeShippingBar = ({ cartTotal, freeShippingThreshold = 499 }) => {
  const remaining = Math.max(0, freeShippingThreshold - cartTotal);
  const percentage = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  return (
    <div className="tf-free-shipping-bar">
      <div className="tf-progress-bar">
        <span style={{ width: `${percentage}%` }} className="tf-progress-fill">
          <div className="progress-car">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="14"
              viewBox="0 0 21 14"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 0.875C0 0.391751 0.391751 0 0.875 0H13.5625C14.0457 0 14.4375 0.391751 14.4375 0.875V3.0625H17.3125C17.5867 3.0625 17.845 3.19101 18.0104 3.40969L20.8229 7.12844C20.9378 7.2804 21 7.46572 21 7.65625V11.375C21 11.8582 20.6082 12.25 20.125 12.25H17.7881C17.4278 13.2695 16.4554 14 15.3125 14C14.1696 14 13.1972 13.2695 12.8369 12.25H7.72563C7.36527 13.2695 6.39293 14 5.25 14C4.10706 14 3.13473 13.2695 2.77437 12.25H0.875C0.391751 12.25 0 11.8582 0 11.375V0.875ZM2.77437 10.5C3.13473 9.48047 4.10706 8.75 5.25 8.75C6.39293 8.75 7.36527 9.48046 7.72563 10.5H12.6875V1.75H1.75V10.5H2.77437ZM14.4375 8.89937V4.8125H16.8772L19.25 7.94987V10.5H17.7881C17.4278 9.48046 16.4554 8.75 15.3125 8.75C15.0057 8.75 14.7112 8.80264 14.4375 8.89937ZM5.25 10.5C4.76676 10.5 4.375 10.8918 4.375 11.375C4.375 11.8582 4.76676 12.25 5.25 12.25C5.73323 12.25 6.125 11.8582 6.125 11.375C6.125 10.8918 5.73323 10.5 5.25 10.5ZM15.3125 10.5C14.8293 10.5 14.4375 10.8918 14.4375 11.375C14.4375 11.8582 14.8293 12.25 15.3125 12.25C15.7957 12.25 16.1875 11.8582 16.1875 11.375C16.1875 10.8918 15.7957 10.5 15.3125 10.5Z"
              />
            </svg>
          </div>
        </span>
      </div>
      <div className="tf-progress-msg">
        {remaining > 0 ? (
          <>
            Buy <span className="price fw-6">₹{remaining.toFixed(2)}</span> more
            to enjoy <span className="fw-6">Free Shipping</span>
          </>
        ) : (
          <>
            You've qualified for <span className="fw-6">Free Shipping</span>!
          </>
        )}
      </div>
    </div>
  );
};

// Shipping Calculator Component
const ShippingCalculator = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  const countries = [
    { value: "---", label: "---", provinces: [] },
    {
      value: "Australia",
      label: "Australia",
      provinces: [
        ["Australian Capital Territory", "Australian Capital Territory"],
        ["New South Wales", "New South Wales"],
        ["Northern Territory", "Northern Territory"],
        ["Queensland", "Queensland"],
        ["South Australia", "South Australia"],
        ["Tasmania", "Tasmania"],
        ["Victoria", "Victoria"],
        ["Western Australia", "Western Australia"],
      ],
    },
    {
      value: "Canada",
      label: "Canada",
      provinces: [
        ["Alberta", "Alberta"],
        ["British Columbia", "British Columbia"],
        ["Manitoba", "Manitoba"],
        ["New Brunswick", "New Brunswick"],
        ["Newfoundland and Labrador", "Newfoundland and Labrador"],
        ["Northwest Territories", "Northwest Territories"],
        ["Nova Scotia", "Nova Scotia"],
        ["Nunavut", "Nunavut"],
        ["Ontario", "Ontario"],
        ["Prince Edward Island", "Prince Edward Island"],
        ["Quebec", "Quebec"],
        ["Saskatchewan", "Saskatchewan"],
        ["Yukon", "Yukon"],
      ],
    },
    {
      value: "United States",
      label: "United States",
      provinces: [
        ["California", "California"],
        ["New York", "New York"],
        ["Texas", "Texas"],
        ["Florida", "Florida"],
        ["Illinois", "Illinois"],
      ],
    },
    {
      value: "United Kingdom",
      label: "United Kingdom",
      provinces: [
        ["England", "England"],
        ["Scotland", "Scotland"],
        ["Wales", "Wales"],
        ["Northern Ireland", "Northern Ireland"],
      ],
    },
  ];

  const handleCountryChange = (e) => {
    const country = countries.find((c) => c.value === e.target.value);
    setSelectedCountry(e.target.value);
    setProvinces(country?.provinces || []);
    setSelectedProvince("");
  };

  const handleEstimate = () => {
    console.log("Estimating shipping for:", {
      selectedCountry,
      selectedProvince,
      zipCode,
    });
    // Implement shipping estimation logic
  };

  return (
    // <div className="tf-page-cart-checkout">
    <div className="shipping-calculator">
      <summary
        className="accordion-shipping-header d-flex justify-content-between align-items-center collapsed"
        data-bs-target="#shipping"
        data-bs-toggle="collapse"
        aria-controls="shipping"
      >
        <h3 className="shipping-calculator-title">Estimate Shipping</h3>
        <span className="shipping-calculator_accordion-icon"></span>
      </summary>
      <div className="collapse" id="shipping">
        <div className="accordion-shipping-content">
          <fieldset className="field">
            <label className="label">Country</label>
            <select
              className="tf-select w-100"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </fieldset>
          {provinces.length > 0 && (
            <fieldset className="field">
              <label className="label">Province</label>
              <select
                className="tf-select w-100"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="">Select province</option>
                {provinces.map((province) => (
                  <option key={province[0]} value={province[0]}>
                    {province[1]}
                  </option>
                ))}
              </select>
            </fieldset>
          )}
          <fieldset className="field">
            <label className="label">Zip code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter zip code"
            />
          </fieldset>
          <button
            className="tf-btn btn-fill animate-hover-btn radius-3 justify-content-center"
            onClick={handleEstimate}
          >
            <span>Estimate</span>
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
};

// Main Cart Page Component
const CartPage = ({
  initialCartItems = null,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  freeShippingThreshold = 499,
  giftWrapPrice = 5.0,
  countdownTimer = 600, // 10 minutes in seconds
}) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [giftWrap, setGiftWrap] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [shippingCost, setShippingCost] = useState(0);

  // Default cart items
  const defaultCartItems = [
    {
      id: 1,
      title: "Oversized Printed T-shirt",
      color: "White",
      size: "M",
      price: 18.0,
      quantity: 1,
      image: "/assets/images/products/white-2.jpg",
    },
    {
      id: 2,
      title: "Ribbed Tank Top",
      color: "Orange",
      size: "S",
      price: 18.0,
      quantity: 1,
      image: "/assets/images/products/orange-1.jpg",
    },
    {
      id: 3,
      title: "Regular Fit Oxford Shirt",
      color: "Black",
      size: "L",
      price: 18.0,
      quantity: 1,
      image: "/assets/images/products/black-4.jpg",
    },
  ];

  // useEffect(() => {
  //   if (initialCartItems) {
  //     setCartItems(initialCartItems);
  //   } else {
  //     // Load from localStorage or use defaults
  //     const savedCart = localStorage.getItem('cart');
  //     if (savedCart) {
  //       setCartItems(JSON.parse(savedCart));
  //     } else {
  //       setCartItems(defaultCartItems);
  //     }
  //   }
  // }, [initialCartItems]);

  useEffect(() => {
    if (initialCartItems) {
      setCartItems(initialCartItems);
    } else {
      setCartItems(defaultCartItems);
    }
  }, [initialCartItems]);
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item,
    );
    setCartItems(updatedItems);
    if (onUpdateQuantity) onUpdateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
    if (onRemoveItem) onRemoveItem(itemId);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const calculateTotal = () => {
    let total = calculateSubtotal();
    if (giftWrap) total += giftWrapPrice;
    if (total < freeShippingThreshold) total += shippingCost;
    return total;
  };

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  const handleCheckout = () => {
    if (!agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    if (onCheckout) {
      onCheckout({
        items: cartItems,
        subtotal,
        giftWrap,
        orderNote,
        total,
      });
    } else {
      navigate("/checkout");
    }
  };

  // Empty Cart Component
  const EmptyCart = () => (
    <div className="tf-page-cart text-center mt_140 mb_200">
      <h5 className="mb_24">Your cart is empty</h5>
      <p className="mb_24">
        You may check out all the available products and buy some in the shop
      </p>
      <Link
        to="/shop"
        className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
      >
        Return to shop
        <Icon name="arrow1-top-left" />
      </Link>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <section className="flat-spacing-11">
        <div className="container">
          <EmptyCart />
        </div>
      </section>
    );
  }

  return (
    <section className="flat-spacing-11">
      <div className="container">
        {/* Countdown Timer */}

        <div className="tf-page-cart-wrap">
          {/* Cart Items Table */}
          <div className="tf-page-cart-item">
            <form>
              <table className="tf-table-page-cart">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </tbody>
              </table>

              {/* Order Note */}
              <div className="tf-page-cart-note">
                <label htmlFor="cart-note">Add Order Note</label>
                <textarea
                  name="note"
                  id="cart-note"
                  placeholder="How can we help you?"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Cart Footer - Summary and Checkout */}
          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner">
              {/* Free Shipping Bar */}
              <FreeShippingBar
                cartTotal={subtotal}
                freeShippingThreshold={freeShippingThreshold}
              />

              {/* Shipping Calculator */}

              <div className="tf-page-cart-checkout">
                <ShippingCalculator />

                {/* Gift Wrap Option */}
                <div className="cart-checkbox">
                  <input
                    type="checkbox"
                    className="tf-check"
                    id="cart-gift-checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                  />
                  <label htmlFor="cart-gift-checkbox" className="fw-4">
                    <span>Do you want a gift wrap?</span> Only{" "}
                    <span className="fw-5">₹{giftWrapPrice.toFixed(2)}</span>
                  </label>
                </div>

                {/* Subtotal */}
                <div className="tf-cart-totals-discounts">
                  <h3>Subtotal</h3>
                  <span className="total-value">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Tax Info */}
                <p className="tf-cart-tax">
                  Taxes and <Link to="/shipping-delivery">shipping</Link>{" "}
                  calculated at checkout
                </p>

                {/* Terms Agreement */}
                <div className="cart-checkbox">
                  <input
                    type="checkbox"
                    className="tf-check"
                    id="check-agree"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <label htmlFor="check-agree" className="fw-4">
                    I agree with the{" "}
                    <Link to="/terms-conditions">terms and conditions</Link>
                  </label>
                </div>

                {/* Checkout Button */}
                <div className="cart-checkout-btn">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="tf-btn w-100 btn-fill animate-hover-btn radius-3 justify-content-center"
                  >
                    <span>Check out</span>
                  </button>
                </div>

                {/* Trust Seals */}
                <div className="tf-page-cart_imgtrust">
                  <p className="text-center fw-6">Guarantee Safe Checkout</p>
                  <div className="cart-list-social">
                    <div className="payment-item">
                      <svg
                        viewBox="0 0 38 24"
                        xmlns="http://www.w3.org/2000/svg"
                        width="38"
                        height="24"
                        aria-labelledby="pi-visa"
                      >
                        <title id="pi-visa">Visa</title>
                        <path
                          opacity=".07"
                          d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        ></path>
                        <path
                          fill="#fff"
                          d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                        ></path>
                        <path
                          d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                          fill="#142688"
                        ></path>
                      </svg>
                    </div>
                    <div className="payment-item">
                      <svg
                        viewBox="0 0 38 24"
                        xmlns="http://www.w3.org/2000/svg"
                        width="38"
                        height="24"
                        aria-labelledby="pi-paypal"
                      >
                        <title id="pi-paypal">PayPal</title>
                        <path
                          opacity=".07"
                          d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        ></path>
                        <path
                          fill="#fff"
                          d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                        ></path>
                        <path
                          fill="#003087"
                          d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                        ></path>
                        <path
                          fill="#3086C8"
                          d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                        ></path>
                        <path
                          fill="#012169"
                          d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                        ></path>
                      </svg>
                    </div>
                    <div className="payment-item">
                      <svg
                        viewBox="0 0 38 24"
                        xmlns="http://www.w3.org/2000/svg"
                        width="38"
                        height="24"
                        aria-labelledby="pi-master"
                      >
                        <title id="pi-master">Mastercard</title>
                        <path
                          opacity=".07"
                          d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        ></path>
                        <path
                          fill="#fff"
                          d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                        ></path>
                        <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
                        <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
                        <path
                          fill="#FF5F00"
                          d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CartItem, FreeShippingBar, ShippingCalculator, CountdownTimer };
export default CartPage;
