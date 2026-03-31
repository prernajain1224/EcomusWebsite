import React from "react";

const collections = [
  {
    img: "/assets/images/collections/pod-store-1.jpg",
    title: "Valentine's Day Gift",
    className: "item-1",
  },
  {
    img: "/assets/images/collections/pod-store-2.jpg",
    title: "Birthdays",
    className: "item-2",
  },
  {
    img: "/assets/images/collections/pod-store-3.jpg",
    title: "Baby Showers",
    className: "item-3",
  },
  {
    img: "/assets/images/collections/pod-store-4.jpg",
    title: "Personalized Gifts",
    className: "item-4",
  },
];

const MasonryCollection = () => {
  return (
    <section
      className="flat-spacing-27"
      style={{
        backgroundColor: "#00a974",
        color: "#40544c",
        paddingTop: 120,
        marginTop: 50,
        marginBottom: 50,
        paddingBottom: 120,
      }}
    >
      <div className="container">
        <div
          className="flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp"
          data-wow-delay="0s"
        >
          <div>
            <h3 className="title fw-5 text-white">Fresh Hues Just Dropped!</h3>
            <br />
            <p className="subtitle fw-5 text-white">
              New moods. New colours. New adventures waiting to happen - check
              out what just arrived for your little one!
            </p>
          </div>
          <a
            href="/collections"
            className="tf-btn btn-line text-white hover-icon"
          >
            View all categories
            <i className="icon icon-arrow1-top-left"></i>
          </a>
        </div>
        <div className="masonry-layout-v6">
          {collections.map((item, index) => (
            <div
              key={index}
              className={`${item.className} collection-item large hover-img`}
            >
              <div className="collection-inner">
                <a href="#" className="collection-image img-style rounded-0">
                  <img src={item.img} alt={item.title} />
                </a>

                <div className="collection-content">
                  <a href="#" className="tf-btn collection-title hover-icon">
                    <span>{item.title}</span>
                    <i className="icon icon-arrow1-top-left"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MasonryCollection;
