import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { useCartStore } from "../store/cartStore";
import {
  applyCoupon,
  createAddress,
  createOrder,
  createPaymentLink,
  deleteAddress,
  getAddresses,
} from "../api/checkout";
import toast from "react-hot-toast";

const BLANK_ADDRESS = {
  name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  is_default: false,
};

const CheckoutV2 = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const initCart = useCartStore((state) => state.initCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const cartData = useCartStore((state) => state.cartData);
  const loading = useCartStore((state) => state.loading);
  const cartId = useCartStore((state) => state.cartId);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(BLANK_ADDRESS);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [notes, setNotes] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/checkout",
          message: "Please login to continue to checkout",
        },
      });
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    initCart();
  }, [initCart, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (cartData) return;
    fetchCart();
  }, [cartData, fetchCart, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadAddresses = async () => {
      try {
        const res = await getAddresses();
        const list = res?.addresses || [];
        setAddresses(list);
        const selected = list.find((address) => address.is_default) || list[0];
        if (selected) setSelectedAddressId(selected.id);
      } catch (err) {
        toast.error(err?.message || "Could not load addresses");
      }
    };

    loadAddresses();
  }, [isAuthenticated]);

  const orderItems = useMemo(() => {
    return (cartData?.items || []).map((item) => ({
      id: item.id,
      title: item.product_name || item.name || "Cart Item",
      variant: [
        item.variant_color || item.color,
        item.variant_size || item.size,
      ]
        .filter(Boolean)
        .join(" / "),
      price: Number(item.price || item.product_price || 0),
      quantity: Number(item.quantity || 1),
      image:
        item.image_url ||
        item.display_image ||
        item.product_image ||
        "/product-placeholder.svg",
    }));
  }, [cartData]);

  const subtotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [orderItems],
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const discount = Number(couponApplied?.discount_amount || 0);
  const total = Math.max(subtotal + shipping - discount, 0);

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.name.trim() || !addressForm.address_line1.trim()) {
      toast.error("Please fill the required address fields");
      return;
    }
    setSavingAddress(true);
    try {
      const res = await createAddress(addressForm);
      const saved = res?.address;
      if (saved?.id) setSelectedAddressId(saved.id);
      setAddressForm(BLANK_ADDRESS);
      setShowAddressModal(false);
      const refreshed = await getAddresses();
      setAddresses(refreshed?.addresses || []);
      toast.success("Address saved");
    } catch (err) {
      toast.error(err?.message || "Could not save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const removeAddress = async (id) => {
    if (!window.confirm("Remove this address?")) return;
    try {
      await deleteAddress(id);
      const refreshed = await getAddresses();
      const list = refreshed?.addresses || [];
      setAddresses(list);
      const selected = list.find((address) => address.is_default) || list[0];
      setSelectedAddressId(selected?.id || null);
      toast.success("Address removed");
    } catch (err) {
      toast.error(err?.message || "Could not remove address");
    }
  };

  const handleApplyCoupon = async () => {
    if (!isAuthenticated) return;
    if (!couponCode.trim()) return;
    try {
      const res = await applyCoupon(couponCode.trim().toUpperCase(), cartId);
      setCouponApplied({
        code: couponCode.trim().toUpperCase(),
        discount_amount: res?.discount_amount || 0,
      });
      toast.success(res?.message || "Coupon applied");
    } catch (err) {
      toast.error(err?.message || "Could not apply coupon");
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) return;
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    setPlacingOrder(true);
    try {
      const orderRes = await createOrder({
        cart_id: cartId,
        address_id: selectedAddressId,
        coupon_code: couponApplied?.code || null,
        notes: notes || null,
      });
      const { order_number } = orderRes || {};
      if (!order_number) throw new Error("Order could not be created");

      const linkRes = await createPaymentLink(order_number);
      sessionStorage.removeItem("hh_coupon");

      const encodedLink = encodeURIComponent(linkRes.payment_link_url);
      window.location.href = `http://localhost:3001/hh-pay?link=${encodedLink}&order=${order_number}`;
    } catch (err) {
      toast.error(err?.message || "Could not place order");
      setPlacingOrder(false);
    }
  };

  return isAuthenticated ? (
    <>
      <PageTitle
        title="Check Out"
        subtitle="Review your cart, choose an address, and complete your purchase."
        bgImage="collections-banner.jpg"
      />

      <section className="flat-spacing-11">
        <div className="container">
          <div className="tf-page-cart-wrap layout-2">
            <div className="tf-page-cart-item">
              <h5 className="fw-5 mb_20">Billing details</h5>

              <div className="mb_24 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <div className="fw-5 mb_5">Delivery address</div>
                  <div className="text_black-2">
                    {selectedAddressId
                      ? "Selected from your saved addresses"
                      : "No address selected yet"}
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-btn btn-line"
                  onClick={() => setShowAddressModal(true)}
                >
                  Add new address
                </button>
              </div>

              {showAddressModal ? (
                <div
                  className="modal-overlay"
                  onClick={() => setShowAddressModal(false)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.45)",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "min(760px, 100%)",
                      maxHeight: "90vh",
                      overflowY: "auto",
                      background: "#fff",
                      borderRadius: 16,
                      padding: 28,
                      boxShadow: "0 24px 70px rgba(0,0,0,0.14)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb_24">
                      <div>
                        <h5 className="fw-5 mb_5">Add address</h5>
                        <p className="text_black-2 mb-0">
                          Save a delivery address for faster checkout.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="tf-btn btn-line"
                        onClick={() => setShowAddressModal(false)}
                      >
                        Close
                      </button>
                    </div>

                    <form className="form-checkout" onSubmit={saveAddress}>
                      <div className="box grid-2">
                        <fieldset className="fieldset">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={addressForm.name}
                            onChange={handleAddressChange}
                            required
                          />
                        </fieldset>
                        <fieldset className="fieldset">
                          <label htmlFor="phone">Phone</label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={addressForm.phone}
                            onChange={handleAddressChange}
                          />
                        </fieldset>
                      </div>

                      <fieldset className="box fieldset">
                        <label htmlFor="address_line1">Address Line 1</label>
                        <input
                          type="text"
                          id="address_line1"
                          name="address_line1"
                          value={addressForm.address_line1}
                          onChange={handleAddressChange}
                          required
                        />
                      </fieldset>
                      <fieldset className="box fieldset">
                        <label htmlFor="address_line2">Address Line 2</label>
                        <input
                          type="text"
                          id="address_line2"
                          name="address_line2"
                          value={addressForm.address_line2}
                          onChange={handleAddressChange}
                        />
                      </fieldset>
                      <div className="box grid-3">
                        <fieldset className="fieldset">
                          <label htmlFor="city">City</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressChange}
                          />
                        </fieldset>
                        <fieldset className="fieldset">
                          <label htmlFor="state">State</label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={addressForm.state}
                            onChange={handleAddressChange}
                          />
                        </fieldset>
                        <fieldset className="fieldset">
                          <label htmlFor="pincode">Pincode</label>
                          <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            value={addressForm.pincode}
                            onChange={handleAddressChange}
                          />
                        </fieldset>
                      </div>

                      <fieldset className="box fieldset">
                        <label className="d-flex align-items-center gap-10">
                          <input
                            type="checkbox"
                            name="is_default"
                            checked={addressForm.is_default}
                            onChange={handleAddressChange}
                          />
                          <span>Set as default address</span>
                        </label>
                      </fieldset>

                      <button
                        type="submit"
                        className="tf-btn btn-fill animate-hover-btn justify-content-center w-100"
                        disabled={savingAddress}
                      >
                        {savingAddress ? "Saving..." : "Save address"}
                      </button>
                    </form>
                  </div>
                </div>
              ) : null}

              <div className="mb_24">
                <h6 className="fw-5 mb_16">Saved addresses</h6>
                <div className="d-flex flex-column gap-12">
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <div
                        key={address.id}
                        style={{
                          border: "1px solid #e7e7e7",
                          borderRadius: 14,
                          padding: 16,
                          background:
                            selectedAddressId === address.id
                              ? "#f8f8f6"
                              : "#fff",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <label
                            className="d-flex gap-10 align-items-start"
                            style={{ cursor: "pointer", flex: 1 }}
                          >
                            <input
                              type="radio"
                              checked={selectedAddressId === address.id}
                              onChange={() => setSelectedAddressId(address.id)}
                            />
                            <span>
                              <strong>{address.name}</strong>
                              <br />
                              <span className="text_black-2">
                                {address.address_line1}
                                {address.address_line2
                                  ? `, ${address.address_line2}`
                                  : ""}
                                {address.city ? `, ${address.city}` : ""}
                                {address.state ? `, ${address.state}` : ""}
                                {address.pincode ? ` - ${address.pincode}` : ""}
                              </span>
                            </span>
                          </label>
                          <button
                            type="button"
                            className="tf-btn btn-line"
                            onClick={() => removeAddress(address.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        border: "1px dashed #ddd",
                        borderRadius: 14,
                        padding: 18,
                        color: "#666",
                      }}
                    >
                      No saved addresses yet. Add one to speed up checkout.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="tf-page-cart-footer">
              <div className="tf-cart-footer-inner">
                <h5 className="fw-5 mb_20">Your order</h5>
                <form className="tf-page-cart-checkout widget-wrap-checkout">
                  <ul className="wrap-checkout-product">
                    {loading ? (
                      <li className="checkout-product-item">
                        <div className="content">
                          <div className="info">
                            <p className="name">Loading cart...</p>
                          </div>
                        </div>
                      </li>
                    ) : orderItems.length > 0 ? (
                      orderItems.map((item) => (
                        <li className="checkout-product-item" key={item.id}>
                          <figure className="img-product">
                            <img src={item.image} alt={item.title} />
                            <span className="quantity">{item.quantity}</span>
                          </figure>
                          <div className="content">
                            <div className="info">
                              <p className="name">{item.title}</p>
                              {item.variant ? (
                                <span className="variant">{item.variant}</span>
                              ) : null}
                            </div>
                            <span className="price">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="checkout-product-item">
                        <div className="content">
                          <div className="info">
                            <p className="name">Your cart is empty.</p>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>

                  <div className="coupon-box">
                    <input
                      type="text"
                      placeholder="Discount code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                  </div>

                  <div className="d-flex justify-content-between line pb_20">
                    <h6 className="fw-5">Total</h6>
                    <h6 className="total fw-5">₹{total.toFixed(2)}</h6>
                  </div>

                  <div className="wd-check-payment">
                    <p className="text_black-2 mb_20">
                      Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our{" "}
                      <a
                        href="/privacy-policy"
                        className="text-decoration-underline"
                      >
                        privacy policy
                      </a>
                      .
                    </p>

                    <button
                      type="button"
                      className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center w-100"
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                    >
                      {placingOrder ? "Placing order..." : "Place order"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  ) : null;
};

export default CheckoutV2;
