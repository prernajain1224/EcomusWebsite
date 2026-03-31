import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import AccountSidebar from "../components/AccountSidebar";
import { getOrders } from "../api/checkout";
import { showErrorMessage } from "../utils";

// ── Status badge styles ──────────────────────────────────────
const STATUS_STYLES = {
  pending: { label: "Pending", bg: "#fff8e1", color: "#f59e0b" },
  confirmed: { label: "Confirmed", bg: "#e8f5e9", color: "#2c3a34" },
  shipped: { label: "Shipped", bg: "#e3f2fd", color: "#1565c0" },
  delivered: { label: "Delivered", bg: "#e8f5e9", color: "#2e7d32" },
  cancelled: { label: "Cancelled", bg: "#fce4ec", color: "#c62828" },
};

const PAYMENT_STATUS_STYLES = {
  unpaid: { label: "Unpaid", bg: "#fce4ec", color: "#c62828" },
  paid: { label: "Paid", bg: "#e8f5e9", color: "#2e7d32" },
  failed: { label: "Failed", bg: "#fce4ec", color: "#c62828" },
  refunded: { label: "Refunded", bg: "#fff8e1", color: "#f59e0b" },
};

const StatusBadge = ({ status, styles }) => {
  const s = styles[status] || { label: status, bg: "#f0f0f0", color: "#555" };
  return (
    <span
      style={{
        backgroundColor: s.bg,
        color: s.color,
        padding: "3px 12px",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}
    >
      {s.label}
    </span>
  );
};

// ── Main Orders Page ─────────────────────────────────────────
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    loadOrders(1);
  }, []);

  const loadOrders = async (pageNum) => {
    pageNum === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await getOrders(pageNum);
      const newOrders = res?.orders || [];
      setOrders((prev) =>
        pageNum === 1 ? newOrders : [...prev, ...newOrders],
      );
      setMeta(res?.meta || null);
      setPage(pageNum);
    } catch (err) {
      showErrorMessage(typeof err === "string" ? err : "Failed to load orders");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const hasMore = meta ? meta.current_page < meta.total_pages : false;

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

            {/* ── Orders Content ── */}
            <div className="col-lg-9">
              <div className="my-account-content account-order">
                {/* ── Loading skeleton ── */}
                {loading && (
                  <div>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1px solid #eee",
                          marginBottom: 16,
                          padding: 20,
                        }}
                      >
                        <div
                          style={{
                            background: "#f4f3ef",
                            height: 18,
                            width: "30%",
                            marginBottom: 10,
                            animation: "pulse 1.4s ease-in-out infinite",
                          }}
                        />
                        <div
                          style={{
                            background: "#f4f3ef",
                            height: 14,
                            width: "60%",
                            animation: "pulse 1.4s ease-in-out infinite",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Empty state ── */}
                {!loading && orders.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ fontSize: 40, marginBottom: 12 }}>🛍️</p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#2c3a34",
                        marginBottom: 8,
                      }}
                    >
                      No orders yet!
                    </p>
                    <p
                      style={{ fontSize: 14, color: "#888", marginBottom: 20 }}
                    >
                      Looks like you haven't placed any orders. Time to hop! 🌈
                    </p>
                    <Link
                      to="/collections"
                      className="tf-btn btn-fill animate-hover-btn"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}

                {/* ── Orders Table ── */}
                {!loading && orders.length > 0 && (
                  <div className="wrap-account-order">
                    <table>
                      <thead>
                        <tr>
                          <th className="fw-6">Order</th>
                          <th className="fw-6">Date</th>
                          <th className="fw-6">Status</th>
                          <th className="fw-6">Payment</th>
                          <th className="fw-6">Total</th>
                          <th className="fw-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="tf-order-item">
                            {/* Order number */}
                            <td style={{ fontWeight: 700, color: "#2c3a34" }}>
                              #{order.order_number}
                            </td>

                            {/* Date */}
                            <td style={{ color: "#888", fontSize: 13 }}>
                              {order.created_at
                                ? new Date(order.created_at).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </td>

                            {/* Order status */}
                            <td>
                              <StatusBadge
                                status={order.status}
                                styles={STATUS_STYLES}
                              />
                            </td>

                            {/* Payment status */}
                            <td>
                              <StatusBadge
                                status={order.payment_status}
                                styles={PAYMENT_STATUS_STYLES}
                              />
                            </td>

                            {/* Total */}
                            <td style={{ fontWeight: 700, color: "#2c3a34" }}>
                              ₹
                              {Number(order.total_amount).toLocaleString(
                                "en-IN",
                              )}
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#888",
                                  fontWeight: 400,
                                  display: "block",
                                }}
                              >
                                {order.order_items?.length || 0} item(s)
                              </span>
                            </td>

                            {/* View detail link — goes to separate detail page */}
                            <td>
                              <Link
                                to={`/my-account/orders/${order.id}`}
                                className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center"
                              >
                                <span>View</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* ── Load More ── */}
                    {hasMore && (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <button
                          onClick={() => loadOrders(page + 1)}
                          disabled={loadingMore}
                          className="tf-btn btn-outline animate-hover-btn"
                          style={{
                            opacity: loadingMore ? 0.7 : 1,
                            cursor: loadingMore ? "not-allowed" : "pointer",
                          }}
                        >
                          {loadingMore ? "Loading..." : "Load More Orders"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
    </>
  );
};

export default Orders;
