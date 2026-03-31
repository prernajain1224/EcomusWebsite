import React, { useState, useRef, useEffect } from 'react';
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

// Countdown Timer Component (for sale items)
const CountdownTimer = ({ timer, labels = { days: 'd :', hours: 'h :', minutes: 'm :', seconds: 's' } }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetTime = timer * 1000;
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
const ProductCard = ({ product, onQuickAdd, onAddToWishlist, onCompare, onQuickView }) => {
  const [activeColor, setActiveColor] = useState(product.colors?.[0]);

  return (
    <div className="card-product">
      <div className="card-product-wrapper">
        <a href={product.url || 'product-details'} className="product-img">
          <img 
            className="lazyload img-product" 
            data-src={product.mainImage} 
            src={product.mainImage} 
            alt={product.title}
          />
          <img 
            className="lazyload img-hover" 
            data-src={product.hoverImage} 
            src={product.hoverImage} 
            alt={product.title}
          />
        </a>
        
        {/* Action Buttons */}
        <div className={`list-product-btn ${product.hasAbsoluteButtons ? 'absolute-2' : ''}`}>
          <a 
            href="#quick_add" 
            data-bs-toggle="modal" 
            className="box-icon bg_white quick-add tf-btn-loading"
            onClick={() => onQuickAdd?.(product)}
          >
            <Icon name="bag" />
            <span className="tooltip">Quick Add</span>
          </a>
          <a 
            href="javascript:void(0);" 
            className="box-icon bg_white wishlist btn-icon-action"
            onClick={() => onAddToWishlist?.(product)}
          >
            <Icon name="heart" />
            <span className="tooltip">Add to Wishlist</span>
            <Icon name="delete" />
          </a>
          <a 
            href="#compare" 
            data-bs-toggle="offcanvas" 
            className="box-icon bg_white compare btn-icon-action"
            onClick={() => onCompare?.(product)}
          >
            <Icon name="compare" />
            <span className="tooltip">Add to Compare</span>
            <Icon name="check" />
          </a>
          <a 
            href="#quick_view" 
            data-bs-toggle="modal" 
            className="box-icon bg_white quickview tf-btn-loading"
            onClick={() => onQuickView?.(product)}
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
        <a href={product.url || 'product-details'} className="title link">
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
                onClick={() => setActiveColor(color)}
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

// Main People Also Bought Carousel Component
const YouMayProduct = ({ 
  products = [], 
  title = "You may also like",
  onQuickAdd,
  onAddToWishlist,
  onCompare,
  onQuickView,
  autoplay = false,
  autoplayDelay = 3000,
  breakpoints = {
    320: { slidesPerView: 2, spaceBetween: 15 },
    768: { slidesPerView: 3, spaceBetween: 15 },
    1024: { slidesPerView: 4, spaceBetween: 30 }
  }
}) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Default products data (fallback if none provided)
  const defaultProducts = [
    {
      id: 1,
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
    },
    {
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

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

  return (
    <section className="flat-spacing-1 pt_0">
      <div className="container">
        <div className="flat-title">
          <span className="title">{title}</span>
        </div>
        
        <div className="hover-sw-nav hover-sw-2">
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
              el: '.sw-pagination-product',
              type: 'bullets',
            }}
            autoplay={autoplay ? {
              delay: autoplayDelay,
              disableOnInteraction: false,
            } : false}
            breakpoints={breakpoints}
            onSlideChange={handleSlideChange}
            className="tf-sw-product-sell wrap-sw-over"
          >
            {displayProducts.map((product, index) => (
              <SwiperSlide key={product.id || index} lazy="true">
                <ProductCard 
                  product={product}
                  onQuickAdd={onQuickAdd}
                  onAddToWishlist={onAddToWishlist}
                  onCompare={onCompare}
                  onQuickView={onQuickView}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div 
            className={`nav-sw nav-next-slider nav-next-product box-icon w_46 round ${isBeginning ? 'disabled' : ''}`}
            onClick={handlePrev}
            style={{ opacity: isBeginning ? 0.5 : 1, cursor: isBeginning ? 'not-allowed' : 'pointer' }}
          >
            <Icon name="arrow-left" />
          </div>
          <div 
            className={`nav-sw nav-prev-slider nav-prev-product box-icon w_46 round ${isEnd ? 'disabled' : ''}`}
            onClick={handleNext}
            style={{ opacity: isEnd ? 0.5 : 1, cursor: isEnd ? 'not-allowed' : 'pointer' }}
          >
            <Icon name="arrow-right" />
          </div>
          
          {/* Pagination Dots */}
          <div className="sw-dots style-2 sw-pagination-product justify-content-center"></div>
        </div>
      </div>
    </section>
  );
};

export default YouMayProduct;