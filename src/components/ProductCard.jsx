import { Link } from "react-router-dom";
import { getImageUrl } from "../api/utils";

const FALLBACK_IMAGE = "/assets/images/product-placeholder.svg";
const ProductCard = ({ product }) => {
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
        <div className="list-product-btn absolute-2">
          <Link
            to={`/products/${product.slug}`}
            className="box-icon bg_white quickview tf-btn-loading"
          >
            <span className="icon icon-view" />
            <span className="tooltip">Quick View</span>
          </Link>
        </div>
        {/* Sale badge */}
        {onSale && (
          <div className="on-sale-wrap text-end">
            <div className="on-sale-item">-{discount}%</div>
          </div>
        )}
      </div>
      <div className="card-product-info">
        <Link to={`/products/${product.slug}`} className="title link">
          {product.name}
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
      </div>
    </div>
  );
};

export default ProductCard;
