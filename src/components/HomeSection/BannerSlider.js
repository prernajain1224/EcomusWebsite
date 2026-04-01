import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const BannerSlider = () => {
  // Banner data array
  const banners = [
    {
      id: 1,
      title: "Dress the Mood. Own the Day.",
      subtitle:
        "From head to toe - every piece is a mood waiting to happen. Because half the fun is getting dressed!",
      image: "/assets/images/midSection.png",
      link: "/shop",
      buttonText: "Shop now",
    },
    {
      id: 2,
      title: "More Than Just Clothes!",
      subtitle:
        "HueHoppers was born at home - from three little ones, three moods, and one beautiful realization. Every child deserves to wear how they feel.",
      image: "/assets/images/pageBanners/aboutBanner.png",
      link: "/about",
      buttonText: "Read Our Story",
    },
    {
      id: 3,
      title: "What's Your Hue Today?",
      subtitle:
        "Because your little one isn't just one mood - and their wardrobe shouldn't be either",
      image: "/assets/images/heroBanner.png",
      link: "shop",
      buttonText: "Discover Your Hue",
    },
  ];

  return (
    <section className="flat-spacing-3 flat-banner-cls-kid pb_0">
      <div className="container">
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          slidesPerView={1.3}
          pagination={{
            clickable: true,
            dynamicBullets: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1.3,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="tf-sw-recent"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id} lazy="true">
              <div className="card-product">
                <div
                  className="card-product-wrapper"
                  style={{ height: "20rem", width: "100%", borderRadius: 10 }}
                >
                  <Link
                    to={banner.link}
                    className="product-img"
                    style={{ height: "20rem", borderRadius: 10 }}
                  >
                    <img
                      loading="lazy"
                      style={{ height: "20rem", borderRadius: 10 }}
                      decoding="async"
                      className="lazyload img-product"
                      src={banner.image}
                      alt={banner.title}
                    />
                    <img
                      loading="lazy"
                      style={{ height: "20rem", borderRadius: 10 }}
                      decoding="async"
                      className="lazyload img-hover"
                      src={banner.image}
                      alt={banner.title}
                    />
                  </Link>

                  {/* Sale badge */}
                </div>
                <div className="card-product-info">
                  <Link to={banner.link} className="title link">
                    {banner.title}
                  </Link>
                  <span className="price current-price">{banner.subtitle}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BannerSlider;
