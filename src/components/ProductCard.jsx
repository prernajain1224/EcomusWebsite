import { Link } from "react-router-dom";
import { getImageUrl } from "../api/utils";
import { stripEmojis } from "../utils";

const FALLBACK_IMAGE = "/assets/images/product-placeholder.svg";

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

const ProductCard = ({ product }) => {
  console.log("Rendering ProductCard for:", product);
  const { slug, display_image, name, price, compare_price, avg_rating } =
    product;

  const image = getImageUrl(display_image) || FALLBACK_IMAGE;
  const hoverImage = getImageUrl(display_image) || FALLBACK_IMAGE;

  const numericPrice = Number(price);
  const numericComparePrice = Number(compare_price);
  const onSale =
    !Number.isNaN(numericPrice) &&
    !Number.isNaN(numericComparePrice) &&
    numericComparePrice > numericPrice;
  const formatPrice = (value) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return value;
    }
    return numericValue.toString();
  };

  const discount =
    numericComparePrice > 0 && !Number.isNaN(numericPrice)
      ? Math.round((1 - numericPrice / numericComparePrice) * 100)
      : 0;

  return (
    <div className="card-product">
      <div className="card-product-wrapper">
        <Link
          to={`/products/${product.slug || product.product_slug}`}
          className="product-img"
        >
          <img
            loading="lazy"
            decoding="async"
            className="lazyload img-product"
            src={image}
            alt={name}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <img
            loading="lazy"
            decoding="async"
            className="lazyload img-hover"
            src={hoverImage}
            alt={name}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </Link>

        {/* Sale badge */}
        {onSale && (
          <div className="on-sale-wrap text-end">
            <div
              className="on-sale-item"
              style={{ backgroundColor: "#3a00ac" }}
            >
              -{discount}%
            </div>
          </div>
        )}
      </div>
      <div className="card-product-info">
        <Link to={`/products/${product.slug}`} className="title link">
          {stripEmojis(product.name)}
        </Link>
        <span className="price current-price">
          ₹{Number(product.price).toLocaleString("en-IN")}
          {product.compare_price > product.price && (
            <span
              className="compare-at-price"
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: "#aaa",
                textDecoration: "line-through",
              }}
            >
              ₹{Number(product.compare_price).toLocaleString("en-IN")}
            </span>
          )}
        </span>
        <StarRating
          rating={Number(product.avg_rating ?? 0)}
          count={product.reviews_count ?? 0}
        />
      </div>
    </div>
  );
};

export default ProductCard;
