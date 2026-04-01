import { PageTitle } from "../components/PageTitle";
import BrandStory from "../components/BrandStory";

const About = () => (
  <>
    <PageTitle
      title={"ABOUT US"}
      subtitle={"We Don't Just Make Clothes. We Make Moods You Can Wear."}
      bgImage={"aboutBanner.png"}
    />

    {/* ── Brand Story ── */}
    <section className="flat-spacing-23">
      <div className="container">
        <BrandStory />
      </div>
    </section>

    <div className="container">
      <div className="line" />
    </div>

    {/* image-text */}
    <section className="flat-spacing-23 flat-image-text-section">
      <div className="container">
        <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
          <div className="tf-image-wrap">
            <img
              className="lazyload w-100"
              data-src="/assets/images/midSection.png"
              src="/assets/images/midSection.png"
              alt="collection-img"
              style={{ height: "20em" }}
            />
          </div>
          <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
            <div>
              <div className="heading">Established - 2024</div>
              <div className="text">
                HueHoppers was founded by a couple with three kids, three
                personalities, and three completely different moods every single
                morning. What started as a family moment became a brand built
                around one simple belief - kids don't just wear clothes, they
                wear their feelings.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="flat-spacing-15">
      <div className="container">
        <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
          <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
            <div>
              <div className="heading">Our mission</div>
              <div className="text">
                Our mission is to capture the moods, energy, and spirit of every
                child through joyful, expressive designs. We believe every kid
                deserves clothes that feel like them - vibrant, playful, and
                full of personality. At HueHoppers, every collection tells a
                story, and every design captures a mood your child actually
                lives.
              </div>
            </div>
          </div>
          <div className="grid-img-group">
            <div className="tf-image-wrap box-img item-1">
              <div className="img-style">
                <img
                  className="lazyload"
                  src="/assets/images/homesale-boy.png"
                  data-src="/assets/images/homesale-boy.png"
                  alt="img-slider"
                  style={{
                    height: "38em",
                    objectFit: "contain",
                    width: "100%",
                  }}
                />
              </div>
            </div>
            <div className="tf-image-wrap box-img item-2">
              <div className="img-style">
                <img
                  className="lazyload"
                  src="/assets/images/homesale-girl.png"
                  data-src="/assets/images/homesale-girl.png"
                  alt="img-slider"
                  style={{
                    height: "55em",
                    objectFit: "contain",
                    width: "100%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* iconbox */}
    <section>
      <div className="container mb-5">
        <div className="bg_grey-2 radius-10 flat-wrap-iconbox">
          <div className="flat-title lg">
            <span className="title fw-5">Quality is our priority</span>
            <div>
              <p className="sub-title text_black-2">
                Every design is crafted with love and printed on premium quality
                fabric.
              </p>
              <p className="sub-title text_black-2">
                Because your little one deserves the best - always.
              </p>
            </div>
          </div>
          <div className="flat-iconbox-v3 lg">
            <div className="wrap-carousel wrap-mobile">
              <div
                dir="ltr"
                className="swiper tf-sw-mobile"
                data-preview={1}
                data-space={15}
              >
                <div className="swiper-wrapper wrap-iconbox lg">
                  <div className="swiper-slide">
                    <div className="tf-icon-box text-center">
                      <div className="icon">
                        <i className="icon-materials" />
                      </div>
                      <div className="content">
                        <div className="title">Premium Fabric</div>
                        <p className="text_black-2">
                          Soft, breathable, and skin-friendly - our fabrics are
                          carefully chosen to keep your little one comfortable
                          all day long.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="tf-icon-box text-center">
                      <div className="icon">
                        <i className="icon-design" />
                      </div>
                      <div className="content">
                        <div className="title">Mood-First Design</div>
                        <p className="text_black-2">
                          Every design starts with a feeling. We capture the
                          moods, stories, and energy of childhood in every
                          single print.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="tf-icon-box text-center">
                      <div className="icon">
                        <i className="icon-sizes" />
                      </div>
                      <div className="content">
                        <div className="title">Sizes For Every Stage</div>
                        <p className="text_black-2">
                          From newborns to teenagers - we have sizes that grow
                          with your child, so they never have to outgrow their
                          favourite hue.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sw-dots style-2 sw-pagination-mb justify-content-center" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="container">
      <div className="line" />
    </div>

    {/* Shop Gram */}
  </>
);

export default About;
