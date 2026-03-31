import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const TopSlider = () => {
  return (
    <section className="tf-slideshow slider-collection hover-sw-nav pb_0">
      <div className="wrap-slider">

        <Swiper
          slidesPerView={3}
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
        >
          
          <SwiperSlide>
            <img src="/assets/images/slider/pod-store-1.jpg" alt="" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/assets/images/slider/pod-store-2.jpg" alt="" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/assets/images/slider/pod-store-3.jpg" alt="" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/assets/images/slider/pod-store-4.jpg" alt="" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/assets/images/slider/pod-store-5.jpg" alt="" />
          </SwiperSlide>

          <SwiperSlide>
            <img src="/assets/images/slider/pod-store-6.jpg" alt="" />
          </SwiperSlide>

        </Swiper>

        {/* Overlay Content */}
        <div className="box-content z-5">
          <div className="container">
            <div className="card-box bg_yellow-7">
              <p className="subheading fw-7 fs-14">
                30% OFF ALL ORDERS
              </p>
              <h3 className="heading">
                Graphic Tees <br /> Collection
              </h3>
              <a href="#" className="tf-btn btn-outline-dark radius-3 fs-18 fw-5">
                Shop collection
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TopSlider;
