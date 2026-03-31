import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import AccountSidebar from "../components/AccountSidebar";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/account";
import { showErrorMessage, showSuccessMessage } from "../utils";

// ── Notification type config ─────────────────────────────────
const TYPE_CONFIG = {
  order_update: { icon: "📦", label: "Order" },
  account_activity: { icon: "👤", label: "Account" },
  collection_launch: { icon: "✨", label: "New Collection" },
  promo: { icon: "🎉", label: "Offer" },
};

// ── Time ago helper ───────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

// ── Single Notification Item ──────────────────────────────────
const NotificationItem = ({ notif, onRead }) => {
  const config = TYPE_CONFIG[notif.notif_type] || {
    icon: "🔔",
    label: "Notification",
  };

  const handleClick = async () => {
    if (!notif.is_read) await onRead(notif.id);
    if (notif.target_url) window.location.href = notif.target_url;
  };

  const content = (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        gap: 16,
        padding: "16px 20px",
        backgroundColor: notif.is_read ? "#fff" : "#f6f9f6",
        borderBottom: "1px solid #f0f0f0",
        cursor: notif.target_url || !notif.is_read ? "pointer" : "default",
        position: "relative",
        transition: "background 0.15s",
      }}
    >
      {/* Unread dot */}
      {!notif.is_read && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#2c3a34",
          }}
        />
      )}

      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: notif.is_read ? "#f4f3ef" : "#d6ead8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {config.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingRight: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#2c3a34",
              backgroundColor: "#f4f3ef",
              padding: "2px 8px",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {config.label}
          </span>
          <span style={{ fontSize: 12, color: "#aaa" }}>
            {timeAgo(notif.created_at)}
          </span>
        </div>
        <p
          style={{
            margin: "0 0 4px",
            fontWeight: notif.is_read ? 400 : 700,
            color: "#2c3a34",
            fontSize: 14,
          }}
        >
          {notif.title}
        </p>
        <p style={{ margin: 0, color: "#777", fontSize: 13, lineHeight: 1.5 }}>
          {notif.message}
        </p>
      </div>
    </div>
  );

  return notif.target_url ? (
    <Link
      to={notif.target_url}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      style={{ textDecoration: "none", display: "block" }}
    >
      {content}
    </Link>
  ) : (
    content
  );
};

// ── Main Notifications Page ───────────────────────────────────
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res?.notifications || []);
      setUnreadCount(res?.unread_count || 0);
    } catch (err) {
      showErrorMessage(
        typeof err === "string" ? err : "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  };

  // Mark single — optimistic UI
  const handleMarkRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await markNotificationRead(id);
    } catch (err) {
      // revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)),
      );
      setUnreadCount((prev) => prev + 1);
      showErrorMessage(
        typeof err === "string" ? err : "Could not mark as read",
      );
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      showSuccessMessage("All notifications marked as read!");
    } catch (err) {
      showErrorMessage(
        typeof err === "string" ? err : "Could not mark all as read",
      );
    } finally {
      setMarkingAll(false);
    }
  };

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
              <div className="my-account-content">
                {/* ── Loading skeleton ── */}
                {loading && (
                  <div>
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 16,
                          padding: "16px 0",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "#f4f3ef",
                            flexShrink: 0,
                            animation: "pulse 1.4s ease-in-out infinite",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              background: "#f4f3ef",
                              height: 14,
                              width: "30%",
                              marginBottom: 8,
                              animation: "pulse 1.4s ease-in-out infinite",
                            }}
                          />
                          <div
                            style={{
                              background: "#f4f3ef",
                              height: 14,
                              width: "80%",
                              animation: "pulse 1.4s ease-in-out infinite",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Empty state ── */}
                {!loading && notifications.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ fontSize: 40, marginBottom: 12 }}>🔔</p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#2c3a34",
                        marginBottom: 8,
                      }}
                    >
                      All caught up!
                    </p>
                    <p style={{ fontSize: 14, color: "#888" }}>
                      No notifications yet. Keep hopping! 🌈
                    </p>
                  </div>
                )}

                {/* ── Notifications list ── */}
                {!loading && notifications.length > 0 && (
                  <>
                    {/* Header row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      {unreadCount > 0 ? (
                        <p
                          style={{
                            fontSize: 13,
                            color: "#555",
                            margin: 0,
                            fontWeight: 500,
                          }}
                        >
                          You have{" "}
                          <span style={{ fontWeight: 700, color: "#2c3a34" }}>
                            {unreadCount} unread
                          </span>{" "}
                          notification{unreadCount > 1 ? "s" : ""}
                        </p>
                      ) : (
                        <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
                          All caught up! 🌈
                        </p>
                      )}

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          disabled={markingAll}
                          className="tf-btn btn-outline animate-hover-btn"
                          style={{
                            fontSize: 12,
                            padding: "6px 16px",
                            opacity: markingAll ? 0.6 : 1,
                            cursor: markingAll ? "not-allowed" : "pointer",
                          }}
                        >
                          {markingAll ? "Marking..." : "Mark all as read"}
                        </button>
                      )}
                    </div>

                    {/* List */}
                    <div style={{ border: "1px solid #ddd" }}>
                      {notifications.map((notif) => (
                        <NotificationItem
                          key={notif.id}
                          notif={notif}
                          onRead={handleMarkRead}
                        />
                      ))}
                    </div>
                  </>
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

export default Notifications;
