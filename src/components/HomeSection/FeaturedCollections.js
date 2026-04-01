import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import useFetch from "../../hooks/useFetch";
import { getFeaturedCollections } from "../../api/collections";
import { getImageUrl } from "../../api/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FALLBACK_IMAGE = "/assets/images/product-placeholder.svg";

const FeaturedCollections = () => {
  const { apiData, isLoading } = useFetch(getFeaturedCollections, null);
  const collections = apiData?.collections || [];

  return (
    collections.length > 0 && (
      <section
        className="flat-spacing-13 mt-5"
        style={{ backgroundColor: "#00a974" }}
      >
        <div className="container-full">
          {/* ── Header ── */}
          <div
            className="flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp"
            data-wow-delay="0s"
          >
            <div>
              <h3 className="title fw-5 text_white">
                Fresh Hues Just Dropped!
              </h3>
              <br />
              <p className="subtitle fw-5 text_white">
                New moods. New colours. New adventures waiting to happen - check
                out what just arrived for your little one!
              </p>
            </div>
            <div className="bottom wow fadeInUp" data-wow-delay="0s">
              <Link
                className="tf-btn text-align-center btn-fill collection-other-link fw-6"
                to="/collections"
              >
                <span>Explore New Drops</span>
                <i
                  style={{ paddingLeft: 10 }}
                  className="icon icon-arrow1-top-left"
                ></i>
              </Link>
            </div>
          </div>

          {/* ── Loading ── */}
          {isLoading && (
            <div
              style={{ textAlign: "center", padding: "40px 0", color: "#fff" }}
            >
              Loading collections...
            </div>
          )}

          {/* ── Swiper ── */}
          {!isLoading && collections.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.3, spaceBetween: 15 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              pagination={{ clickable: true }}
              className="tf-sw-recent"
            >
              {collections.map((collection) => (
                <SwiperSlide key={collection.id} lazy="true">
                  <div className="card-product">
                    <div
                      className="card-product-wrapper"
                      style={{
                        height: "20rem",
                        width: "100%",
                        borderRadius: 10,
                      }}
                    >
                      <Link
                        to={`/collections/${collection.slug}`}
                        className="product-img"
                        style={{ height: "20rem", borderRadius: 10 }}
                      >
                        <img
                          loading="lazy"
                          style={{ height: "20rem", borderRadius: 10 }}
                          decoding="async"
                          className="lazyload img-product"
                          src={
                            collection.banner_image
                              ? getImageUrl(collection.banner_image)
                              : FALLBACK_IMAGE
                          }
                          alt={collection.name}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                        <img
                          loading="lazy"
                          style={{ height: "20rem", borderRadius: 10 }}
                          decoding="async"
                          className="lazyload img-hover"
                          src={
                            collection.banner_image
                              ? getImageUrl(collection.banner_image)
                              : FALLBACK_IMAGE
                          }
                          alt={collection.name}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                      </Link>

                      {/* Sale badge */}
                    </div>
                    <div className="card-product-info">
                      <Link
                        to={`/collections/${collection.slug}`}
                        className="title link text_white"
                      >
                        {collection.name}
                      </Link>
                      <span className="price current-price text_white">
                        {collection.products_count} products
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* ── Empty ── */}
          {!isLoading && collections.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "40px 0", color: "#fff" }}
            >
              No featured collections yet.
            </div>
          )}
        </div>
      </section>
    )
  );
};

export default FeaturedCollections;
