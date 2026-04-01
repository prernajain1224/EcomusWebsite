const BrandStory = () => (
  <>
    {/* ── Header ── */}
    <section className="flat-spacing-23">
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title fw-5">The HueHoppers Story</span>
          <p className="sub-title text_black-2">
            "It started at home - like all good things do."
          </p>
        </div>
      </div>
    </section>

    {/* ── Image + Origin Story ── */}
    <section className="flat-spacing-15">
      <div className="container">
        <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
          {/* Left - Image */}
          <div className="tf-image-wrap">
            <img
              className="lazyload w-100"
              src="/assets/images/about.jpeg"
              data-src="/assets/images/about.jpeg"
              alt="The HueHoppers Family"
              style={{ height: "30em" }}
            />
          </div>

          {/* Right - Story */}
          <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
            <div>
              <div className="heading">How it all began</div>
              <div className="text">
                <p>
                  We are a couple with three kids, three personalities, and
                  three completely different moods every single morning.
                </p>
                <p style={{ marginTop: 12 }}>
                  😄 Our home is never quiet. It's never one colour. And
                  honestly? We wouldn't have it any other way.
                </p>
                <p style={{ marginTop: 12 }}>
                  One evening, our eldest <strong>Navu</strong> pointed at a
                  sleepy little dinosaur on the screen and said -
                </p>
                <p
                  style={{
                    backgroundColor: "#f4f3ef",
                    padding: "10px 14px",
                    borderRadius: 4,
                    fontStyle: "italic",
                    color: "#2c3a34",
                    marginTop: 12,
                  }}
                >
                  "Yeh toh Ridu hai!" 😂
                </p>
                <p style={{ marginTop: 12 }}>
                  Our youngest <strong>Ridu</strong> - who could sleep through
                  anything, anywhere, anytime. And then <strong>Kayu</strong> -
                  our middle one - spotted the vacation illustration and said -
                </p>
                <p
                  style={{
                    backgroundColor: "#f4f3ef",
                    padding: "10px 14px",
                    borderRadius: 4,
                    fontStyle: "italic",
                    color: "#2c3a34",
                    marginTop: 12,
                  }}
                >
                  "Yeh mujhe abhi chahiye!" 🏖️
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── The Realization ── */}
    <section className="flat-spacing-15">
      <div className="container">
        <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
          {/* Left - Content */}
          <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
            <div>
              <div className="heading">The moment everything changed</div>
              <div className="text">
                <p>
                  That was it. That was the moment.{" "}
                  <strong>Three kids. Three reactions. Three moods</strong> -
                  captured in three designs.
                </p>
                <p
                  style={{
                    borderLeft: "3px solid #00a974",
                    paddingLeft: 14,
                    fontWeight: 600,
                    color: "#2c3a34",
                    marginTop: 16,
                  }}
                >
                  Kids don't just wear clothes. They wear their feelings.
                </p>
                <p style={{ marginTop: 12 }}>
                  And if our three little ones could instantly see themselves in
                  a design - why couldn't every child? That's how{" "}
                  <strong>HueHoppers</strong> was born.
                </p>
                <p style={{ marginTop: 12 }}>
                  Because your little one isn't just one mood. They're{" "}
                  <em>Sleepy Ridu</em> on Monday. <em>Energetic Kayu</em> on
                  Tuesday. And the absolute{" "}
                  <strong>Boss of the Universe</strong> on their birthday. 👑
                </p>
                <p
                  style={{
                    backgroundColor: "#00a974",
                    color: "#fff",
                    padding: "16px 20px",
                    borderRadius: 4,
                    marginTop: 16,
                    lineHeight: 1.8,
                  }}
                >
                  At HueHoppers - we don't just make clothes.{" "}
                  <strong style={{ color: "#fff" }}>
                    We make moods you can wear. 🌈
                  </strong>
                  <br />
                  <em>Hop into your hue. Every single day.</em>
                </p>
              </div>
            </div>
          </div>

          {/* Right - Grid images */}
          <div className="grid-img-group">
            <div className="tf-image-wrap box-img item-1">
              <div className="img-style">
                <img
                  className="lazyload"
                  src="/assets/images/energyBaby.png"
                  data-src="/assets/images/energyBaby.png"
                  alt="HueHoppers"
                  style={{ height: "30em" }}
                />
              </div>
            </div>
            <div className="tf-image-wrap box-img item-2">
              <div className="img-style">
                <img
                  className="lazyload"
                  src="/assets/images/sleepyBaby.png"
                  data-src="/assets/images/sleepyBaby.png"
                  alt="HueHoppers"
                  style={{ height: "50em" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default BrandStory;
