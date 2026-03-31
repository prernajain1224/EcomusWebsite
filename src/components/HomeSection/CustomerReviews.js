import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CustomerReviews = () => {
  // Reviews data array
  const reviews = [
    {
      id: 1,
      rating: 5,
      heading: "Best Online Fashion Site",
      text: "I always find something stylish and affordable on this web fashion site",
      author: "Robert smith",
      location: "USA",
      product: {
        name: "Jersey thong body",
        price: "$105.95",
        image: "/assets/images/products/pod-store-5.jpg",
        link: "product-details",
      },
      delay: "0s",
    },
    {
      id: 2,
      rating: 5,
      heading: "Great Selection and Quality",
      text: "I love the variety of styles and the high-quality clothing on this web fashion site.",
      author: "Allen Lyn",
      location: "France",
      product: {
        name: "Cotton jersey top",
        price: "$7.95",
        image: "/assets/images/products/pod-store-8.jpg",
        link: "product-details",
      },
      delay: "0.1s",
    },
    {
      id: 3,
      rating: 5,
      heading: "Best Customer Service",
      text: "I finally found a web fashion site with stylish and flattering options in my size.",
      author: "Peter Rope",
      location: "USA",
      product: {
        name: "Ribbed modal T-shirt",
        price: "From $18.95",
        image: "/assets/images/products/pod-store-9.jpg",
        link: "product-details",
      },
      delay: "0.2s",
    },
    {
      id: 4,
      rating: 5,
      heading: "Great Selection and Quality",
      text: "I love the variety of styles and the high-quality clothing on this web fashion site.",
      author: "Hellen Ase",
      location: "Japan",
      product: {
        name: "Customer from Japan",
        price: "$16.95",
        image: "/assets/images/products/pod-store-10.jpg",
        link: "product-details",
      },
      delay: "0.3s",
    },
  ];

  // Render stars based on rating
  const renderStars = (rating) => {
    return Array(rating)
      .fill()
      .map((_, index) => <i key={index} className="icon-star"></i>);
  };

  return (
    <section className="flat-spacing-18 bg_grey-5 flat-testimonial">
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title fw-5">Customer Reviews</span>
        </div>
        <div className="wrap-carousel">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={15}
            slidesPerView={1}
            navigation={{
              nextEl: ".nav-next-testimonial",
              prevEl: ".nav-prev-testimonial",
            }}
            pagination={{
              clickable: true,
              el: ".sw-pagination-testimonial",
              dynamicBullets: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="tf-sw-testimonial"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div
                  className="testimonial-item style-column bg_white wow fadeInUp"
                  data-wow-delay={review.delay}
                >
                  <div className="rating">{renderStars(review.rating)}</div>
                  <div className="heading">{review.heading}</div>
                  <div className="text">“ {review.text} ”</div>
                  <div className="author">
                    <div className="name">{review.author}</div>
                    <div className="metas">Customer from {review.location}</div>
                  </div>
                  <div className="product">
                    <div className="image">
                      <a href={review.product.link}>
                        <img
                          className="lazyload"
                          data-src={review.product.image}
                          src={review.product.image}
                          alt={review.product.name}
                        />
                      </a>
                    </div>
                    <div className="content-wrap">
                      <div className="product-title">
                        <a href={review.product.link}>{review.product.name}</a>
                      </div>
                      <div className="price">{review.product.price}</div>
                    </div>
                    <a href={review.product.link} className="">
                      <i className="icon-arrow1-top-left"></i>
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-testimonial lg">
            <span className="icon icon-arrow-left"></span>
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-testimonial lg">
            <span className="icon icon-arrow-right"></span>
          </div>
          <div className="sw-dots style-2 sw-pagination-testimonial justify-content-center"></div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;