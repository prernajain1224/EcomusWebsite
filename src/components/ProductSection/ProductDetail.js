import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

// Import your icon components or use placeholder
const Icon = ({ name, className = '' }) => {
  const icons = {
    // 'lightning': '⚡',
    // 'time': '⏰',
    // 'delivery-time': '🚚',
    // 'return-order': '↩️',
    // 'safe': '🔒',
    // 'question': '?',
    // 'share': '📤',
    // 'star': '★',
    // 'arrow-down': '▼',
    // 'arrow-up': '▲',
    // 'arrow-left': '←',
    // 'arrow-right': '→',
    // 'heart': '♥',
    // 'compare': '⇄',
    // 'check': '✓',
    // 'delete': '✗',
    // 'machine': '🧺',
    // 'iron': '👕',
    // 'bleach': '🧴',
    // 'dry-clean': '🧼',
    // 'tumble-dry': '🌀',
  };
  return <i className={`icon icon-${name} ${className}`}>{icons[name]}</i>;
};

// Countdown Timer Component
const CountdownTimer = ({ timer, labels = { days: 'Days :', hours: 'Hours :', minutes: 'Mins :', seconds: 'Secs' } }) => {
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
    <div className="tf-countdown style-1">
      <span>{timeLeft.days}{labels.days} </span>
      <span>{timeLeft.hours}{labels.hours} </span>
      <span>{timeLeft.minutes}{labels.minutes} </span>
      <span>{timeLeft.seconds}{labels.seconds}</span>
    </div>
  );
};

// Product Gallery Component
const ProductGallery = ({ images, selectedColor, onColorChange }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    // Filter images by selected color
    const filtered = images.filter(img => img.color === selectedColor);
    setFilteredImages(filtered);
    // Reset swiper to first slide when color changes
    if (mainSwiper) mainSwiper.slideTo(0);
  }, [selectedColor, images, mainSwiper]);

  const allThumbImages = images.map((img, idx) => ({
    ...img,
    isVisible: img.color === selectedColor
  }));

  return (
    <div className="tf-product-media-wrap sticky-top">
      <div className="thumbs-slider">
        <Swiper
          onSwiper={setThumbsSwiper}
          direction="vertical"
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="tf-product-media-thumbs other-image-zoom"
          style={{ height: '400px' }}
        >
          {allThumbImages.map((img, index) => (
            <SwiperSlide key={index} data-color={img.color}>
              <div className="item">
                <img 
                  className="lazyload" 
                  data-src={img.src} 
                  src={img.src} 
                  alt={`product-thumb-${index}`}
                  style={{ opacity: img.color === selectedColor ? 1 : 0.5 }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <Swiper
          onSwiper={setMainSwiper}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Navigation, Thumbs]}
          className="tf-product-media-main"
          id="gallery-swiper-started"
        >
          {filteredImages.map((img, index) => (
            <SwiperSlide key={index} data-color={img.color}>
              <a 
                href={img.src} 
                target="_blank" 
                className="item" 
                data-pswp-width="770px" 
                data-pswp-height="1075px"
              >
                <img 
                  className="tf-image-zoom lazyload" 
                  data-zoom={img.src} 
                  data-src={img.src} 
                  src={img.src} 
                  alt="product-main"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

// Product Info Component
const ProductInfo = ({ product, onAddToCart, onVariantChange }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const colors = [
    { id: 'beige', name: 'Beige', bgClass: 'bg-color-beige', price: 8 },
    { id: 'black', name: 'Black', bgClass: 'bg-color-black', price: 9 },
    { id: 'blue', name: 'Blue', bgClass: 'bg-color-blue', price: 10 },
    { id: 'white', name: 'White', bgClass: 'bg-color-white', price: 12 }
  ];

  const sizes = ['S', 'M', 'L', 'XL'];

  const getCurrentPrice = () => {
    const color = colors.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());
    return color ? color.price : product.price;
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.name);
    onVariantChange?.({ color: color.name, size: selectedSize });
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    onVariantChange?.({ color: selectedColor, size });
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart?.({
      ...product,
      selectedColor,
      selectedSize,
      quantity,
      price: getCurrentPrice()
    });
  };

  const totalPrice = (getCurrentPrice() * quantity).toFixed(2);

  return (
    <div className="tf-product-info-wrap position-relative">
      <div className="tf-zoom-main"></div>
      <div className="tf-product-info-list other-image-zoom">
        {/* Title */}
        <div className="tf-product-info-title">
          <h5>{product.title}</h5>
        </div>

        {/* Badges */}
        <div className="tf-product-info-badges">
          {product.isBestSeller && <div className="badges">Best seller</div>}
          <div className="product-status-content">
            <Icon name="lightning" />
            <p className="fw-6">Selling fast! 56 people have this in their carts.</p>
          </div>
        </div>

        {/* Price */}
        <div className="tf-product-info-price">
          <div className="price-on-sale">${getCurrentPrice().toFixed(2)}</div>
          {product.comparePrice && (
            <div className="compare-at-price">${product.comparePrice.toFixed(2)}</div>
          )}
          {product.discountPercent && (
            <div className="badges-on-sale"><span>{product.discountPercent}</span>% OFF</div>
          )}
        </div>

        {/* Live View */}
        <div className="tf-product-info-liveview">
          <div className="liveview-count">{product.liveViewCount || 20}</div>
          <p className="fw-6">People are viewing this right now</p>
        </div>

        {/* Countdown */}
        {product.countdown && (
          <div className="tf-product-info-countdown">
            <div className="countdown-wrap">
              <div className="countdown-title">
                <Icon name="time" className="tf-ani-tada" />
                <p>HURRY UP! SALE ENDS IN:</p>
              </div>
              <CountdownTimer timer={product.countdown} />
            </div>
          </div>
        )}

        {/* Variant Picker - Color */}
        <div className="tf-product-info-variant-picker">
          <div className="variant-picker-item">
            <div className="variant-picker-label">
              Color: <span className="fw-6 variant-picker-label-value">{selectedColor}</span>
            </div>
            <div className="variant-picker-values">
              {colors.map(color => (
                <React.Fragment key={color.id}>
                  <input 
                    type="radio" 
                    id={`values-${color.id}`} 
                    name="color1" 
                    checked={selectedColor.toLowerCase() === color.name.toLowerCase()}
                    onChange={() => handleColorChange(color)}
                  />
                  <label 
                    className="hover-tooltip radius-60 color-btn" 
                    htmlFor={`values-${color.id}`}
                    data-color={color.id}
                    data-value={color.name}
                  >
                    <span className={`btn-checkbox ${color.bgClass}`}></span>
                    <span className="tooltip">{color.name}</span>
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Variant Picker - Size */}
          <div className="variant-picker-item">
            <div className="d-flex justify-content-between align-items-center">
              <div className="variant-picker-label">
                Size: <span className="fw-6 variant-picker-label-value">{selectedSize}</span>
              </div>
              <a href="#find_size" data-bs-toggle="modal" className="find-size fw-6">Find your size</a>
            </div>
            <div className="variant-picker-values">
              {sizes.map(size => (
                <React.Fragment key={size}>
                  <input 
                    type="radio" 
                    name="size1" 
                    id={`values-${size.toLowerCase()}`}
                    checked={selectedSize === size}
                    onChange={() => handleSizeChange(size)}
                  />
                  <label 
                    className="style-text size-btn" 
                    htmlFor={`values-${size.toLowerCase()}`}
                    data-value={size}
                  >
                    <p>{size}</p>
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="tf-product-info-quantity">
          <div className="quantity-title fw-6">Quantity</div>
          <div className="wg-quantity">
            <span className="btn-quantity btn-decrease" onClick={() => handleQuantityChange('decrease')}>-</span>
            <input type="text" className="quantity-product" name="number" value={quantity} readOnly />
            <span className="btn-quantity btn-increase" onClick={() => handleQuantityChange('increase')}>+</span>
          </div>
        </div>

        {/* Buy Buttons */}
        <div className="tf-product-info-buy-button">
          <form className="">
            <a 
              href="javascript:void(0);" 
              className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn btn-add-to-cart"
              onClick={handleAddToCart}
            >
              <span>Add to cart -&nbsp;</span>
              <span className="tf-qty-price total-price">${totalPrice}</span>
            </a>
            <a href="javascript:void(0);" className="tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action">
              <span className="icon icon-heart"></span>
              <span className="tooltip">Add to Wishlist</span>
              <span className="icon icon-delete"><Icon name="delete" /></span>
            </a>
            <a href="#compare" data-bs-toggle="offcanvas" className="tf-product-btn-wishlist hover-tooltip box-icon bg_white compare btn-icon-action">
              <span className="icon icon-compare"></span>
              <span className="tooltip">Add to Compare</span>
              <span className="icon icon-check"><Icon name="check" /></span>
            </a>
            <div className="w-100">
              <a href="#" className="btns-full">Buy with <img src="/assets/images/payments/paypal.png" alt="PayPal" /></a>
              <a href="#" className="payment-more-option">More payment options</a>
            </div>
          </form>
        </div>

        {/* Extra Links */}
        <div className="tf-product-info-extra-link">
          <a href="#compare_color" data-bs-toggle="modal" className="tf-product-extra-icon">
            <div className="icon">
              <img src="/assets/images/item/compare.svg" alt="compare" />
            </div>
            <div className="text fw-6">Compare color</div>
          </a>
          <a href="#ask_question" data-bs-toggle="modal" className="tf-product-extra-icon">
            <div className="icon">
              <Icon name="question" />
            </div>
            <div className="text fw-6">Ask a question</div>
          </a>
          <a href="#delivery_return" data-bs-toggle="modal" className="tf-product-extra-icon">
            <div className="icon">
              <svg className="d-inline-block" xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="currentColor">
                <path d="M21.7872 10.4724C21.7872 9.73685 21.5432 9.00864 21.1002 8.4217L18.7221 5.27043C18.2421 4.63481 17.4804 4.25532 16.684 4.25532H14.9787V2.54885C14.9787 1.14111 13.8334 0 12.4255 0H9.95745V1.69779H12.4255C12.8948 1.69779 13.2766 2.07962 13.2766 2.54885V14.5957H8.15145C7.80021 13.6052 6.85421 12.8936 5.74468 12.8936C4.63515 12.8936 3.68915 13.6052 3.33792 14.5957H2.55319C2.08396 14.5957 1.70213 14.2139 1.70213 13.7447V2.54885C1.70213 2.07962 2.08396 1.69779 2.55319 1.69779H9.95745V0H2.55319C1.14528 0 0 1.14111 0 2.54885V13.7447C0 15.1526 1.14528 16.2979 2.55319 16.2979H3.33792C3.68915 17.2884 4.63515 18 5.74468 18C6.85421 18 7.80021 17.2884 8.15145 16.2979H13.423C13.7742 17.2884 14.7202 18 15.8297 18C16.9393 18 17.8853 17.2884 18.2365 16.2979H21.7872V10.4724ZM16.684 5.95745C16.9494 5.95745 17.2034 6.08396 17.3634 6.29574L19.5166 9.14894H14.9787V5.95745H16.684ZM5.74468 16.2979C5.27545 16.2979 4.89362 15.916 4.89362 15.4468C4.89362 14.9776 5.27545 14.5957 5.74468 14.5957C6.21392 14.5957 6.59575 14.9776 6.59575 15.4468C6.59575 15.916 6.21392 16.2979 5.74468 16.2979ZM15.8298 16.2979C15.3606 16.2979 14.9787 15.916 14.9787 15.4468C14.9787 14.9776 15.3606 14.5957 15.8298 14.5957C16.299 14.5957 16.6809 14.9776 16.6809 15.4468C16.6809 15.916 16.299 16.2979 15.8298 16.2979ZM18.2366 14.5957C17.8853 13.6052 16.9393 12.8936 15.8298 12.8936C15.5398 12.8935 15.252 12.943 14.9787 13.04V10.8511H20.0851V14.5957H18.2366Z" />
              </svg>
            </div>
            <div className="text fw-6">Delivery & Return</div>
          </a>
          <a href="#share_social" data-bs-toggle="modal" className="tf-product-extra-icon">
            <div className="icon">
              <Icon name="share" />
            </div>
            <div className="text fw-6">Share</div>
          </a>
        </div>

        {/* Delivery & Return Info */}
        <div className="tf-product-info-delivery-return">
          <div className="row">
            <div className="col-xl-6 col-12">
              <div className="tf-product-delivery">
                <div className="icon">
                  <Icon name="delivery-time" />
                </div>
                <p>Estimate delivery times: <span className="fw-7">12-26 days</span> (International), <span className="fw-7">3-6 days</span> (United States).</p>
              </div>
            </div>
            <div className="col-xl-6 col-12">
              <div className="tf-product-delivery mb-0">
                <div className="icon">
                  <Icon name="return-order" />
                </div>
                <p>Return within <span className="fw-7">30 days</span> of purchase. Duties & taxes are non-refundable.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Seal */}
        <div className="tf-product-info-trust-seal">
          <div className="tf-product-trust-mess">
            <Icon name="safe" />
            <p className="fw-6">Guarantee Safe <br /> Checkout</p>
          </div>
          <div className="tf-payment">
            <img src="/assets/images/payments/visa.png" alt="Visa" />
            <img src="/assets/images/payments/img-1.png" alt="Payment" />
            <img src="/assets/images/payments/img-2.png" alt="Payment" />
            <img src="/assets/images/payments/img-3.png" alt="Payment" />
            <img src="/assets/images/payments/img-4.png" alt="Payment" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Tabs Component
const Tabs = ({ product, reviews }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [reviewSort, setReviewSort] = useState('most-recent');
  const [showWriteReview, setShowWriteReview] = useState(false);

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'additional', label: 'Additional Information' },
    { id: 'review', label: 'Review' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'return', label: 'Return Policies' }
  ];

  return (
    <div className="widget-tabs style-has-border">
      <ul className="widget-menu-tab">
        {tabs.map(tab => (
          <li 
            key={tab.id} 
            className={`item-title ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="inner">{tab.label}</span>
          </li>
        ))}
      </ul>

      <div className="widget-content-tab">
        {/* Description Tab */}
        <div className={`widget-content-inner ${activeTab === 'description' ? 'active' : ''}`}>
          <div className="">
            <p className="mb_30">
              Button-up shirt sleeves and a relaxed silhouette. It's tailored with drapey,
              crinkle-texture fabric that's made from LENZING™ ECOVERO™ Viscose — responsibly
              sourced wood-based fibres produced through a process that reduces impact on forests, 
              biodiversity and water supply.
            </p>
            <div className="tf-product-des-demo">
              <div className="right">
                <h3 className="fs-16 fw-5">Features</h3>
                <ul>
                  <li>Front button placket</li>
                  <li>Adjustable sleeve tabs</li>
                  <li>Babaton embroidered crest at placket and hem</li>
                </ul>
                <h3 className="fs-16 fw-5">Materials Care</h3>
                <ul className="mb-0">
                  <li>Content: 100% LENZING™ ECOVERO™ Viscose</li>
                  <li>Care: Hand wash</li>
                  <li>Imported</li>
                </ul>
              </div>
              <div className="left">
                <h3 className="fs-16 fw-5">Materials Care</h3>
                <div className="d-flex gap-10 mb_15 align-items-center">
                  <div className="icon"><Icon name="machine" /></div>
                  <span>Machine wash max. 30ºC. Short spin.</span>
                </div>
                <div className="d-flex gap-10 mb_15 align-items-center">
                  <div className="icon"><Icon name="iron" /></div>
                  <span>Iron maximum 110ºC.</span>
                </div>
                <div className="d-flex gap-10 mb_15 align-items-center">
                  <div className="icon"><Icon name="bleach" /></div>
                  <span>Do not bleach/bleach.</span>
                </div>
                <div className="d-flex gap-10 mb_15 align-items-center">
                  <div className="icon"><Icon name="dry-clean" /></div>
                  <span>Do not dry clean.</span>
                </div>
                <div className="d-flex gap-10 align-items-center">
                  <div className="icon"><Icon name="tumble-dry" /></div>
                  <span>Tumble dry, medium hear.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Tab */}
        <div className={`widget-content-inner ${activeTab === 'additional' ? 'active' : ''}`}>
          <table className="tf-pr-attrs">
            <tbody>
              <tr className="tf-attr-pa-color">
                <th className="tf-attr-label">Color</th>
                <td className="tf-attr-value"><p>White, Pink, Black</p></td>
              </tr>
              <tr className="tf-attr-pa-size">
                <th className="tf-attr-label">Size</th>
                <td className="tf-attr-value"><p>S, M, L, XL</p></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Review Tab */}
        <div className={`widget-content-inner ${activeTab === 'review' ? 'active' : ''}`}>
          <div className="tab-reviews write-cancel-review-wrap">
            <div className="tab-reviews-heading">
              <div className="top">
                <div className="text-center">
                  <h1 className="number fw-6">4.8</h1>
                  <div className="list-star">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} name="star" />
                    ))}
                  </div>
                  <p>(168 Ratings)</p>
                </div>
                <div className="rating-score">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="item">
                      <div className="number-1 text-caption-1">{star}</div>
                      <Icon name="star" />
                      <div className="line-bg">
                        <div style={{ width: star === 5 ? '94.67%' : star === 4 ? '60%' : '0%' }}></div>
                      </div>
                      <div className="number-2 text-caption-1">{star === 5 ? 59 : star === 4 ? 46 : 0}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div 
                  className="tf-btn btn-outline-dark fw-6 btn-comment-review btn-cancel-review"
                  onClick={() => setShowWriteReview(false)}
                  style={{ display: showWriteReview ? 'inline-block' : 'none' }}
                >
                  Cancel Review
                </div>
                <div 
                  className="tf-btn btn-outline-dark fw-6 btn-comment-review btn-write-review"
                  onClick={() => setShowWriteReview(true)}
                  style={{ display: showWriteReview ? 'none' : 'inline-block' }}
                >
                  Write a review
                </div>
              </div>
            </div>

            {/* Comments Section */}
            {!showWriteReview && (
              <div className="reply-comment cancel-review-wrap">
                <div className="d-flex mb_24 gap-20 align-items-center justify-content-between flex-wrap">
                  <h5 className="">03 Comments</h5>
                  <div className="d-flex align-items-center gap-12">
                    <div className="text-caption-1">Sort by:</div>
                    <div className="tf-dropdown-sort">
                      <div className="btn-select">
                        <span className="text-sort-value">
                          {reviewSort === 'most-recent' && 'Most Recent'}
                          {reviewSort === 'oldest' && 'Oldest'}
                          {reviewSort === 'most-popular' && 'Most Popular'}
                        </span>
                        <Icon name="arrow-down" />
                      </div>
                      <div className="dropdown-menu">
                        {['most-recent', 'oldest', 'most-popular'].map(option => (
                          <div 
                            key={option} 
                            className={`select-item ${reviewSort === option ? 'active' : ''}`}
                            onClick={() => setReviewSort(option)}
                          >
                            <span className="text-value-item">
                              {option === 'most-recent' && 'Most Recent'}
                              {option === 'oldest' && 'Oldest'}
                              {option === 'most-popular' && 'Most Popular'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="reply-comment-wrap">
                  <div className="reply-comment-item">
                    <div className="user">
                      <div className="image">
                        <img src="/assets/images/collections/collection-circle-9.jpg" alt="user" />
                      </div>
                      <div>
                        <h6><a href="#" className="link">Superb quality apparel that exceeds expectations</a></h6>
                        <div className="day text_black-2">1 days ago</div>
                      </div>
                    </div>
                    <p className="text_black-2">Great theme - we were looking for a theme with lots of built in features and flexibility and this was perfect...</p>
                  </div>
                  <div className="reply-comment-item type-reply">
                    <div className="user">
                      <div className="image">
                        <img src="/assets/images/collections/collection-circle-10.jpg" alt="admin" />
                      </div>
                      <div>
                        <h6><a href="#" className="link">Reply from Modave</a></h6>
                        <div className="day text_black-2">1 days ago</div>
                      </div>
                    </div>
                    <p className="text_black-2">We love to hear it! Part of what we love most about Modave is how much it empowers store owners...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Write Review Form */}
            {showWriteReview && (
              <form className="form-write-review write-review-wrap">
                <div className="heading">
                  <h5>Write a review:</h5>
                  <div className="list-rating-check">
                    {[5, 4, 3, 2, 1].map(star => (
                      <React.Fragment key={star}>
                        <input type="radio" id={`star${star}`} name="rate" value={star} />
                        <label htmlFor={`star${star}`} title="text"></label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="form-content">
                  <fieldset className="box-field">
                    <label className="label">Review Title</label>
                    <input type="text" placeholder="Give your review a title" required />
                  </fieldset>
                  <fieldset className="box-field">
                    <label className="label">Review</label>
                    <textarea rows="4" placeholder="Write your comment here" required></textarea>
                  </fieldset>
                  <div className="box-field group-2">
                    <fieldset>
                      <input type="text" placeholder="Your Name (Public)" required />
                    </fieldset>
                    <fieldset>
                      <input type="email" placeholder="Your email (private)" required />
                    </fieldset>
                  </div>
                  <div className="box-check">
                    <input type="checkbox" name="availability" className="tf-check" id="check1" />
                    <label className="text_black-2" htmlFor="check1">
                      Save my name, email, and website in this browser for the next time I comment.
                    </label>
                  </div>
                </div>
                <div className="button-submit">
                  <button className="tf-btn btn-fill animate-hover-btn" type="submit">Submit Reviews</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Shipping Tab */}
        <div className={`widget-content-inner ${activeTab === 'shipping' ? 'active' : ''}`}>
          <div className="tf-page-privacy-policy">
            <div className="title">Shipping Policy</div>
            <p>We offer worldwide shipping. Orders are processed within 1-2 business days. Shipping times vary by location.</p>
            <p>International shipping typically takes 12-26 days. Domestic shipping within the US takes 3-6 days.</p>
            <p>Free shipping on all orders over $50.</p>
          </div>
        </div>

        {/* Return Policies Tab */}
        <div className={`widget-content-inner ${activeTab === 'return' ? 'active' : ''}`}>
          <div className="tf-page-privacy-policy">
            <div className="title">Return Policy</div>
            <p>You have 30 days from the date of purchase to return your item for a full refund.</p>
            <p>Items must be unworn, unwashed, and with all original tags attached.</p>
            <p>Duties and taxes are non-refundable for international orders.</p>
            <p>To initiate a return, please contact our customer service at returns@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sticky Add to Cart Bar Component
const StickyAddToCart = ({ product, onAddToCart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const observerRef = useRef(null);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, []);

  const variants = [
    'Beige / S - $8.00', 'Beige / M - $8.00', 'Beige / L - $8.00', 'Beige / XL - $8.00',
    'Black / S - $8.00', 'Black / M - $8.00', 'Black / L - $8.00', 'Black / XL - $8.00',
    'Blue / S - $8.00', 'Blue / M - $8.00', 'Blue / L - $8.00', 'Blue / XL - $8.00',
    'White / S - $8.00', 'White / M - $8.00', 'White / L - $8.00', 'White / XL - $8.00'
  ];

  const handleAddToCart = () => {
    onAddToCart?.({
      ...product,
      variant: selectedVariant,
      quantity
    });
  };

  return (
    <>
      <div ref={targetRef} style={{ position: 'absolute', top: 0, height: 1 }} />
      {isVisible && (
        <div className="tf-sticky-btn-atc">
          <div className="container">
            <div className="tf-height-observer w-100 d-flex align-items-center">
              <div className="tf-sticky-atc-product d-flex align-items-center">
                <div className="tf-sticky-atc-img">
                  <img data-src={product.mainImage} alt={product.title} src={product.mainImage} />
                </div>
                <div className="tf-sticky-atc-title fw-5 d-xl-block d-none">{product.title}</div>
              </div>
              <div className="tf-sticky-atc-infos">
                <form>
                  <div className="tf-sticky-atc-variant-price text-center">
                    <select 
                      className="tf-select" 
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                    >
                      <option value="">Select variant</option>
                      {variants.map(variant => (
                        <option key={variant} value={variant}>{variant}</option>
                      ))}
                    </select>
                  </div>
                  <div className="tf-sticky-atc-btns">
                    <div className="tf-product-info-quantity">
                      <div className="wg-quantity">
                        <span 
                          className="btn-quantity minus-btn" 
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        >
                          -
                        </span>
                        <input type="text" name="number" value={quantity} readOnly />
                        <span 
                          className="btn-quantity plus-btn" 
                          onClick={() => setQuantity(prev => prev + 1)}
                        >
                          +
                        </span>
                      </div>
                    </div>
                    <a 
                      href="javascript:void(0);" 
                      className="tf-btn btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn btn-add-to-cart"
                      onClick={handleAddToCart}
                    >
                      <span>Add to cart</span>
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main Product Detail Page Component
const ProductDetailPage = ({ productData }) => {
  // Sample product data structure
  const defaultProduct = {
    id: 1,
    title: 'Cotton jersey top',
    price: 8.00,
    comparePrice: 30.00,
    discountPercent: 20,
    isBestSeller: true,
    liveViewCount: 20,
    countdown: Date.now() + 1007500 * 1000, // example timer
    colors: ['Beige', 'Black', 'Blue', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    mainImage: '/assets/images/shop/products/p-d1.png',
    images: [
      // Beige images
      { color: 'Beige', src: '/assets/images/shop/products/hmgoepprod31.jpg' },
      { color: 'Beige', src: '/assets/images/shop/products/hmgoepprod.jpg' },
      { color: 'Beige', src: '/assets/images/shop/products/hmgoepprod2.jpg' },
      { color: 'Beige', src: '/assets/images/shop/products/hmgoepprod3.jpg' },
      { color: 'Beige', src: '/assets/images/shop/products/hmgoepprod4.jpg' },
      { color: 'Beige', src: '/assets/images/shop/products/hmgoepprod5.jpg' },
      // Black images
      { color: 'Black', src: '/assets/images/shop/products/hmgoepprod6.jpg' },
      { color: 'Black', src: '/assets/images/shop/products/hmgoepprod7.jpg' },
      { color: 'Black', src: '/assets/images/shop/products/hmgoepprod8.jpg' },
      { color: 'Black', src: '/assets/images/shop/products/hmgoepprod9.jpg' },
      // Blue images
      { color: 'Blue', src: '/assets/images/shop/products/hmgoepprod10.jpg' },
      { color: 'Blue', src: '/assets/images/shop/products/hmgoepprod11.jpg' },
      { color: 'Blue', src: '/assets/images/shop/products/hmgoepprod12.jpg' },
      { color: 'Blue', src: '/assets/images/shop/products/hmgoepprod13.jpg' },
      // White images
      { color: 'White', src: '/assets/images/shop/products/hmgoepprod14.jpg' },
      { color: 'White', src: '/assets/images/shop/products/hmgoepprod15.jpg' },
      { color: 'White', src: '/assets/images/shop/products/hmgoepprod16.jpg' },
      { color: 'White', src: '/assets/images/shop/products/hmgoepprod17.jpg' }
    ]
  };

  const product = productData || defaultProduct;
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const handleAddToCart = (cartItem) => {
    console.log('Added to cart:', cartItem);
    // Implement your add to cart logic here
    // e.g., dispatch to Redux, call API, show notification
  };

  const handleVariantChange = (variant) => {
    setSelectedColor(variant.color);
  };

  return (
    <>
      <section className="flat-spacing-4 pt_0">
        <div className="tf-main-product section-image-zoom">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <ProductGallery 
                  images={product.images} 
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              </div>
              <div className="col-md-6">
                <ProductInfo 
                  product={product}
                  onAddToCart={handleAddToCart}
                  onVariantChange={handleVariantChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="flat-spacing-17 pt_0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Tabs product={product} reviews={[]} />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Add to Cart Bar */}
      <StickyAddToCart product={product} onAddToCart={handleAddToCart} />
    </>
  );
};

export default ProductDetailPage;