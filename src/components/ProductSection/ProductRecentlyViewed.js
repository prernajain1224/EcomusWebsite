import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Icon Component
const Icon = ({ name, className = '' }) => {
  const icons = {
    // 'bag': '🛍️',
    // 'heart': '❤️',
    // 'delete': '✗',
    // 'compare': '⇄',
    // 'check': '✓',
    // 'view': '👁️',
    // 'arrow-left': '←',
    // 'arrow-right': '→',
  };
  return <i className={`icon icon-${name} ${className}`}>{icons[name]}</i>;
};

// Countdown Timer Component
const CountdownTimer = ({ timer, labels = { days: 'd :', hours: 'h :', minutes: 'm :', seconds: 's' } }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetTime = timer;
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="js-countdown">
      {timeLeft.days}{labels.days} 
      {timeLeft.hours}{labels.hours} 
      {timeLeft.minutes}{labels.minutes} 
      {timeLeft.seconds}{labels.seconds}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ 
  product, 
  onQuickAdd, 
  onAddToWishlist, 
  onCompare, 
  onQuickView,
  onProductClick 
}) => {
  const [activeColor, setActiveColor] = useState(product.colors?.[0]);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [isCompareActive, setIsCompareActive] = useState(false);

  const handleColorClick = (color, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveColor(color);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlistActive(!isWishlistActive);
    onAddToWishlist?.(product);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCompareActive(!isCompareActive);
    onCompare?.(product);
  };

  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd?.(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleProductClick = (e) => {
    e.preventDefault();
    onProductClick?.(product);
  };

  return (
    <div className="card-product">
      <div className="card-product-wrapper">
        <a 
          href={product.url || 'product-details'} 
          className="product-img"
          onClick={handleProductClick}
        >
          <img 
            className="lazyload img-product" 
            data-src={product.mainImage} 
            src={product.mainImage} 
            alt={product.title}
          />
          {product.hoverImage && (
            <img 
              className="lazyload img-hover" 
              data-src={product.hoverImage} 
              src={product.hoverImage} 
              alt={product.title}
            />
          )}
        </a>
        
        {/* Action Buttons */}
        <div className={`list-product-btn ${product.hasAbsoluteButtons ? 'absolute-2' : ''}`}>
          <a 
            href="#quick_add" 
            data-bs-toggle="modal" 
            className="box-icon bg_white quick-add tf-btn-loading"
            onClick={handleQuickAddClick}
          >
            <Icon name="bag" />
            <span className="tooltip">Quick Add</span>
          </a>
          <a 
            href="javascript:void(0);" 
            className={`box-icon bg_white wishlist btn-icon-action ${isWishlistActive ? 'active' : ''}`}
            onClick={handleWishlistClick}
          >
            <Icon name="heart" />
            <span className="tooltip">Add to Wishlist</span>
            <Icon name="delete" />
          </a>
          <a 
            href="#compare" 
            data-bs-toggle="offcanvas" 
            className={`box-icon bg_white compare btn-icon-action ${isCompareActive ? 'active' : ''}`}
            onClick={handleCompareClick}
          >
            <Icon name="compare" />
            <span className="tooltip">Add to Compare</span>
            <Icon name="check" />
          </a>
          <a 
            href="#quick_view" 
            data-bs-toggle="modal" 
            className="box-icon bg_white quickview tf-btn-loading"
            onClick={handleQuickViewClick}
          >
            <Icon name="view" />
            <span className="tooltip">Quick View</span>
          </a>
        </div>

        {/* Size List */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="size-list">
            {product.sizes.map(size => (
              <span key={size}>{size}</span>
            ))}
          </div>
        )}

        {/* Sale Badge */}
        {product.salePercent && (
          <div className="on-sale-wrap">
            <div className="on-sale-item">-{product.salePercent}%</div>
          </div>
        )}

        {/* Countdown Timer */}
        {product.countdown && (
          <div className="countdown-box">
            <CountdownTimer timer={product.countdown} />
          </div>
        )}
      </div>

      <div className="card-product-info">
        <a 
          href={product.url || 'product-details'} 
          className="title link"
          onClick={handleProductClick}
        >
          {product.title}
        </a>
        <span className="price">
          {product.priceRange ? `From ${product.price}` : `$${product.price}`}
        </span>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <ul className="list-color-product">
            {product.colors.map(color => (
              <li 
                key={color.name}
                className={`list-color-item color-swatch ${activeColor?.name === color.name ? 'active' : ''}`}
                onClick={(e) => handleColorClick(color, e)}
              >
                <span className="tooltip">{color.name}</span>
                <span className={`swatch-value ${color.bgClass}`}></span>
                <img 
                  className="lazyload" 
                  data-src={color.image} 
                  src={color.image} 
                  alt={color.name}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Recently Viewed Hook
const useRecentlyViewed = (maxItems = 20) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const STORAGE_KEY = 'recently_viewed_products';

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      } catch (error) {
        console.error('Failed to parse recently viewed:', error);
      }
    }
  }, []);

  // Add product to recently viewed
  const addToRecentlyViewed = useCallback((product) => {
    if (!product || !product.id) return;

    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p.id !== product.id);
      // Add to beginning
      const updated = [product, ...filtered];
      // Limit to maxItems
      const limited = updated.slice(0, maxItems);
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      return limited;
    });
  }, [maxItems]);

  // Remove product from recently viewed
  const removeFromRecentlyViewed = useCallback((productId) => {
    setRecentlyViewed(prev => {
      const updated = prev.filter(p => p.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear all recently viewed
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed
  };
};

// Default products data
const defaultProducts = [
  {
    id: 1,
    title: "Loose Fit Sweatshirt",
    price: "10.00",
    priceRange: false,
    mainImage: "/assets/images/products/light-green-1.jpg",
    hoverImage: "/assets/images/products/light-green-2.jpg",
    url: "product-details",
    hasAbsoluteButtons: true,
    colors: [
      { name: "Light Green", bgClass: "bg_light-green", image: "/assets/images/products/light-green-1.jpg" },
      { name: "Black", bgClass: "bg_dark", image: "/assets/images/products/black-3.jpg" },
      { name: "Blue", bgClass: "bg_blue-2", image: "/assets/images/products/blue.jpg" },
      { name: "Dark Blue", bgClass: "bg_dark-blue", image: "/assets/images/products/dark-blue.jpg" },
      { name: "White", bgClass: "bg_white", image: "/assets/images/products/white-6.jpg" },
      { name: "Light Grey", bgClass: "bg_light-grey", image: "/assets/images/products/light-grey.jpg" }
    ]
  },
  {
    id: 2,
    title: "V-neck linen T-shirt",
    price: "114.95",
    priceRange: false,
    mainImage: "/assets/images/products/brown-2.jpg",
    hoverImage: "/assets/images/products/brown-3.jpg",
    url: "product-details",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Brown", bgClass: "bg_brown", image: "/assets/images/products/brown-2.jpg" },
      { name: "White", bgClass: "bg_white", image: "/assets/images/products/white-5.jpg" }
    ]
  },
  {
    id: 3,
    title: "Oversized Printed T-shirt",
    price: "16.95",
    priceRange: false,
    mainImage: "/assets/images/products/white-2.jpg",
    hoverImage: "/assets/images/products/pink-1.jpg",
    url: "product-details",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "White", bgClass: "bg_white", image: "/assets/images/products/white-2.jpg" },
      { name: "Pink", bgClass: "bg_purple", image: "/assets/images/products/pink-1.jpg" },
      { name: "Black", bgClass: "bg_dark", image: "/assets/images/products/black-2.jpg" }
    ]
  },
  {
    id: 4,
    title: "Oversized Printed T-shirt",
    price: "10.00",
    priceRange: false,
    mainImage: "/assets/images/products/white-3.jpg",
    hoverImage: "/assets/images/products/white-4.jpg",
    url: "product-details",
    sizes: ["S", "M", "L", "XL"],
    colors: []
  },
  {
    id: 5,
    title: "Ribbed modal T-shirt",
    price: "18.95",
    priceRange: true,
    mainImage: "/assets/images/products/brown.jpg",
    hoverImage: "/assets/images/products/purple.jpg",
    url: "product-details",
    sizes: ["M", "L", "XL"],
    salePercent: 33,
    countdown: Date.now() + 1007500 * 1000,
    colors: [
      { name: "Brown", bgClass: "bg_brown", image: "/assets/images/products/brown.jpg" },
      { name: "Light Purple", bgClass: "bg_purple", image: "/assets/images/products/purple.jpg" },
      { name: "Light Green", bgClass: "bg_light-green", image: "/assets/images/products/green.jpg" }
    ]
  },
  {
    id: 6,
    title: "Ribbed Tank Top",
    price: "16.95",
    priceRange: false,
    mainImage: "/assets/images/products/orange-1.jpg",
    hoverImage: "/assets/images/products/white-1.jpg",
    url: "product-details",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Orange", bgClass: "bg_orange-3", image: "/assets/images/products/orange-1.jpg" },
      { name: "Black", bgClass: "bg_dark", image: "/assets/images/products/black-1.jpg" },
      { name: "White", bgClass: "bg_white", image: "/assets/images/products/white-1.jpg" }
    ]
  }
];

// Main Recently Viewed Component
const ProductRecentlyViewed = ({ 
  products = null,
  title = "Recently Viewed",
  maxItems = 20,
  showClearButton = true,
  onQuickAdd,
  onAddToWishlist,
  onCompare,
  onQuickView,
  onProductClick,
  autoplay = false,
  autoplayDelay = 3000,
  showEmptyState = true,
  emptyStateMessage = "No recently viewed products yet. Start browsing to see products here!",
  emptyStateImage = null,
  breakpoints = {
    320: { slidesPerView: 2, spaceBetween: 15 },
    768: { slidesPerView: 3, spaceBetween: 30 },
    1024: { slidesPerView: 4, spaceBetween: 30 }
  }
}) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed(maxItems);

  // Use provided products or recently viewed from localStorage, fallback to default products if none
  const displayProducts = products || (recentlyViewed.length > 0 ? recentlyViewed : defaultProducts);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your recently viewed history?')) {
      clearRecentlyViewed();
    }
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="recently-viewed-empty-state" style={{
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      marginTop: '20px'
    }}>
      {emptyStateImage ? (
        <img src={emptyStateImage} alt="No products" style={{ width: '80px', marginBottom: '16px', opacity: 0.5 }} />
      ) : (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '16px', opacity: 0.5 }}>
          <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )}
      <p style={{ color: '#666', marginBottom: '8px' }}>{emptyStateMessage}</p>
      <a href="/shop" className="tf-btn btn-outline-dark" style={{ marginTop: '16px', display: 'inline-block', padding: '10px 24px' }}>
        Start Shopping
      </a>
    </div>
  );

  // Don't render if no products and empty state is disabled
  if (displayProducts.length === 0 && !showEmptyState) {
    return null;
  }

  return (
    <section className="flat-spacing-4 pt_0">
      <div className="container">
        <div className="flat-title" style={{ position: 'relative', marginBottom: '30px' }}>
          <span className="title">{title}</span>
          {showClearButton && recentlyViewed.length > 0 && !products && (
            <button 
              onClick={handleClearAll}
              className="clear-recently-viewed"
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '14px',
                color: '#666',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="hover-sw-nav hover-sw-2" style={{ position: 'relative' }}>
          {displayProducts.length > 0 ? (
            <>
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={4}
                navigation={false}
                pagination={{
                  clickable: true,
                  el: '.sw-pagination-recent',
                  type: 'bullets',
                }}
                autoplay={autoplay ? {
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                } : false}
                breakpoints={breakpoints}
                onSlideChange={handleSlideChange}
                className="tf-sw-recent wrap-sw-over"
              >
                {displayProducts.map((product, index) => (
                  <SwiperSlide key={product.id || index} lazy="true">
                    <ProductCard 
                      product={product}
                      onQuickAdd={onQuickAdd}
                      onAddToWishlist={onAddToWishlist}
                      onCompare={onCompare}
                      onQuickView={onQuickView}
                      onProductClick={onProductClick}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              {displayProducts.length > (breakpoints[1024]?.slidesPerView || 4) && (
                <>
                  <div 
                    className={`nav-sw nav-next-slider nav-next-recent box-icon w_46 round ${isBeginning ? 'disabled' : ''}`}
                    onClick={handlePrev}
                    style={{ 
                      opacity: isBeginning ? 0.5 : 1, 
                      cursor: isBeginning ? 'not-allowed' : 'pointer',
                      position: 'absolute',
                      left: '-20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Icon name="arrow-left" />
                  </div>
                  <div 
                    className={`nav-sw nav-prev-slider nav-prev-recent box-icon w_46 round ${isEnd ? 'disabled' : ''}`}
                    onClick={handleNext}
                    style={{ 
                      opacity: isEnd ? 0.5 : 1, 
                      cursor: isEnd ? 'not-allowed' : 'pointer',
                      position: 'absolute',
                      right: '-20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Icon name="arrow-right" />
                  </div>
                </>
              )}
              
              {/* Pagination Dots */}
              <div className="sw-dots style-2 sw-pagination-recent justify-content-center" style={{ marginTop: '30px' }}></div>
            </>
          ) : showEmptyState && (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
};

export { useRecentlyViewed, ProductCard };
export default ProductRecentlyViewed;