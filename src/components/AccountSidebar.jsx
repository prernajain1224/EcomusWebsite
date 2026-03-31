import { NavLink, useNavigate } from "react-router-dom";
import { showSuccessMessage } from "../utils";

/**
 * AccountSidebar — Reusable sidebar for all account pages
 * Uses NavLink so active tab is auto-highlighted by React Router
 *
 * Usage:
 * <AccountSidebar />
 */

const NAV_ITEMS = [
  { label: "Dashboard", path: "/my-account" },
  { label: "Account Details", path: "/my-account/profile" },
  { label: "Addresses", path: "/my-account/addresses" },
  { label: "Notifications", path: "/my-account/notifications" },
  { label: "Orders", path: "/my-account/orders" },
  { label: "Wishlist", path: "/my-account/wishlist" },
];

const AccountSidebar = ({ activeTab = "Dashboard" }) => {
  const navigate = useNavigate();
  // const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userType");
    // clearCart();
    // clearWishlistLocal();
    navigate("/login");
  };

  return (
    <div className="wrap-sidebar-account">
      <ul className="my-account-nav">
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={`my-account-nav-item${
                window.location.pathname === item.path ? " active" : ""
              }`}
            >
              {item.label}
            </NavLink>
          </li>
        ))}

        {/* Logout — not a NavLink, just a button */}
        <li key={"logout"}>
          <NavLink
            onClick={handleLogout}
            href="#"
            className="my-account-nav-item"
          >
            Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AccountSidebar;
