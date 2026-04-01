import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import AccountSidebar from "../components/AccountSidebar";
import {
  getOrderDetail,
  requestCancellation,
  downloadInvoice,
} from "../api/checkout";
import { getImageUrl } from "../api/utils";
import { showErrorMessage, showSuccessMessage } from "../utils";

const FALLBACK_IMAGE = "/assets/images/product-placeholder.svg";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Invoice
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderDetail(id);
      setOrder(res?.order || res);
    } catch (err) {
      showErrorMessage(typeof err === "string" ? err : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!cancelReason.trim()) {
      showErrorMessage("Please provide a reason for cancellation");
      return;
    }
    setCancelling(true);
    try {
      await requestCancellation(order.id, cancelReason.trim());
      showSuccessMessage("Cancellation request submitted!");
      setShowCancelModal(false);
      setCancelReason("");
      await loadOrder();
    } catch (err) {
      showErrorMessage(
        typeof err === "string" ? err : "Could not submit request",
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true);
    try {
      await downloadInvoice(order.id);
    } catch (err) {
      showErrorMessage("Could not download invoice");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // Computed
  const firstItem = order?.order_items?.[0];
  const subtotal =
    order?.order_items?.reduce(
      (sum, item) => sum + item.selling_price * item.quantity,
      0,
    ) || 0;
  const discountAmount = order?.discount?.discount_amount || 0;
  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  const shippingAddress = order?.address
    ? `${order.address.address_line1}${order.address.address_line2 ? ", " + order.address.address_line2 : ""}, ${order.address.city}, ${order.address.state} — ${order.address.pincode}`
    : "—";

  // Timeline events derived from order status
  const getTimeline = () => {
    const events = [];
    const statusOrder = ["pending", "confirmed", "shipped", "delivered"];
    const statusLabels = {
      pending: "Order Placed",
      confirmed: "Order Confirmed",
      shipped: "Product Shipped",
      delivered: "Delivered",
      cancelled: "Order Cancelled",
    };

    if (order?.status === "cancelled") {
      return [
        {
          label: "Order Cancelled",
          time: order.updated_at,
          done: true,
          extra: [],
        },
      ];
    }

    const currentIndex = statusOrder.indexOf(order?.status);
    statusOrder.forEach((s, i) => {
      const done = i <= currentIndex;
      const extras = [];
      if (s === "shipped" && order?.tracking_number) {
        extras.push({ label: "Tracking Number", value: order.tracking_number });
        if (order?.courier)
          extras.push({ label: "Courier", value: order.courier });
      }
      events.push({ label: statusLabels[s], done, extra: extras });
    });

    return events;
  };

  const tabs = ["Order History", "Item Details", "Courier", "Receiver"];

  return (
    <>
      <PageTitle
        title="My Account"
        subtitle="Your Hue. Your World. Your Space!"
        bgImage="profileBanner.png"
      />

      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            {/* ── Sidebar ── */}
            <div className="col-lg-3">
              <AccountSidebar />
            </div>

            {/* ── Content ── */}
            <div className="col-lg-9">
              {/* Back link */}
              <div className="mb_20">
                <Link to="/my-account/orders" className="tf-btn btn-line fw-6">
                  ← Back to Orders
                </Link>
              </div>

              {/* Loading */}
              {loading && (
                <div>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#f4f3ef",
                        height: i === 0 ? 80 : 40,
                        marginBottom: 16,
                        animation: "pulse 1.4s ease-in-out infinite",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Not found */}
              {!loading && !order && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ color: "#888", marginBottom: 16 }}>
                    Order not found.
                  </p>
                  <Link
                    to="/my-account/orders"
                    className="tf-btn btn-fill animate-hover-btn"
                  >
                    Back to Orders
                  </Link>
                </div>
              )}

              {/* ── Order Detail — exact original design ── */}
              {!loading && order && (
                <div className="wd-form-order">
                  {/* Order Head */}
                  <div className="order-head">
                    <figure className="img-product">
                      <img
                        src={
                          firstItem?.image_url
                            ? getImageUrl(firstItem.image_url) || FALLBACK_IMAGE
                            : FALLBACK_IMAGE
                        }
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        alt={firstItem?.product_name || "product"}
                      />
                    </figure>
                    <div className="content">
                      <div className="badge">
                        {order.status?.replace(/_/g, " ")}
                      </div>
                      <h6 className="mt-8 fw-5">Order #{order.order_number}</h6>
                    </div>
                  </div>

                  {/* Meta Grid */}
                  <div className="tf-grid-layout md-col-2 gap-15">
                    <div className="item">
                      <div className="text-2 text_black-2">Items</div>
                      <div className="text-2 mt_4 fw-6">
                        {order.order_items?.length || 0} item(s)
                      </div>
                    </div>
                    <div className="item">
                      <div className="text-2 text_black-2">Courier</div>
                      <div className="text-2 mt_4 fw-6">
                        {order.courier || "To be assigned"}
                      </div>
                    </div>
                    <div className="item">
                      <div className="text-2 text_black-2">Order Date</div>
                      <div className="text-2 mt_4 fw-6">{formattedDate}</div>
                    </div>
                    <div className="item">
                      <div className="text-2 text_black-2">Address</div>
                      <div className="text-2 mt_4 fw-6">{shippingAddress}</div>
                    </div>
                  </div>

                  {/* ── Tabs ── */}
                  <div className="widget-tabs style-has-border widget-order-tab">
                    <ul className="widget-menu-tab">
                      {tabs.map((tab, i) => (
                        <li
                          key={i}
                          className={`item-title${activeTab === i ? " active" : ""}`}
                          onClick={() => setActiveTab(i)}
                          style={{ cursor: "pointer" }}
                        >
                          <span className="inner">{tab}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="widget-content-tab">
                      {/* ── Tab 0: Order History (Timeline) ── */}
                      <div
                        className={`widget-content-inner${activeTab === 0 ? " active" : ""}`}
                      >
                        <div className="widget-timeline">
                          <ul className="timeline">
                            {getTimeline().map((event, i) => (
                              <li key={i}>
                                <div
                                  className={`timeline-badge${event.done ? " success" : ""}`}
                                />
                                <div className="timeline-box">
                                  <a
                                    className="timeline-panel"
                                    href="javascript:void(0);"
                                  >
                                    <div className="text-2 fw-6">
                                      {event.label}
                                    </div>
                                    {event.time && (
                                      <span>
                                        {new Date(event.time).toLocaleString(
                                          "en-IN",
                                        )}
                                      </span>
                                    )}
                                  </a>
                                  {event.extra?.map((ex, j) => (
                                    <p key={j}>
                                      <strong>{ex.label} : </strong>
                                      {ex.value}
                                    </p>
                                  ))}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* ── Tab 1: Item Details ── */}
                      <div
                        className={`widget-content-inner${activeTab === 1 ? " active" : ""}`}
                      >
                        {order.order_items?.map((item) => (
                          <div key={item.id}>
                            <div className="order-head">
                              <figure className="img-product">
                                <img
                                  src={
                                    item.image_url
                                      ? getImageUrl(item.image_url) ||
                                        FALLBACK_IMAGE
                                      : FALLBACK_IMAGE
                                  }
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = FALLBACK_IMAGE;
                                  }}
                                  alt={item.product_name}
                                />
                              </figure>
                              <div className="content">
                                <div className="text-2 fw-6">
                                  {item.product_name}
                                </div>
                                <div className="mt_4">
                                  <span className="fw-6">Price : </span>₹
                                  {Number(item.selling_price).toLocaleString(
                                    "en-IN",
                                  )}
                                </div>
                                {item.size && (
                                  <div className="mt_4">
                                    <span className="fw-6">Size : </span>
                                    {item.size}
                                  </div>
                                )}
                                {item.color && (
                                  <div className="mt_4">
                                    <span className="fw-6">Color : </span>
                                    {item.color}
                                  </div>
                                )}
                                <div className="mt_4">
                                  <span className="fw-6">Qty : </span>
                                  {item.quantity}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <ul className="mt_20">
                          <li className="d-flex justify-content-between text-2">
                            <span>Subtotal</span>
                            <span className="fw-6">
                              ₹{subtotal.toLocaleString("en-IN")}
                            </span>
                          </li>
                          {discountAmount > 0 && (
                            <li className="d-flex justify-content-between text-2 mt_4">
                              <span>
                                Discount ({order.discount?.coupon_code})
                              </span>
                              <span
                                className="fw-6"
                                style={{ color: "#2e7d32" }}
                              >
                                - ₹
                                {Number(discountAmount).toLocaleString("en-IN")}
                              </span>
                            </li>
                          )}
                          <li className="d-flex justify-content-between text-2 mt_4">
                            <span>Shipping</span>
                            <span
                              className="fw-6"
                              style={{
                                color:
                                  order.shipping_cost === 0
                                    ? "#2e7d32"
                                    : undefined,
                              }}
                            >
                              {order.shipping_cost === 0
                                ? "FREE"
                                : `₹${Number(order.shipping_cost).toLocaleString("en-IN")}`}
                            </span>
                          </li>
                          <li className="d-flex justify-content-between text-2 mt_4 pb_8 line">
                            <span>Order Total</span>
                            <span className="fw-6">
                              ₹
                              {Number(order.total_amount).toLocaleString(
                                "en-IN",
                              )}
                            </span>
                          </li>
                        </ul>

                        {/* Actions */}
                        <div className="d-flex gap-10 mt_20 flex-wrap">
                          {(order.status === "pending" ||
                            order.status === "confirmed") &&
                            !order.cancellation_request && (
                              <button
                                onClick={() => setShowCancelModal(true)}
                                style={{
                                  background: "transparent",
                                  border: "1px solid #c62828",
                                  color: "#c62828",
                                  padding: "8px 18px",
                                  cursor: "pointer",
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                              >
                                Cancel Order
                              </button>
                            )}
                          {order.cancellation_request?.status === "pending" && (
                            <span
                              style={{
                                fontSize: 13,
                                color: "#f59e0b",
                                fontWeight: 600,
                                padding: "8px 0",
                              }}
                            >
                              ⏳ Cancellation Pending
                            </span>
                          )}
                          {order.payment_status === "paid" && (
                            <button
                              onClick={handleDownloadInvoice}
                              disabled={downloadingInvoice}
                              style={{
                                background: "transparent",
                                border: "1px solid #2c3a34",
                                color: "#2c3a34",
                                padding: "8px 18px",
                                cursor: downloadingInvoice
                                  ? "not-allowed"
                                  : "pointer",
                                fontSize: 13,
                                fontWeight: 600,
                                opacity: downloadingInvoice ? 0.7 : 1,
                              }}
                            >
                              {downloadingInvoice
                                ? "Downloading..."
                                : "↓ Download Invoice"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* ── Tab 2: Courier ── */}
                      <div
                        className={`widget-content-inner${activeTab === 2 ? " active" : ""}`}
                      >
                        {order.tracking_number ? (
                          <ul>
                            <li className="text-2 mb_8">
                              <strong>Courier : </strong>
                              {order.courier || "—"}
                            </li>
                            <li className="text-2 mb_8">
                              <strong>Tracking Number : </strong>
                              {order.tracking_number}
                            </li>
                            {order.estimated_delivery && (
                              <li className="text-2 mb_8">
                                <strong>Estimated Delivery : </strong>
                                {order.estimated_delivery}
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p style={{ color: "#888", fontSize: 14 }}>
                            Courier details will be updated once your order is
                            shipped. 🚚
                          </p>
                        )}
                      </div>

                      {/* ── Tab 3: Receiver ── */}
                      <div
                        className={`widget-content-inner${activeTab === 3 ? " active" : ""}`}
                      >
                        <p className="text-2 text_success">
                          Thank you! Your order has been received.
                        </p>
                        <ul className="mt_20">
                          <li>
                            Order Number :{" "}
                            <span className="fw-7">#{order.order_number}</span>
                          </li>
                          <li>
                            Date : <span className="fw-7">{formattedDate}</span>
                          </li>
                          <li>
                            Total :{" "}
                            <span className="fw-7">
                              ₹
                              {Number(order.total_amount).toLocaleString(
                                "en-IN",
                              )}
                            </span>
                          </li>
                          <li>
                            Payment Method :{" "}
                            <span className="fw-7">
                              {order.payment_method || "Razorpay"}
                            </span>
                          </li>
                          <li>
                            Payment Status :{" "}
                            <span
                              className="fw-7"
                              style={{ textTransform: "capitalize" }}
                            >
                              {order.payment_status}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sidebar toggle */}
      <div className="btn-sidebar-account">
        <button
          data-bs-toggle="offcanvas"
          data-bs-target="#mbAccount"
          aria-controls="offcanvas"
        >
          <i className="icon icon-sidebar-2" />
        </button>
      </div>

      {/* ── Cancel Modal ── */}
      {showCancelModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "100%",
              maxWidth: 460,
              padding: 32,
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowCancelModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 20,
                background: "none",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
                color: "#888",
              }}
            >
              ×
            </button>
            <h5 style={{ color: "#2c3a34", marginBottom: 4 }}>Cancel Order</h5>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
              #{order?.order_number}
            </p>
            <label style={{ fontSize: 13, color: "#2c3a34", fontWeight: 600 }}>
              Reason <span style={{ color: "red" }}>*</span>
            </label>
            <textarea
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please tell us why you want to cancel..."
              style={{
                width: "100%",
                marginTop: 8,
                padding: "10px 12px",
                fontSize: 13,
                border: "1px solid #ddd",
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "1px solid #ddd",
                  color: "#555",
                  padding: "11px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Go Back
              </button>
              <button
                onClick={handleCancelRequest}
                disabled={cancelling}
                style={{
                  flex: 1,
                  background: cancelling ? "#888" : "#c62828",
                  border: "none",
                  color: "#fff",
                  padding: "11px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: cancelling ? "not-allowed" : "pointer",
                }}
              >
                {cancelling ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
