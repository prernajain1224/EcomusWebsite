import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

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
        "“HueHoppers was born at home - from three little ones, three moods, and one beautiful realization. Every child deserves to wear how they feel.”",
      image: "/assets/images/pageBanners/aboutBanner.png",
      link: "/about",
      buttonText: "Read Our Story",
    },
    {
      id: 3,
      title: "Custom Pet Portrait",
      subtitle: "Start from $30",
      image: "/assets/images/collections/pod-store-7.jpg",
      link: "shop",
      buttonText: "Shop now",
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
              <div className="collection-item-v2 hover-img">
                <a href={banner.link} className="collection-inner">
                  <div className="collection-image radius-10 img-style">
                    <img
                      style={{ height: "25rem" }}
                      className="lazyload"
                      data-src={banner.image}
                      src={banner.image}
                      alt={banner.title}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      zIndex: 1,
                    }}
                  >
                    <div
                      className="collection-content"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <div className="top wow fadeInUp" data-wow-delay="0s">
                        <h5 className="heading text_white">{banner.title}</h5>
                        <p className="subheading text_white">
                          {banner.subtitle}
                        </p>
                      </div>
                      <div className="bottom wow fadeInUp" data-wow-delay="0s">
                        <button className="tf-btn text-align-center btn-fill collection-other-link fw-6">
                          <span>{banner.buttonText}</span>{" "}
                          <i
                            style={{ paddingLeft: 10 }}
                            className="icon icon-arrow1-top-left"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BannerSlider;
