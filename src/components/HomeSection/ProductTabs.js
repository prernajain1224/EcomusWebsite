import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import useFetch from "../../hooks/useFetch";
import { getProducts } from "../../api/products";
import { getImageUrl } from "../../api/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../ProductCard";

const FALLBACK_IMAGE = "/product-placeholder.svg";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("onSale");

  // ── Tab se sort param map ──────────────────────────────
  const TAB_SORT_MAP = {
    // bestSeller: "best_seller",
    newArrivals: "newest",
    onSale: "on_sale",
  };

  // ── API calls — per tab ────────────────────────────────
  const { apiData: bestSellerData, isLoading: loadingBest } = useFetch(
    () => getProducts(1, { sort: "best_seller", per_page: 10 }),
    null,
    ["best_seller"],
  );

  const { apiData: newArrivalsData, isLoading: loadingNew } = useFetch(
    () => getProducts(1, { sort: "newest", per_page: 10 }),
    null,
    ["newest"],
  );

  const { apiData: onSaleData, isLoading: loadingSale } = useFetch(
    () => getProducts(1, { sort: "on_sale", per_page: 10 }),
    null,
    ["on_sale"],
  );

  const tabData = {
    bestSeller: bestSellerData?.products || [],
    newArrivals: newArrivalsData?.products || [],
    onSale: onSaleData?.products || [],
  };

  const tabLoading = {
    bestSeller: loadingBest,
    newArrivals: loadingNew,
    onSale: loadingSale,
  };

  // ── Product card ───────────────────────────────────────
  const renderProductCard = (product) => {
    const variants = product.product_variants || [];
    const minPrice = product.price;
    const comparePrice = product.compare_price;
    const displayImage = product.display_image
      ? getImageUrl(product.display_image)
      : FALLBACK_IMAGE;
    const onSale = comparePrice && comparePrice > minPrice;

    // Unique colors
    const colors = variants
      .filter((v) => v.color)
      .reduce((acc, v) => {
        if (!acc.find((c) => c.id === v.color.id)) acc.push(v.color);
        return acc;
      }, []);

    return (
      <ProductCard
        key={product.id}
        product={{
          ...product,
          price: minPrice,
          compare_price: comparePrice,
          display_image: displayImage,
          on_sale: onSale,
          colors,
        }}
      />
    );
  };

  // ── Carousel ───────────────────────────────────────────
  const renderCarousel = (products, loading) => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
          Loading...
        </div>
      );
    }
    if (!products.length) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
          No products found.
        </div>
      );
    }

    return (
      <div className="wrap-carousel">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={15}
          slidesPerView={2}
          navigation={{
            nextEl: ".nav-next-sell-1",
            prevEl: ".nav-prev-sell-1",
          }}
          pagination={{
            clickable: true,
            el: ".sw-pagination-sell-1",
            dynamicBullets: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="tf-sw-product-sell-1"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              {renderProductCard(product)}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="nav-sw nav-next-slider nav-next-sell-1 box-icon w_46 round">
          <span className="icon icon-arrow-left"></span>
        </div>
        <div className="nav-sw nav-prev-slider nav-prev-sell-1 box-icon w_46 round">
          <span className="icon icon-arrow-right"></span>
        </div>
        <div className="sw-dots style-2 sw-pagination-sell-1 justify-content-center"></div>
      </div>
    );
  };

  return (
    <section className="flat-spacing-26">
      <div className="container">
        <div className="flat-tab-store flat-animate-tab overflow-unset">
          <ul
            className="widget-tab-3 d-flex justify-content-center flex-wrap wow fadeInUp"
            data-wow-delay="0s"
            role="tablist"
          >
            {[
              // { key: "bestSeller", label: "Best Seller" },
              { key: "newArrivals", label: "New Arrivals" },
              { key: "onSale", label: "On Sale" },
            ].map((tab) => (
              <li className="nav-tab-item" role="presentation" key={tab.key}>
                <a
                  href={`#${tab.key}`}
                  className={activeTab === tab.key ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.key);
                  }}
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="tab-content">
            {["bestSeller", "newArrivals", "onSale"].map((tab) => (
              <div
                key={tab}
                className={`tab-pane ${activeTab === tab ? "active show" : ""}`}
                id={tab}
                role="tabpanel"
              >
                {activeTab === tab &&
                  renderCarousel(tabData[tab], tabLoading[tab])}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
