import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
const Icon = ({ name, className = "" }) => {
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
const TopSlider = () => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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
    <section className="tf-slideshow slider-collection hover-sw-nav pb_0">
      <div className="wrap-slider">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <img
              src="/assets/images/heroBanner.png"
              style={{ height: "45rem" }}
              alt=""
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="/assets/images/midSection.png"
              style={{ height: "45rem" }}
              alt=""
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="/assets/images/pageBanners/aboutBanner.png"
              style={{ height: "45rem" }}
              alt=""
            />
          </SwiperSlide>
        </Swiper>
        <div
          className={`nav-sw nav-next-slider nav-next-product box-icon w_46 round ${isBeginning ? "disabled" : ""}`}
          onClick={handlePrev}
          style={{
            opacity: isBeginning ? 0.5 : 1,
            cursor: isBeginning ? "not-allowed" : "pointer",
          }}
        >
          <Icon name="arrow-left" />
        </div>
        <div
          className={`nav-sw nav-prev-slider nav-prev-product box-icon w_46 round ${isEnd ? "disabled" : ""}`}
          onClick={handleNext}
          style={{
            opacity: isEnd ? 0.5 : 1,
            cursor: isEnd ? "not-allowed" : "pointer",
          }}
        >
          <Icon name="arrow-right" />
        </div>

        {/* Overlay Content */}
        <div className="box-content z-5">
          <div className="container">
            <div className="card-box bg_yellow-7">
              <h3 className="heading">What's Your Hue Today?</h3>
              <p className="subheading fw-7 fs-14">
                Because your little one isn't just one mood - and their wardrobe
                shouldn't be either
              </p>
              <Link
                to="/shop"
                className="tf-btn btn-outline-dark radius-3 fs-18 fw-5"
              >
                Discover Your Hue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSlider;
