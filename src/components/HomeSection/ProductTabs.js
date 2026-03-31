import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("bestSeller");

  // Product data for each tab
  const productData = {
    bestSeller: [
      {
        id: 1,
        name: "Bound To Things Up T-Shirt",
        price: "$48.00",
        mainImage: "/assets/images/products/pod-store-1.jpg",
        hoverImage: "/assets/images/products/pod-store-1.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-1.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-4.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-3.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 2,
        name: "Empathy Art Print",
        price: "$52.00",
        mainImage: "/assets/images/products/pod-store-5.jpg",
        hoverImage: "/assets/images/products/pod-store-6.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-5.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-6.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-7.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 3,
        name: "Lazy Days T-Shirt",
        price: "$52.00",
        mainImage: "/assets/images/products/pod-store-8.jpg",
        hoverImage: "/assets/images/products/pod-store-9.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-8.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-9.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-10.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 4,
        name: "Empathy Hoodie",
        price: "$52.00",
        mainImage: "/assets/images/products/pod-store-11.jpg",
        hoverImage: "/assets/images/products/pod-store-12.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-11.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-12.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-13.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 5,
        name: "Empathy Crop Tee",
        price: "$56.00",
        mainImage: "/assets/images/products/pod-store-14.jpg",
        hoverImage: "/assets/images/products/pod-store-15.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-14.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-15.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      }
    ],
    newArrivals: [
      {
        id: 6,
        name: "Empathy Crop Tee",
        price: "$56.00",
        mainImage: "/assets/images/products/pod-store-14.jpg",
        hoverImage: "/assets/images/products/pod-store-15.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-14.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-15.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 7,
        name: "Empathy Hoodie",
        price: "$52.00",
        mainImage: "/assets/images/products/pod-store-11.jpg",
        hoverImage: "/assets/images/products/pod-store-12.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-11.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-12.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-13.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 8,
        name: "Lazy Days T-Shirt",
        price: "$52.00",
        mainImage: "/assets/images/products/pod-store-8.jpg",
        hoverImage: "/assets/images/products/pod-store-9.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-8.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-9.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-10.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 9,
        name: "Empathy Art Print",
        price: "$52.00",
        mainImage: "/assets/images/products/pod-store-5.jpg",
        hoverImage: "/assets/images/products/pod-store-6.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-5.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-6.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-7.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 10,
        name: "Bound To Things Up T-Shirt",
        price: "$48.00",
        mainImage: "/assets/images/products/pod-store-1.jpg",
        hoverImage: "/assets/images/products/pod-store-1.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-1.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-4.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-3.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      }
    ],
    onSale: [
      {
        id: 11,
        name: "Empathy Crop Tee",
        price: "$56.00",
        mainImage: "/assets/images/products/pod-store-14.jpg",
        hoverImage: "/assets/images/products/pod-store-15.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-14.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-15.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 12,
        name: "Empathy Hoodie",
        price: "$52.00",
        mainImage: "/assets/images/products/pod-store-11.jpg",
        hoverImage: "/assets/images/products/pod-store-12.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-11.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-12.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-13.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 13,
        name: "Lazy Days T-Shirt",
        price: "$52.00",
        mainImage: "/assets/images/products/pod-store-8.jpg",
        hoverImage: "/assets/images/products/pod-store-9.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-8.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-9.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-10.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 14,
        name: "Empathy Art Print",
        price: "$52.00",
        mainImage: "/assets/images/products/pod-store-5.jpg",
        hoverImage: "/assets/images/products/pod-store-6.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-5.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-6.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-7.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      },
      {
        id: 15,
        name: "Bound To Things Up T-Shirt",
        price: "$48.00",
        mainImage: "/assets/images/products/pod-store-1.jpg",
        hoverImage: "/assets/images/products/pod-store-1.jpg",
        colors: [
          { name: "Orange", class: "bg_orange-3", image: "/assets/images/products/pod-store-1.jpg" },
          { name: "Black", class: "bg_dark", image: "/assets/images/products/pod-store-4.jpg" },
          { name: "White", class: "bg_white", image: "/assets/images/products/pod-store-3.jpg" }
        ],
        sizes: ["S", "M", "L", "XL"]
      }
    ]
  };

  const renderProductCard = (product) => (
    <div className="card-product" key={product.id}>
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
        <div className="list-product-btn">
          <a href="#quick_add" data-bs-toggle="modal" className="box-icon bg_white quick-add tf-btn-loading">
            <span className="icon icon-bag"></span>
            <span className="tooltip">Quick Add</span>
          </a>
          <a href="javascript:void(0);" className="box-icon bg_white wishlist btn-icon-action">
            <span className="icon icon-heart"></span>
            <span className="tooltip">Add to Wishlist</span>
            <span className="icon icon-delete"></span>
          </a>
          <a href="#compare" data-bs-toggle="offcanvas" aria-controls="offcanvasLeft" className="box-icon bg_white compare btn-icon-action">
            <span className="icon icon-compare"></span>
            <span className="tooltip">Add to Compare</span>
            <span className="icon icon-check"></span>
          </a>
          <a href="#quick_view" data-bs-toggle="modal" className="box-icon bg_white quickview tf-btn-loading">
            <span className="icon icon-view"></span>
            <span className="tooltip">Quick View</span>
          </a>
        </div>
        <div className="size-list">
          {product.sizes.map((size, idx) => (
            <span key={idx}>{size}</span>
          ))}
        </div>
      </div>
      <div className="card-product-info">
        <a href="product-details" className="title link">{product.name}</a>
        <span className="price">{product.price}</span>
        <ul className="list-color-product">
          {product.colors.map((color, idx) => (
            <li className={`list-color-item color-swatch ${idx === 0 ? 'active' : ''}`} key={idx}>
              <span className="tooltip">{color.name}</span>
              <span className={`swatch-value ${color.class}`}></span>
              <img
                className="lazyload"
                data-src={color.image}
                src={color.image}
                alt={color.name}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderCarousel = (products) => (
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
          640: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        className="tf-sw-product-sell-1"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} lazy="true">
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

  return (
    <section className="flat-spacing-26">
      <div className="container">
        <div className="flat-tab-store flat-animate-tab overflow-unset">
          <ul className="widget-tab-3 d-flex justify-content-center flex-wrap wow fadeInUp" data-wow-delay="0s" role="tablist">
            <li className="nav-tab-item" role="presentation">
              <a
                href="#bestSeller"
                className={activeTab === "bestSeller" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("bestSeller");
                }}
                data-bs-toggle="tab"
              >
                Best seller
              </a>
            </li>
            <li className="nav-tab-item" role="presentation">
              <a
                href="#newArrivals"
                className={activeTab === "newArrivals" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("newArrivals");
                }}
                data-bs-toggle="tab"
              >
                New arrivals
              </a>
            </li>
            <li className="nav-tab-item" role="presentation">
              <a
                href="#onSale"
                className={activeTab === "onSale" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("onSale");
                }}
                data-bs-toggle="tab"
              >
                On Sale
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className={`tab-pane ${activeTab === "bestSeller" ? "active show" : ""}`}
              id="bestSeller"
              role="tabpanel"
            >
              {renderCarousel(productData.bestSeller)}
            </div>
            <div
              className={`tab-pane ${activeTab === "newArrivals" ? "active show" : ""}`}
              id="newArrivals"
              role="tabpanel"
            >
              {renderCarousel(productData.newArrivals)}
            </div>
            <div
              className={`tab-pane ${activeTab === "onSale" ? "active show" : ""}`}
              id="onSale"
              role="tabpanel"
            >
              {renderCarousel(productData.onSale)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;