import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useEffect } from "react";
import { getImageUrl } from "../api/utils";
const FALLBACK_PRODUCT_IMAGE = "/assets/images/product-placeholder.svg";

const CartDrawer = ({ open, onClose }) => {
  const initCart = useCartStore((state) => state.initCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const cartData = useCartStore((state) => state.cartData);
  console.log("CartDrawer items:", cartData?.items);
  const subtotal = cartData?.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartItems = cartData?.items || [];

  useEffect(() => {
    initCart();
  }, [initCart]);

  useEffect(() => {
    if (cartData) return;
    fetchCart();
  }, [cartData, fetchCart]);

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
        className="modal fullRight fade modal-shopping-cart show"
        style={{ zIndex: 1060, display: "block" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Header */}
            <div className="header">
              <div className="title fw-5">Shopping Cart</div>
              <span
                className="icon-close icon-close-popup"
                onClick={onClose}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="wrap">
              <div className="tf-mini-cart-wrap">
                <div className="tf-mini-cart-main">
                  <div className="tf-mini-cart-sroll">
                    <div
                      className="tf-mini-cart-items"
                      style={{ height: "100vh" }}
                    >
                      {/* Empty state */}
                      {cartItems.length === 0 && (
                        <div
                          style={{
                            height: "100vh",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            justifyContent: "center",
                            padding: "40px 20px",
                            color: "#888",
                          }}
                        >
                          <p style={{ fontSize: 32, marginBottom: 12 }}>🛍️</p>
                          <p style={{ fontSize: 14, marginBottom: 16 }}>
                            Your cart is empty!
                          </p>
                          <Link
                            to="/shop"
                            onClick={onClose}
                            className="tf-btn btn-fill animate-hover-btn radius-3"
                          >
                            Start Shopping
                          </Link>
                        </div>
                      )}

                      {/* Cart items */}
                      {cartItems.map((item) => (
                        <div key={item.id} className="tf-mini-cart-item">
                          <div className="tf-mini-cart-image">
                            <Link
                              to={`/products/${item.product_slug}`}
                              onClick={onClose}
                            >
                              <img
                                src={
                                  getImageUrl(item.image_url) ||
                                  FALLBACK_PRODUCT_IMAGE
                                }
                                onError={(event) => {
                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src =
                                    FALLBACK_PRODUCT_IMAGE;
                                }}
                                alt={item.title}
                              />
                            </Link>
                          </div>
                          <div className="tf-mini-cart-info">
                            <Link
                              className="title link"
                              to={`/products/${item.product_slug}`}
                              onClick={onClose}
                            >
                              {item.name}
                            </Link>
                            {item.variant && (
                              <div className="meta-variant">{item.variant}</div>
                            )}
                            <div className="price fw-6">
                              ₹{Number(item.price).toLocaleString("en-IN")}
                            </div>
                            <div className="tf-mini-cart-btns">
                              <div className="wg-quantity small">
                                <span
                                  className="btn-quantity minus-btn"
                                  onClick={() =>
                                    useCartStore
                                      .getState()
                                      .decrementItem(item.id)
                                  }
                                >
                                  -
                                </span>
                                <input
                                  type="text"
                                  name="number"
                                  value={item.quantity}
                                  readOnly
                                />
                                <span
                                  className="btn-quantity plus-btn"
                                  onClick={() =>
                                    useCartStore
                                      .getState()
                                      .incrementItem(item.id)
                                  }
                                >
                                  +
                                </span>
                              </div>
                              <div
                                className="tf-mini-cart-remove"
                                onClick={() =>
                                  useCartStore.getState().removeItem(item.id)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                Remove
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                {cartItems.length > 0 && (
                  <div className="tf-mini-cart-bottom">
                    <div className="tf-mini-cart-bottom-wrap">
                      <div className="tf-cart-totals-discounts">
                        <div className="tf-cart-total">Subtotal</div>
                        <div className="tf-totals-total-value fw-6">
                          ₹{subtotal.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="tf-cart-tax">
                        Taxes and shipping calculated at checkout
                      </div>
                      <div className="tf-mini-cart-line" />
                      <div className="tf-mini-cart-view-checkout">
                        <Link
                          to="/cart"
                          onClick={onClose}
                          className="tf-btn btn-outline radius-3 link w-100 justify-content-center"
                        >
                          View Cart
                        </Link>
                        <Link
                          to="/checkout"
                          onClick={onClose}
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                        >
                          <span>Check Out</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
