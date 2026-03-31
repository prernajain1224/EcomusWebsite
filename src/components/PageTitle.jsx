/**
 * PageTitle Component
 * Reusable page header with optional background image and subtitle
 *
 * Props:
 * - title (required): Main heading text
 * - subtitle (optional): Subheading text shown below title
 * - bgImage (optional): Image filename from /images/banners/ folder
 *                       e.g. "shipping-banner.jpg"
 *
 * Usage:
 * <PageTitle title="Shipping Policy" />
 * <PageTitle title="About Us" subtitle="Our story, our vibe" />
 * <PageTitle title="Collections" subtitle="Shop by mood" bgImage="collections-banner.jpg" />
 */

export const PageTitle = ({ title, subtitle, bgImage }) => {
  return (
    <section className="tf-slideshow about-us-page position-relative">
      <div className="banner-wrapper">
        <img
          className=" ls-is-cached lazyloaded"
          src={
            bgImage.startsWith("http")
              ? bgImage
              : `/assets/images/pageBanners/${bgImage}`
          }
          data-src={
            bgImage.startsWith("http")
              ? bgImage
              : `/assets/images/pageBanners/${bgImage}`
          }
          alt="image-collection"
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 1,
          }}
        >
          <div className="box-content text-center">
            <div className="container">
              <div className="text text-white">{title}</div>
              <br />
              <p
                className="text-center fs-28 text_white mt_5"
                style={{ lineHeight: 1.5 }}
              >
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
