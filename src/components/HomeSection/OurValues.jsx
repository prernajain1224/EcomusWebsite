import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const VALUES = [
  {
    image: "assets/images/values/colorPalette.png",
    title: "Colour Led",
    desc: "Every design starts with a feeling",
  },
  {
    image: "assets/images/values/smiley.png",
    title: "Mood Driven",
    desc: "Collections built around real kid emotions",
  },
  {
    image: "assets/images/values/flag.png",
    title: "Proudly Indian",
    desc: "Designs that celebrate our culture",
  },
  {
    image: "assets/images/values/strong.png",
    title: "Quality First",
    desc: "Colours that stay vivid, always",
  },
  {
    image: "assets/images/values/purpose.png",
    title: "Purposeful",
    desc: "Nothing random, everything intentional",
  },
];

const OurValues = () => {
  return (
    <section
      className="flat-spacing-9 flat-iconbox wow fadeInUp"
      data-wow-delay="0s"
    >
      <div className="container">
        {/* ── Header ── */}
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title fw-5">The Hues We Live By!</span>
          <p className="sub-title text_black-2">
            Every colour we create, every mood we capture - rooted in what we
            truly believe.
          </p>
        </div>

        {/* ── Slider ── */}
        <div className="wrap-carousel wrap-mobile">
          <Swiper
            modules={[Pagination]}
            spaceBetween={15}
            slidesPerView={2}
            pagination={{
              clickable: true,
              el: ".sw-pagination-values",
              dynamicBullets: false,
            }}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 15 },
              768: { slidesPerView: 4, spaceBetween: 15 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
            }}
            className="tf-sw-mobile"
          >
            {VALUES.map((value) => (
              <SwiperSlide key={value.title}>
                <div className="tf-icon-box text-center">
                  <div className="icon">
                    <img
                      src={`/${value.image}`}
                      alt={value.title}
                      style={{ width: 120, height: 120, objectFit: "contain" }}
                    />
                  </div>
                  <div className="content" style={{ marginTop: 12 }}>
                    <div className="title">{value.title}</div>
                    <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                      {value.desc}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="sw-dots style-2 sw-pagination-values justify-content-center"></div>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
