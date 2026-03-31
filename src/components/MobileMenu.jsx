import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Collections", path: "/collections" },
  { label: "Shop", path: "/shop" },
  {
    label: "Boys",
    dropdown: [
      { label: "T-Shirts", path: "/shop?gender=boys&product_type=tshirt" },
    ],
  },
  {
    label: "Girls",
    dropdown: [
      { label: "T-Shirts", path: "/shop?gender=girls&product_type=tshirt" },
    ],
  },
  {
    label: "Infants",
    dropdown: [
      { label: "T-Shirts", path: "/shop?gender=infants&product_type=tshirt" },
      { label: "Rompers", path: "/shop?gender=infants&product_type=romper" },
    ],
  },
  { label: "Blogs", path: "/blogs" },
];

const MobileMenu = ({ open, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("Token");

  // const logout = useAuthStore((s) => s.logout);

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userType");
    // clearCart();
    // clearWishlistLocal();
    navigate("/login");
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1055,
        }}
      />

      {/* Menu */}
      <div
        className="offcanvas offcanvas-start canvas-mb show"
        style={{ visibility: "visible", zIndex: 1060 }}
        aria-modal="true"
        role="dialog"
      >
        {/* Close */}
        <span
          className="icon-close icon-close-popup"
          onClick={onClose}
          style={{ cursor: "pointer" }}
        />

        <div className="mb-canvas-content">
          <div className="mb-body">
            <ul className="nav-ul-mb">
              {NAV_ITEMS.map((item) => (
                <li key={item.label} className="nav-mb-item">
                  {item.dropdown ? (
                    <>
                      <a
                        href="#"
                        className="mb-menu-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenDropdown(
                            openDropdown === item.label ? null : item.label,
                          );
                        }}
                      >
                        <span>{item.label}</span>
                        <span className="btn-open-sub" />
                      </a>
                      {openDropdown === item.label && (
                        <ul className="sub-nav-menu">
                          {item.dropdown.map((sub) => (
                            <li key={sub.label}>
                              <a
                                href={sub.path}
                                className="sub-nav-link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNav(sub.path);
                                }}
                              >
                                {sub.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.path}
                      className="mb-menu-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(item.path);
                      }}
                    >
                      <span>{item.label}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Other content */}
            <div className="mb-other-content">
              <div className="d-flex group-icon">
                <a
                  href="/wishlist"
                  className="site-nav-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav("/wishlist");
                  }}
                >
                  <i className="icon icon-heart" /> Wishlist
                </a>
                <a
                  href="/contact"
                  className="site-nav-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav("/contact");
                  }}
                >
                  <i className="icon icon-phone" /> Contact
                </a>
              </div>
              <div className="mb-notice">
                <a
                  href="/contact"
                  className="text-need"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav("/contact");
                  }}
                >
                  Need help?
                </a>
              </div>
              <ul className="mb-info">
                <li>
                  96, UGF, Pocket B, Sector 26, Rohini,
                  <br />
                  New Delhi, Delhi 110042
                </li>
                <li>
                  Email: <b>hello@huehoppers.com</b>
                </li>
                <li>
                  Phone: <b>+91 85278 94154</b>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mb-bottom">
            {isLoggedIn ? (
              <>
                <a
                  href="/my-account"
                  className="site-nav-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav("/my-account");
                  }}
                >
                  <i className="icon icon-account" /> My Account
                </a>
                <button
                  onClick={handleLogout}
                  className="site-nav-icon"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <i className="icon icon-logout" /> Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="site-nav-icon"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav("/login");
                }}
              >
                <i className="icon icon-account" /> Login
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
