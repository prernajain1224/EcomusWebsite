import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HalloweenCollection = () => {
  // Halloween products data array
  const halloweenProducts = [
    {
      id: 1,
      name: "Slasher T-Shirt",
      price: "$30.00",
      mainImage: "/assets/images/products/pod-store-16.jpg",
      hoverImage: "/assets/images/products/pod-store-17.png",
    },
    {
      id: 2,
      name: "Santa Sleigher T-Shirt",
      price: "$30.00",
      mainImage: "/assets/images/products/pod-store-18.jpg",
      hoverImage: "/assets/images/products/pod-store-19.jpg",
    },
    {
      id: 3,
      name: "Horror Movies and Chill T-Shirt",
      price: "$30.00",
      mainImage: "/assets/images/products/pod-store-20.jpg",
      hoverImage: "/assets/images/products/pod-store-21.jpg",
    },
    {
      id: 4,
      name: "No You Hang Up T-Shirt",
      price: "$30.00",
      mainImage: "/assets/images/products/pod-store-22.jpg",
      hoverImage: "/assets/images/products/pod-store-23.jpg",
    },
    {
      id: 5,
      name: "Teletubbies T-Shirt",
      price: "$30.00",
      mainImage: "/assets/images/products/pod-store-24.jpg",
      hoverImage: "/assets/images/products/pod-store-25.jpg",
    },
  ];

  return (
    <section
      className="flat-spacing-21 flat-testimonial-bg"
      style={{
        backgroundColor: "#feb000",
        backgroundImage: "url(/assets/images/slider/pod-store-bg.jpg)",
      }}
    >
      <div className="container-full">
        <div className="flat-title">
          <span
            className="title fw-6 wow text-white fadeInUp"
            data-wow-delay="0s"
          >
            Halloween is coming
          </span>
          <p
            className="sub-title fs-14 text-white wow fadeInUp"
            data-wow-delay="0s"
          >
            Skip the pumpkin spice latte it's Halloween time. Don't miss
            spooktacular items
          </p>
        </div>
        <div className="container">
          <div className="wrap-carousel wrap-sw-2">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={15}
              slidesPerView={2}
              navigation={{
                nextEl: ".nav-next-product",
                prevEl: ".nav-prev-product",
              }}
              pagination={{
                clickable: true,
                el: ".sw-pagination-product",
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
                  spaceBetween: 30,
                },
              }}
              className="tf-sw-product-sell wrap-sw-over"
            >
              {halloweenProducts.map((product) => (
                <SwiperSlide key={product.id} lazy="true">
                  <div className="card-product">
                    <div className="card-product-wrapper">
                      <a href="product-details" className="product-img">
                        <img
                          className="lazyload img-product"
                          data-src={product.mainImage}
                          src={product.mainImage}
                          alt={product.name}
                        />
                        <img
                          className="lazyload img-hover"
                          data-src={product.hoverImage}
                          src={product.hoverImage}
                          alt={product.name}
                        />
                      </a>
                      <div className="list-product-btn absolute-2">
                        <a
                          href="#shoppingCart"
                          data-bs-toggle="modal"
                          className="box-icon bg_white quick-add tf-btn-loading"
                        >
                          <span className="icon icon-bag"></span>
                          <span className="tooltip">Add to cart</span>
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="box-icon bg_white wishlist btn-icon-action"
                        >
                          <span className="icon icon-heart"></span>
                          <span className="tooltip">Add to Wishlist</span>
                          <span className="icon icon-delete"></span>
                        </a>
                        <a
                          href="#compare"
                          data-bs-toggle="offcanvas"
                          aria-controls="offcanvasLeft"
                          className="box-icon bg_white compare btn-icon-action"
                        >
                          <span className="icon icon-compare"></span>
                          <span className="tooltip">Add to Compare</span>
                          <span className="icon icon-check"></span>
                        </a>
                        <a
                          href="#quick_view"
                          data-bs-toggle="modal"
                          className="box-icon bg_white quickview tf-btn-loading"
                        >
                          <span className="icon icon-view"></span>
                          <span className="tooltip">Quick View</span>
                        </a>
                      </div>
                    </div>
                    <div className="card-product-info">
                      <a
                        href="product-details"
                        className="title link text_white"
                      >
                        {product.name}
                      </a>
                      <span className="price text_white">{product.price}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="nav-sw style-not-line nav-next-slider nav-next-product box-icon w_46 round">
              <span className="icon icon-arrow-left"></span>
            </div>
            <div className="nav-sw style-not-line nav-prev-slider nav-prev-product box-icon w_46 round">
              <span className="icon icon-arrow-right"></span>
            </div>
            <div className="sw-dots style-2 dots-white sw-pagination-product justify-content-center"></div>
          </div>
          <div className="wow fadeInUp text-center lg-mt-50 mt_37">
            <a
              href="shop"
              className="tf-btn btn-md btn-light-icon btn-icon radius-3 animate-hover-btn"
            >
              <span>Shop collection</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HalloweenCollection;
