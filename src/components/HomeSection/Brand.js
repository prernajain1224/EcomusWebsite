import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

const Brand = ({
  brands = [
    { id: 1, image: "/assets/images/brand/brand-01.png", alt: "Brand 1", link: null },
    { id: 2, image: "/assets/images/brand/brand-02.png", alt: "Brand 2", link: null },
    { id: 3, image: "/assets/images/brand/brand-03.png", alt: "Brand 3", link: null },
    { id: 4, image: "/assets/images/brand/brand-04.png", alt: "Brand 4", link: null },
    { id: 5, image: "/assets/images/brand/brand-05.png", alt: "Brand 5", link: null },
    { id: 6, image: "/assets/images/brand/brand-06.png", alt: "Brand 6", link: null },
  ],
  autoplaySpeed = 3000,
  autoplayDelay = 0,
  spaceBetween = 15,
  slidesPerViewMobile = 2,
  slidesPerViewTablet = 4,
  slidesPerViewDesktop = 6,
  loop = true,
  className = "",
  brandItemClass = "brand-item-v2",
  onBrandClick = null,
}) => {
  const handleBrandClick = (e, brand) => {
    if (brand.link && onBrandClick) {
      e.preventDefault();
      onBrandClick(brand);
    } else if (brand.link) {
      window.location.href = brand.link;
    }
  };

  return (
    <section className={`flat-spacing-25 ${className}`}>
      <div className="">
        <div className="wrap-carousel wrap-brand wrap-brand-v2 autoplay-linear">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerViewMobile}
            autoplay={{
              delay: autoplayDelay,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              stopOnLastSlide: false,
            }}
            loop={loop}
            speed={autoplaySpeed}
            breakpoints={{
              640: {
                slidesPerView: slidesPerViewTablet,
                spaceBetween: spaceBetween,
              },
              1024: {
                slidesPerView: slidesPerViewDesktop,
                spaceBetween: spaceBetween,
              },
            }}
            className="tf-sw-brand border-0"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                {brand.link ? (
                  <a
                    href={brand.link}
                    className={brandItemClass}
                    onClick={(e) => handleBrandClick(e, brand)}
                  >
                    <img
                      className="lazyload"
                      data-src={brand.image}
                      src={brand.image}
                      alt={brand.alt}
                    />
                  </a>
                ) : (
                  <div className={brandItemClass}>
                    <img
                      className="lazyload"
                      data-src={brand.image}
                      src={brand.image}
                      alt={brand.alt}
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Brand;