import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode } from "swiper/modules";
import { getProductDetails } from "../api/products";
import { getImageUrl } from "../api/utils";
import { OK, showErrorMessage } from "../utils";
import { useCartStore } from "../store/cartStore";
import {
  useWishlistStore,
  getPreferredVariantId,
} from "../store/wishlistStore";
import ReviewsTab from "../components/shop/ReviewsTab";
import PeopleAlsoBought from "../components/ProductSection/PeopleAlsoBought";
import ProductRecentlyViewed from "../components/ProductSection/ProductRecentlyViewed";

const FALLBACK_IMAGE = "/assets/images/product-placeholder.svg";

const getImageSrc = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.image_url || image.url || image.image || null;
};

const formatPrice = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString("en-IN", {
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  });
};

const StarRating = ({ rating, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: 16,
            color: s <= Math.round(rating) ? "#f5a623" : "#ddd",
          }}
        >
          ★
        </span>
      ))}
    </div>
    <span style={{ fontSize: 13, color: "#888" }}>
      ({count} {count === 1 ? "review" : "reviews"})
    </span>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const addToCart = useCartStore((s) => s.addToCart);
  const wishlist = useWishlistStore((s) => s.wishlist);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const loadingWishlistVariantId = useWishlistStore(
    (s) => s.loadingWishlistVariantId,
  );

  // ── Load product ─────────────────────────────────────────
  useEffect(() => {
    console.log("slug:", slug);
    const load = async () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(true);
      setSelectedGender(null);
      setSelectedColor(null);
      setSelectedSize(null);
      setQuantity(1);
      setActiveTab("description");
      try {
        const res = await getProductDetails(slug);
        if (res?.status === "error") {
          showErrorMessage(res?.error);
          navigate("/shop");
          return;
        }
        setProduct(res?.product || res);
      } catch (err) {
        showErrorMessage(err || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const variants = product?.product_variants || [];

  const genders = useMemo(
    () => [...new Set(variants.map((v) => v.gender).filter(Boolean))],
    [variants],
  );

  const colors = useMemo(() => {
    const filtered = variants.filter(
      (v) => !selectedGender || v.gender === selectedGender,
    );
    return [
      ...new Map(
        filtered.filter((v) => v.color).map((v) => [v.color.id, v.color]),
      ).values(),
    ];
  }, [variants, selectedGender]);

  const sizes = useMemo(
    () =>
      (product?.product_sizes || []).map((ps) => ({
        id: ps.id,
        name: ps.name,
        selling_price: ps.selling_price,
        compare_price: ps.compare_price,
      })),
    [product],
  );

  const displayImages = useMemo(() => {
    if (!product) return [];
    if (selectedGender && selectedColor) {
      const filtered = variants.filter(
        (v) => v.gender === selectedGender && v.color?.id === selectedColor,
      );
      return filtered
        .flatMap((v) => v.variant_images || [])
        .filter((img) => !!getImageSrc(img));
    }
    return (variants[0]?.variant_images || []).filter(
      (img) => !!getImageSrc(img),
    );
  }, [product, variants, selectedGender, selectedColor]);

  // Auto-select defaults
  useEffect(() => {
    if (genders.length > 0 && !selectedGender) setSelectedGender(genders[0]);
  }, [genders]);
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]?.id);
  }, [colors, selectedColor]);
  useEffect(() => {
    if (!sizes.length) {
      setSelectedSize(null);
      return;
    }
    const exact = sizes.find((s) => s.name === selectedSize);
    if (!exact) setSelectedSize(sizes[0]?.name || null);
  }, [sizes]);

  const selectedVariant = variants.find(
    (v) =>
      (!selectedGender || v.gender === selectedGender) &&
      (!selectedColor || v.color?.id === selectedColor),
  );

  const selectedSizeObj = sizes.find((s) => s.name === selectedSize);
  const displayPrice =
    selectedSizeObj?.selling_price || sizes[0]?.selling_price;
  const displayComparePrice =
    selectedSizeObj?.compare_price || sizes[0]?.compare_price;
  const priceNum = Number(displayPrice);
  const compareNum = Number(displayComparePrice);
  const discount =
    compareNum > 0 && !Number.isNaN(priceNum)
      ? Math.round((1 - priceNum / compareNum) * 100)
      : 0;
  const inStock = !!selectedVariant && sizes.length > 0;

  const reviews = product?.reviews || [];
  const reviewsCount = Number(product?.reviews_count ?? reviews.length ?? 0);
  const category = product?.category || null;
  const collections = product?.collections || [];
  const preferredVariantId =
    selectedVariant?.id || getPreferredVariantId(product);
  const wishlistItem = preferredVariantId
    ? wishlist.find(
        (item) =>
          item.product_variant_id === preferredVariantId ||
          item.id === preferredVariantId,
      )
    : null;
  const isWishlisted = !!wishlistItem;
  const isWishlistLoading = loadingWishlistVariantId === preferredVariantId;

  const handleAddToCart = () => {
    if (!inStock) return;
    const activeImageSrc = displayImages[0]
      ? getImageUrl(getImageSrc(displayImages[0]))
      : FALLBACK_IMAGE;
    addToCart(
      {
        id: selectedVariant?.id || product.id,
        product_variant_id: selectedVariant?.id || product.id,
        product_id: product.id,
        slug: product.slug,
        title: product.name,
        name: product.name,
        price: Number(displayPrice) || 0,
        compare_price: Number(displayComparePrice) || 0,
        size: selectedSize,
        size_id: selectedSizeObj?.id,
        product_size_id: selectedSizeObj?.id,
        color: colors.find((c) => c.id === selectedColor)?.name,
        color_id: selectedColor,
        image: activeImageSrc,
      },
      quantity,
    );
  };

  const handleWishlistToggle = async () => {
    if (isWishlistLoading) return;
    if (!localStorage.getItem("Token")) {
      navigate("/login");
      return;
    }
    if (isWishlisted) {
      await removeFromWishlist(
        wishlistItem.wishlist_id || wishlistItem.id || preferredVariantId,
      );
    } else {
      await addToWishlist(preferredVariantId);
    }
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <section className="flat-spacing-4 pt_0">
        <div className="tf-main-product">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div
                  style={{
                    background: "#f4f3ef",
                    aspectRatio: "1/1",
                    animation: "pulse 1.4s ease-in-out infinite",
                  }}
                />
              </div>
              <div className="col-md-6">
                <div
                  style={{
                    background: "#f4f3ef",
                    height: 32,
                    width: "70%",
                    marginBottom: 16,
                    animation: "pulse 1.4s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    background: "#f4f3ef",
                    height: 24,
                    width: "40%",
                    marginBottom: 24,
                    animation: "pulse 1.4s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    background: "#f4f3ef",
                    height: 14,
                    width: "100%",
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
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="flat-spacing-4 pt_0">
        <div
          className="container"
          style={{ textAlign: "center", padding: "80px 0" }}
        >
          <p style={{ color: "#888", marginBottom: 16 }}>Product not found.</p>
          <Link to="/shop" className="tf-btn btn-fill animate-hover-btn">
            ← Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  const TABS = [
    {
      key: "description",
      label: "Description",
      content: (
        <p
          style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: 0 }}
          dangerouslySetInnerHTML={{
            __html: product.description?.replaceAll("\n", "<br />") || "",
          }}
        />
      ),
    },
    // {
    //   key: "additional",
    //   label: "Additional Information",
    //   content: (
    //     <table className="tf-pr-attrs" style={{ width: "100%" }}>
    //       <tbody>
    //         {(product?.product_attribute_values || []).map((attr) => (
    //           <tr key={attr.id} className="tf-attr-pa-color">
    //             <th className="tf-attr-label">{attr.product_attribute}</th>
    //             <td className="tf-attr-value">
    //               <p>{attr.value}</p>
    //             </td>
    //           </tr>
    //         ))}
    //         {(product?.product_attribute_values || []).length === 0 && (
    //           <tr>
    //             <td
    //               colSpan={2}
    //               style={{ color: "#aaa", fontSize: 13, padding: "10px 0" }}
    //             >
    //               No additional information available.
    //             </td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </table>
    //   ),
    // },
    {
      key: "reviews",
      label: `Review (${reviewsCount})`,
      content: (
        <ReviewsTab
          reviews={reviews}
          reviewsCount={reviewsCount}
          productSlug={slug}
          onReviewSubmitted={(newReview) => {
            setProduct((prev) => ({
              ...prev,
              reviews: [newReview, ...(prev.reviews || [])],
              reviews_count: (Number(prev.reviews_count) || 0) + 1,
            }));
          }}
        />
      ),
    },
    {
      key: "shipping",
      label: "Shipping",
      content: (
        <div className="tf-page-privacy-policy">
          <p>
            We use Qikink as our fulfillment partner. Orders are processed
            within 3–5 business days.
          </p>
          <ul>
            <li>
              <strong>Metro Cities:</strong> 4–7 business days
            </li>
            <li>
              <strong>Tier 2 & 3 Cities:</strong> 6–10 business days
            </li>
            <li>
              <strong>Remote Areas:</strong> 10–14 business days
            </li>
          </ul>
          <p>
            You will receive a tracking link via email once shipped. For
            queries:{" "}
            <a href="mailto:hello@huehoppers.com">hello@huehoppers.com</a>
          </p>
        </div>
      ),
    },
    {
      key: "returns",
      label: "Return Policies",
      content: (
        <div className="tf-page-privacy-policy">
          <p>
            Returns accepted within <strong>7 days</strong> of delivery. Items
            must be unused, unwashed with all tags intact.
          </p>
          <p>
            Customised or personalised products cannot be returned unless
            defective. For return requests email{" "}
            <a href="mailto:hello@huehoppers.com">hello@huehoppers.com</a> with
            subject: <em>Return Request – [Order ID]</em>
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link to="/" className="text">
                Home
              </Link>
              <i className="icon icon-arrow-right" />
              {category && (
                <>
                  <Link to={`/shop?category=${category.slug}`} className="text">
                    {category.name}
                  </Link>
                  <i className="icon icon-arrow-right" />
                </>
              )}
              <span className="text">{product.name}</span>
            </div>
            <div className="tf-breadcrumb-prev-next">
              <Link
                to="/shop"
                className="tf-breadcrumb-back hover-tooltip center"
              >
                <i className="icon icon-shop" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Product Section ── */}
      <section className="flat-spacing-4 pt_0">
        <div className="tf-main-product section-image-zoom">
          <div className="container">
            <div className="row">
              {/* ── LEFT: Image Gallery ── */}
              <div className="col-md-6">
                <div className="tf-product-media-wrap sticky-top">
                  {displayImages.length > 0 ? (
                    <div className="thumbs-slider">
                      {/* Thumbs vertical */}
                      <Swiper
                        onSwiper={setThumbsSwiper}
                        direction="vertical"
                        spaceBetween={8}
                        slidesPerView={5}
                        freeMode
                        watchSlidesProgress
                        modules={[FreeMode, Thumbs]}
                        className="tf-product-media-thumbs other-image-zoom"
                        style={{ height: 480 }}
                      >
                        {displayImages.map((img, i) => (
                          <SwiperSlide key={img.id || i}>
                            <div className="item">
                              <img
                                src={
                                  getImageUrl(getImageSrc(img)) ||
                                  FALLBACK_IMAGE
                                }
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_IMAGE;
                                }}
                                alt={`${product.name} ${i + 1}`}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>

                      {/* Main swiper */}
                      <Swiper
                        spaceBetween={10}
                        thumbs={{
                          swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed
                              ? thumbsSwiper
                              : null,
                        }}
                        modules={[FreeMode, Thumbs]}
                        className="tf-product-media-main"
                        id="gallery-swiper-started"
                      >
                        {displayImages.map((img, i) => (
                          <SwiperSlide key={img.id || i}>
                            <div className="item">
                              <img
                                className="tf-image-zoom"
                                src={
                                  getImageUrl(getImageSrc(img)) ||
                                  FALLBACK_IMAGE
                                }
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_IMAGE;
                                }}
                                alt={product.name}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  ) : (
                    // No images fallback
                    <div
                      style={{
                        background: "#f4f3ef",
                        aspectRatio: "1/1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 80,
                      }}
                    >
                      👕
                    </div>
                  )}
                </div>
              </div>

              {/* ── RIGHT: Product Info ── */}
              <div className="col-md-6">
                <div className="tf-product-info-wrap position-relative">
                  <div className="tf-product-info-list other-image-zoom">
                    {/* Title */}
                    <div className="tf-product-info-title">
                      <h5>{product.name}</h5>
                    </div>

                    {/* Rating */}
                    <div style={{ marginBottom: 12 }}>
                      <StarRating
                        rating={Number(product.avg_rating ?? 0)}
                        count={reviewsCount}
                      />
                    </div>

                    {/* Price */}
                    <div className="tf-product-info-price">
                      <div className="price-on-sale">
                        ₹{formatPrice(displayPrice)}
                      </div>
                      {displayComparePrice &&
                        Number(displayComparePrice) > Number(displayPrice) && (
                          <div className="compare-at-price">
                            ₹{formatPrice(displayComparePrice)}
                          </div>
                        )}
                      {discount > 0 && (
                        <div className="badges-on-sale">
                          <span>{discount}</span>% OFF
                        </div>
                      )}
                    </div>

                    {/* Short description */}
                    {product.design?.description && (
                      <p
                        style={{
                          fontSize: 14,
                          color: "#555",
                          lineHeight: 1.7,
                          marginBottom: 16,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: product.design.description.replace(
                            /\n/g,
                            "<br />",
                          ),
                        }}
                      />
                    )}

                    {/* Variant Picker */}
                    <div className="tf-product-info-variant-picker">
                      {/* Gender */}
                      {genders.length > 0 && (
                        <div className="variant-picker-item">
                          <div className="variant-picker-label">
                            Gender:{" "}
                            <span className="fw-6 variant-picker-label-value">
                              {selectedGender === "male" ? "Boy" : "Girl"}
                            </span>
                          </div>
                          <div className="variant-picker-values">
                            {genders.map((gender) => (
                              <label
                                key={gender}
                                className={`style-text size-btn${selectedGender === gender ? " active" : ""}`}
                                onClick={() => {
                                  setSelectedGender(gender);
                                  setSelectedColor(null);
                                  setSelectedSize(null);
                                }}
                                style={{
                                  cursor: "pointer",
                                  border:
                                    selectedGender === gender
                                      ? "2px solid #2c3a34"
                                      : "1px solid #ddd",
                                  padding: "6px 12px",
                                  borderRadius: 4,
                                }}
                              >
                                <p>
                                  {gender === "Male" || gender === "male"
                                    ? "👦 Boy"
                                    : "👧 Girl"}
                                </p>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Color */}
                      {colors.length > 0 && (
                        <div className="variant-picker-item">
                          <div className="variant-picker-label">
                            Color:{" "}
                            <span className="fw-6 variant-picker-label-value value-currentColor">
                              {colors.find((c) => c.id === selectedColor)
                                ?.name || ""}
                            </span>
                          </div>
                          <div className="variant-picker-values">
                            {colors.map((color) => (
                              <label
                                key={color.id}
                                className={`hover-tooltip radius-60 color-btn${selectedColor === color.id ? " active" : ""}`}
                                onClick={() => {
                                  setSelectedColor(color.id);
                                  setSelectedSize(null);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <span
                                  className="btn-checkbox"
                                  style={{
                                    backgroundColor: color.hex_code || "#ccc",
                                    outline:
                                      selectedColor === color.id
                                        ? "2px solid #2c3a34"
                                        : "none",
                                    outlineOffset: 2,
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    boxShadow:
                                      color.hex_code === "#ffffff"
                                        ? "inset 0 0 0 1px #ddd"
                                        : "none",
                                  }}
                                />
                                <span className="tooltip">{color.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Size */}
                      {sizes.length > 0 && (
                        <div className="variant-picker-item">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="variant-picker-label">
                              Size:{" "}
                              <span className="fw-6 variant-picker-label-value">
                                {selectedSize || ""}
                              </span>
                            </div>
                          </div>
                          <div className="variant-picker-values">
                            {sizes.map((sizeObj) => (
                              <label
                                key={sizeObj.id}
                                className={`style-text size-btn${selectedSize === sizeObj.name ? " active" : ""}`}
                                onClick={() => setSelectedSize(sizeObj.name)}
                                style={{
                                  cursor: "pointer",
                                  border:
                                    selectedSize === sizeObj.name
                                      ? "2px solid #2c3a34"
                                      : "1px solid #ddd",
                                  padding: "6px 12px",
                                  borderRadius: 4,
                                }}
                              >
                                <p>{sizeObj.name}</p>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="tf-product-info-quantity">
                      <div className="quantity-title fw-6">Quantity</div>
                      <div className="wg-quantity">
                        <span
                          className="btn-quantity btn-decrease"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        >
                          -
                        </span>
                        <input
                          type="text"
                          className="quantity-product"
                          name="number"
                          value={quantity}
                          readOnly
                        />
                        <span
                          className="btn-quantity btn-increase"
                          onClick={() => setQuantity((q) => q + 1)}
                        >
                          +
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="tf-product-info-buy-button">
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={handleAddToCart}
                          disabled={!inStock}
                          className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                          style={{
                            opacity: !inStock ? 0.6 : 1,
                            cursor: !inStock ? "not-allowed" : "pointer",
                          }}
                        >
                          <span>
                            {inStock ? "Add to cart" : "Out of Stock"} —&nbsp;
                          </span>
                          <span className="tf-qty-price">
                            ₹{formatPrice(Number(displayPrice) * quantity)}
                          </span>
                        </button>

                        {/* Wishlist */}
                        <button
                          onClick={handleWishlistToggle}
                          disabled={isWishlistLoading}
                          className="tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action"
                          style={{
                            border: "1px solid #ddd",
                            padding: 10,
                            cursor: isWishlistLoading
                              ? "not-allowed"
                              : "pointer",
                          }}
                        >
                          <span
                            className="icon icon-heart"
                            style={{
                              color: isWishlisted ? "#d32f2f" : undefined,
                            }}
                          />
                          <span className="tooltip">
                            {isWishlisted
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Delivery & Return info */}
                    <div className="tf-product-info-delivery-return">
                      <div className="row">
                        <div className="col-xl-6 col-12">
                          <div className="tf-product-delivery">
                            <div className="icon">
                              <i className="icon-delivery-time" />
                            </div>
                            <p>
                              Estimate delivery:{" "}
                              <span className="fw-7">4–14 days</span> across
                              India.
                            </p>
                          </div>
                        </div>
                        <div className="col-xl-6 col-12">
                          <div className="tf-product-delivery mb-0">
                            <div className="icon">
                              <i className="icon-return-order" />
                            </div>
                            <p>
                              Return within <span className="fw-7">7 days</span>{" "}
                              of purchase.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trust seal + payments */}
                    <div className="tf-product-info-trust-seal">
                      <div className="tf-product-trust-mess">
                        <i className="icon-safe" />
                        <p className="fw-6">
                          Guarantee Safe <br />
                          Checkout
                        </p>
                      </div>
                      <div className="tf-payment">
                        <img
                          src="/assets/images/payments/visa.png"
                          alt="Visa"
                        />
                        <img
                          src="/assets/images/payments/img-1.png"
                          alt="Payment"
                        />
                        <img
                          src="/assets/images/payments/img-2.png"
                          alt="Payment"
                        />
                        <img
                          src="/assets/images/payments/img-3.png"
                          alt="Payment"
                        />
                        <img
                          src="/assets/images/payments/img-4.png"
                          alt="Payment"
                        />
                      </div>
                    </div>

                    {/* Category + Collections */}
                    <div
                      style={{
                        fontSize: 13,
                        color: "#888",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginTop: 16,
                      }}
                    >
                      {category && (
                        <div>
                          <span style={{ fontWeight: 600, color: "#555" }}>
                            Category:{" "}
                          </span>
                          <Link
                            to={`/products?category=${category.slug}`}
                            style={{
                              border: "1px solid #ddd",
                              padding: "2px 10px",
                              color: "#2c3a34",
                              textDecoration: "none",
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {category.name}
                          </Link>
                        </div>
                      )}
                      {collections.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span style={{ fontWeight: 600, color: "#555" }}>
                            Collections:{" "}
                          </span>
                          {collections.map((c) => (
                            <Link
                              key={c.id}
                              to={`/collections/${c.slug}`}
                              style={{
                                border: "1px solid #ddd",
                                padding: "2px 10px",
                                color: "#2c3a34",
                                textDecoration: "none",
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <section className="flat-spacing-17 pt_0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="widget-tabs style-has-border">
                <ul className="widget-menu-tab">
                  {TABS.map((tab) => (
                    <li
                      key={tab.key}
                      className={`item-title${activeTab === tab.key ? " active" : ""}`}
                      onClick={() => setActiveTab(tab.key)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="inner">{tab.label}</span>
                    </li>
                  ))}
                </ul>
                <div className="widget-content-tab">
                  {TABS.map((tab) => (
                    <div
                      key={tab.key}
                      className={`widget-content-inner${activeTab === tab.key ? " active" : ""}`}
                    >
                      {tab.content}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PeopleAlsoBought />
      <ProductRecentlyViewed />
    </>
  );
};

export default ProductDetail;
