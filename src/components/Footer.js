import { Link } from "react-router-dom";

const Footer = () => {
  const isLoggedIn = !!localStorage.getItem("Token");

  return (
    <footer id="footer" className="footer md-pb-70">
      <div className="footer-wrap">
        <div className="footer-body">
          <div className="container">
            <div className="row">
              {/* ── Col 1: Brand Info ── */}
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-infor">
                  <div className="footer-logo">
                    <Link to="/">
                      <img src="/assets/images/logo.png" alt="HueHoppers" />
                    </Link>
                  </div>
                  <ul>
                    <li>
                      <p>
                        At HueHoppers, we believe every child is a new mood
                        every day. Hop into your hue — every single day. 🌈
                      </p>
                    </li>
                    <br />
                    <li>
                      <p>
                        Email:{" "}
                        <a href="mailto:hello@huehoppers.com">
                          hello@huehoppers.com
                        </a>
                      </p>
                    </li>
                    <li>
                      <p>
                        Phone: <a href="tel:+918527894154">+91 85278 94154</a>
                      </p>
                    </li>
                  </ul>

                  <ul className="tf-social-icon d-flex gap-10">
                    <li>
                      <a
                        href="https://facebook.com/huehoppers"
                        target="_blank"
                        rel="noreferrer"
                        className="box-icon w_34 round social-facebook social-line"
                      >
                        <i className="icon fs-14 icon-fb" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://instagram.com/huehoppers26"
                        target="_blank"
                        rel="noreferrer"
                        className="box-icon w_34 round social-instagram social-line"
                      >
                        <i className="icon fs-14 icon-instagram" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ── Col 2: Our Shop ── */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>Our Shop</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>Our Shop</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  <li>
                    <Link to="/shop" className="footer-menu_item">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/collections" className="footer-menu_item">
                      Collections
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className="footer-menu_item">
                      Cart
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-account/wishlist"
                      className="footer-menu_item"
                    >
                      Wishlist
                    </Link>
                  </li>
                  {isLoggedIn ? (
                    <>
                      <li>
                        <Link
                          to="/my-account/orders"
                          className="footer-menu_item"
                        >
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <Link to="/my-account" className="footer-menu_item">
                          My Account
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/login" className="footer-menu_item">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="footer-menu_item">
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* ── Col 3: Information ── */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>Information</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>Information</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  <li>
                    <Link to="/about" className="footer-menu_item">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/blogs" className="footer-menu_item">
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="footer-menu_item">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/shipping-policy" className="footer-menu_item">
                      Shipping Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/return-policy" className="footer-menu_item">
                      Return Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms-and-conditions"
                      className="footer-menu_item"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/cookies-policy" className="footer-menu_item">
                      Cookies Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* ── Col 4: Newsletter ── */}
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-newsletter footer-col-block">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>Stay in the Loop!</h6>
                  </div>
                  <div className="footer-heading footer-heading-moblie">
                    <h6>Stay in the Loop!</h6>
                  </div>
                  <div className="tf-collapse-content">
                    <div className="footer-menu_item">
                      Sign up to get first dibs on new arrivals, sales,
                      exclusive collections, and more! 🎉
                    </div>
                    <form
                      className="form-newsletter"
                      id="subscribe-form"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div id="subscribe-content">
                        <fieldset className="email">
                          <input
                            type="email"
                            name="email-form"
                            id="subscribe-email"
                            placeholder="Enter your email..."
                            tabIndex="0"
                            aria-required="true"
                          />
                        </fieldset>
                        <div className="button-submit">
                          <button
                            id="subscribe-button"
                            className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                            type="submit"
                          >
                            Subscribe
                            <i className="icon icon-arrow1-top-left" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer Bottom ── */}
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="footer-bottom-wrap d-flex gap-20 flex-wrap justify-content-between align-items-center">
                  <div className="footer-menu_item">
                    © {new Date().getFullYear()} HueHoppers Lifestyle LLP. All
                    Rights Reserved.
                  </div>
                  <div className="tf-payment">
                    <img src="/assets/images/payments/visa.png" alt="Visa" />
                    <img
                      src="/assets/images/payments/img-1.png"
                      alt="Mastercard"
                    />
                    <img
                      src="/assets/images/payments/img-2.png"
                      alt="Razorpay"
                    />
                    <img src="/assets/images/payments/img-3.png" alt="UPI" />
                    <img
                      src="/assets/images/payments/img-4.png"
                      alt="Net Banking"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
