import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import useFetch from "../../hooks/useFetch";
import { getRecentReviews } from "../../api/reviews";
import { getImageUrl } from "../../api/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FALLBACK_PRODUCT_IMAGE = "/assets/images/product-placeholder.svg";

const CustomerReviews = () => {
  const { apiData, isLoading } = useFetch(getRecentReviews, null);
  const reviews = apiData?.reviews || [];

  const renderStars = (rating) =>
    Array(rating)
      .fill()
      .map((_, index) => <i key={index} className="icon-star"></i>);

  return (
    reviews.length > 0 && (
      <section className="flat-spacing-18 bg_grey-5 flat-testimonial">
        <div className="container">
          <div className="flat-title wow fadeInUp" data-wow-delay="0s">
            <span className="title fw-5">Customer Reviews</span>
          </div>

          {isLoading ? (
            <div
              style={{ textAlign: "center", padding: "40px 0", color: "#888" }}
            >
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}
            >
              No reviews yet.
            </div>
          ) : (
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
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
                className="tf-sw-testimonial"
              >
                {reviews.map((review, index) => (
                  <SwiperSlide key={review.id}>
                    <div
                      className="testimonial-item style-column bg_white wow fadeInUp"
                      data-wow-delay={`${index * 0.1}s`}
                    >
                      <div className="rating">{renderStars(review.rating)}</div>
                      <div className="text">" {review.comment} "</div>
                      <div className="author">
                        <div className="name">{review.reviewer_name}</div>
                        <div className="metas">
                          {review.is_verified
                            ? "✓ Verified Purchase"
                            : "Customer"}
                        </div>
                      </div>

                      {review.product && (
                        <div className="product">
                          <div className="image">
                            <a href={`/product/${review.product.slug}`}>
                              <img
                                src={
                                  review.product.image
                                    ? getImageUrl(review.product.image)
                                    : FALLBACK_PRODUCT_IMAGE
                                }
                                alt={review.product.name}
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                                }}
                              />
                            </a>
                          </div>
                          <div className="content-wrap">
                            <div className="product-title">
                              <a href={`/product/${review.product.slug}`}>
                                {review.product.name}
                              </a>
                            </div>
                          </div>
                          <a href={`/product/${review.product.slug}`}>
                            <i className="icon-arrow1-top-left"></i>
                          </a>
                        </div>
                      )}
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
          )}
        </div>
      </section>
    )
  );
};

export default CustomerReviews;
