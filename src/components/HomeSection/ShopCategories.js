import React from "react";

const ShopCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Shop Clothing",
      image: "/assets/images/collections/collection-circle-25.png",
      items: 23,
      link: "shop",
    },
    {
      id: 2,
      name: "Shop Stickers",
      image: "/assets/images/collections/collection-circle-26.png",
      items: 9,
      link: "shop",
    },
    {
      id: 3,
      name: "Gift Cards",
      image: "/assets/images/collections/collection-circle-27.png",
      items: 31,
      link: "shop",
    },
    {
      id: 4,
      name: "Shop Phonecases",
      image: "/assets/images/collections/collection-circle-28.png",
      items: 21,
      link: "shop",
    },
    {
      id: 5,
      name: "Shop Pillows",
      image: "/assets/images/collections/collection-circle-29.png",
      items: 5,
      link: "shop",
    },
    {
      id: 6,
      name: "Shop Posters",
      image: "/assets/images/collections/collection-circle-30.png",
      items: 14,
      link: "shop",
    },
  ];

  return (
    <section className="flat-spacing-21 pb_0">
      <div className="container">
        <div className="flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp" data-wow-delay="0s">
          <h3 className="title fw-5">Shop by categories</h3>
          <a href="shop-collection-sub.html" className="tf-btn btn-line">
            View all categories
            <i className="icon icon-arrow1-top-left"></i>
          </a>
        </div>
        <div className="row">
          {categories.map((category) => (
            <div className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4" key={category.id}>
              <div className="collection-item-circle hover-img">
                <a href={category.link} className="collection-image img-style d-block">
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
