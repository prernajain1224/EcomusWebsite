import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchDrawer = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
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

      {/* Drawer */}
      <div
        className="offcanvas offcanvas-end canvas-search show"
        style={{ visibility: "visible", zIndex: 1060 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="canvas-wrapper">
          <header className="tf-search-head">
            <div className="title fw-5">
              Search our site
              <div className="close">
                <span
                  className="icon-close icon-close-popup"
                  onClick={onClose}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="tf-search-sticky">
              <form className="tf-mini-search-frm" onSubmit={handleSearch}>
                <fieldset className="text">
                  <input
                    type="text"
                    placeholder="Search products..."
                    name="text"
                    tabIndex={0}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-required="true"
                    autoFocus
                  />
                </fieldset>
                <button type="submit">
                  <i className="icon-search" />
                </button>
              </form>
            </div>
          </header>

          <div className="canvas-body p-0">
            <div className="tf-search-content">
              <div className="tf-cart-hide-has-results">
                <div className="tf-col-quicklink">
                  <div className="tf-search-content-title fw-5">
                    Quick Links
                  </div>
                  <ul className="tf-quicklink-list">
                    {[
                      {
                        label: "Boys T-Shirts",
                        path: "/products?gender=boys&category=tshirts",
                      },
                      {
                        label: "Girls T-Shirts",
                        path: "/products?gender=girls&category=tshirts",
                      },
                      {
                        label: "Infants Rompers",
                        path: "/products?gender=infants&category=rompers",
                      },
                      { label: "All Collections", path: "/collections" },
                    ].map((link) => (
                      <li key={link.label} className="tf-quicklink-item">
                        <a
                          href={link.path}
                          onClick={(e) => {
                            e.preventDefault();
                            onClose();
                            navigate(link.path);
                          }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchDrawer;
