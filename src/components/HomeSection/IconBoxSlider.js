import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const IconBoxSlider = () => {
  // Icon box data array
  const iconBoxes = [
    {
      id: 1,
      icon: "/assets/images/shopping-cart.png",
      title: "Free Shipping",
      description: "Free Shipping on orders ₹499+",
    },

    {
      id: 2,
      icon: "/assets/images/heart.png",
      title: "Color Retention",
      description: "Colors That Stay Vivid, Wash After Wash",
    },
    {
      id: 3,
      icon: "/assets/images/download-speed.png",
      title: "7 Day Returns",
      description: "Simple & Fast 7-Day Returns",
    },
    {
      id: 4,
      icon: "/assets/images/megaphone.png",
      title: "Parents Approved",
      description: "Kids Approved. Parent Trusted.",
    },
  ];

  return (
    <section
      // style={{ backgroundColor: "#3a00ac" }}
      className="flat-spacing-9 flat-iconbox wow fadeInUp"
      data-wow-delay="0s"
    >
      <div className="container">
        <div className="wrap-carousel wrap-mobile">
          <Swiper
            modules={[Pagination]}
            spaceBetween={15}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: ".sw-pagination-mb",
              dynamicBullets: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 15,
              },
            }}
            className="tf-sw-mobile"
          >
            {iconBoxes.map((box) => (
              <SwiperSlide key={box.id}>
                <div className="tf-icon-box style-border-line text-center">
                  <div className="icon">
                    <img
                      src={box.icon}
                      alt={box.title}
                      style={{ height: 50, width: 50 }}
                    />
                  </div>
                  <div className="content">
                    <div style={{}} className="title">
                      {box.title}
                    </div>
                    <p style={{}}>{box.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="sw-dots style-2 sw-pagination-mb justify-content-center"></div>
        </div>
      </div>
    </section>
  );
};

export default IconBoxSlider;
