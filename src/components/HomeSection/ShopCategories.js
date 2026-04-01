import React from "react";
import useFetch from "../../hooks/useFetch";
import { getProductCounts } from "../../api/products";

const ShopCategories = () => {
  const { apiData } = useFetch(getProductCounts, null);

  const counts = apiData?.counts;

  const categories = [
    {
      id: 1,
      name: "Boys' Apparel",
      image: "/assets/images/boy.png",
      items: counts?.boy ?? "...",
      link: "/shop?gender=male",
    },
    {
      id: 2,
      name: "Girls' Apparel",
      image: "/assets/images/girl.png",
      items: counts?.girl ?? "...",
      link: "/shop?gender=female",
    },
    {
      id: 3,
      name: "Infant's Apparel",
      image: "/assets/images/infant.png",
      items: counts?.infant ?? "...",
      link: "/shop?age=infant",
    },
  ];

  return (
    <section className="flat-spacing-21 pb_0">
      <div className="container">
        <div
          className="flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp"
          data-wow-delay="0s"
        >
          <h3 className="title fw-5">Shop by categories</h3>
          <a href="/products" className="tf-btn btn-line">
            View all categories
            <i className="icon icon-arrow1-top-left"></i>
          </a>
        </div>
        <div className="row">
          {categories.map((category) => (
            <div
              className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4"
              key={category.id}
            >
              <div className="collection-item-circle hover-img">
                <a
                  href={category.link}
                  className="collection-image img-style d-block"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="img-fluid w-100"
                  />
                </a>
                <div className="collection-content text-center mt-3">
                  <a href={category.link} className="link title fw-5">
                    {category.name}
                  </a>
                  <div className="count">{category.items} items</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopCategories;
