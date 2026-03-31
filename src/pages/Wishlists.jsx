import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import AccountSidebar from "../components/AccountSidebar";
import { useWishlistStore } from "../store/wishlistStore";
import { getImageUrl } from "../api/utils";
import ProductCard from "../components/ProductCard";

const FALLBACK_IMAGE = "/assets/images/product-placeholder.svg";

const formatPrice = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString("en-IN", {
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  });
};

const Wishlist = () => {
  const wishlist = useWishlistStore((s) => s.wishlist);
  const loading = useWishlistStore((s) => s.loading);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const moveToCart = useWishlistStore((s) => s.moveToCart);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

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
              <div className="my-account-content account-wishlist">
                {/* Loading skeleton */}
                {loading && (
                  <div className="grid-layout wrapper-shop" data-grid="grid-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="card-product">
                        <div className="card-product-wrapper">
                          <div
                            style={{
                              paddingTop: "120%",
                              background: "#f4f3ef",
                              animation: "pulse 1.4s ease-in-out infinite",
                            }}
                          />
                        </div>
                        <div
                          className="card-product-info"
                          style={{ padding: "12px 0" }}
                        >
                          <div
                            style={{
                              background: "#f4f3ef",
                              height: 14,
                              width: "70%",
                              marginBottom: 8,
                              animation: "pulse 1.4s ease-in-out infinite",
                            }}
                          />
                          <div
                            style={{
                              background: "#f4f3ef",
                              height: 14,
                              width: "40%",
                              animation: "pulse 1.4s ease-in-out infinite",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {!loading && wishlist.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ fontSize: 40, marginBottom: 12 }}>🤍</p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#2c3a34",
                        marginBottom: 8,
                      }}
                    >
                      Your wishlist is empty!
                    </p>
                    <p
                      style={{ fontSize: 14, color: "#888", marginBottom: 20 }}
                    >
                      Add products you love and move them to cart anytime. 🌈
                    </p>
                    <Link
                      to="/products"
                      className="tf-btn btn-fill animate-hover-btn"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}

                {/* Wishlist grid — same design as static */}
                {!loading && wishlist.length > 0 && (
                  <div className="grid-layout wrapper-shop" data-grid="grid-3">
                    {wishlist.map((item) => (
                      <ProductCard key={item.id} product={item} />
                      // <div key={item.id} className="card-product">
                      //   <div className="card-product-wrapper">
                      //     <Link
                      //       to={
                      //         item.slug ? `/products/${item.slug}` : "/products"
                      //       }
                      //       className="product-img"
                      //     >
                      //       <img
                      //         className="lazyload img-product"
                      //         src={
                      //           item.display_image
                      //             ? getImageUrl(item.display_image)
                      //             : FALLBACK_IMAGE
                      //         }
                      //         onError={(e) => {
                      //           e.currentTarget.src = FALLBACK_IMAGE;
                      //         }}
                      //         alt={item.name}
                      //       />
                      //     </Link>

                      //     {/* Action buttons */}
                      //     <div className="list-product-btn absolute-2">
                      //       {/* Move to cart */}
                      //       <a
                      //         href="#"
                      //         onClick={(e) => {
                      //           e.preventDefault();
                      //           moveToCart({
                      //             wishlistId: item.id,
                      //             quantity: 1,
                      //           });
                      //         }}
                      //         className="box-icon bg_white quick-add tf-btn-loading"
                      //       >
                      //         <span className="icon icon-bag" />
                      //         <span className="tooltip">Move to Cart</span>
                      //       </a>

                      //       {/* Remove from wishlist */}
                      //       <a
                      //         href="#"
                      //         onClick={(e) => {
                      //           e.preventDefault();
                      //           removeFromWishlist(item.id);
                      //         }}
                      //         className="box-icon bg_white wishlist btn-icon-action"
                      //       >
                      //         <span className="icon icon-heart" />
                      //         <span className="tooltip">
                      //           Remove from Wishlist
                      //         </span>
                      //         <span className="icon icon-delete" />
                      //       </a>

                      //       {/* Quick view */}
                      //       <Link
                      //         to={
                      //           item.slug
                      //             ? `/products/${item.slug}`
                      //             : "/products"
                      //         }
                      //         className="box-icon bg_white quickview tf-btn-loading"
                      //       >
                      //         <span className="icon icon-view" />
                      //         <span className="tooltip">Quick View</span>
                      //       </Link>
                      //     </div>

                      //     {/* Discount badge */}
                      //     {item.discount_percent > 0 && (
                      //       <div className="on-sale-wrap text-end">
                      //         <div className="on-sale-item">
                      //           -{item.discount_percent}%
                      //         </div>
                      //       </div>
                      //     )}
                      //   </div>

                      //   {/* Product info */}
                      //   <div className="card-product-info">
                      //     <Link
                      //       to={
                      //         item.slug ? `/products/${item.slug}` : "/products"
                      //       }
                      //       className="title link"
                      //     >
                      //       {item.name}
                      //     </Link>
                      //     <span className="price">
                      //       ₹{formatPrice(item.price)}
                      //       {item.compare_price &&
                      //         Number(item.compare_price) >
                      //           Number(item.price) && (
                      //           <span
                      //             style={{
                      //               marginLeft: 8,
                      //               fontSize: 12,
                      //               color: "#aaa",
                      //               textDecoration: "line-through",
                      //             }}
                      //           >
                      //             ₹{formatPrice(item.compare_price)}
                      //           </span>
                      //         )}
                      //     </span>
                      //   </div>
                      // </div>
                    ))}
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

export default Wishlist;
