import {
  ADDRESSES,
  DISCOUNTS,
  ORDERS,
  PAYMENTS,
  authedFetch,
  getAuthHeaders,
} from "./utils";

// ── Auth headers — same pattern as rest of the project ────────

// ─────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────

export const getAddresses = async () => authedFetch(ADDRESSES, "GET");

export const createAddress = async (payload) =>
  authedFetch(ADDRESSES, "POST", payload);

export const updateAddress = async (id, payload) =>
  authedFetch(`${ADDRESSES}/${id}`, "PUT", payload);

export const deleteAddress = async (id) =>
  authedFetch(`${ADDRESSES}/${id}`, "DELETE");

export const setDefaultAddress = async (id) =>
  authedFetch(`${ADDRESSES}/${id}/set_default`, "PUT");

// ─────────────────────────────────────────────
// DISCOUNTS / COUPON
// payload: { code, cart_total }
// ─────────────────────────────────────────────

export const applyCoupon = async (code, cartId) =>
  authedFetch(DISCOUNTS, "POST", { code, cart_id: cartId });

// ─────────────────────────────────────────────
// ORDERS
// payload: { cart_id, address_id, coupon_code?, notes? }
// ─────────────────────────────────────────────

export const createOrder = async (payload) =>
  authedFetch(ORDERS, "POST", payload);

export const getOrders = async (page = 1) =>
  authedFetch(`${ORDERS}?page=${page}`, "GET");

export const getOrderDetail = async (id) =>
  authedFetch(`${ORDERS}/${id}`, "GET");

// ─────────────────────────────────────────────
// PAYMENTS
// verify payload: { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }
// refund payload: { amount? (in ₹, omit for full refund), reason? }
// ─────────────────────────────────────────────

export const verifyPayment = async (payload) =>
  authedFetch(`${PAYMENTS}/verify`, "POST", payload);

export const refundPayment = async (id, payload = {}) =>
  authedFetch(`${PAYMENTS}/${id}/refund`, "POST", payload);

export const requestCancellation = async (orderId, reason) =>
  authedFetch(`${ORDERS}/${orderId}/request_cancellation`, "POST", { reason });

export const createPaymentLink = (orderNumber) =>
  authedFetch(`${PAYMENTS}/create_link`, "POST", {
    order_number: orderNumber,
  });

export const downloadInvoice = async (orderId) => {
  const res = await fetch(`${ORDERS}/${orderId}/invoice`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Could not download invoice");
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `HueHoppers_Invoice_${orderId}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
};
