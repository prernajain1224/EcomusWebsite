const MARQUEE_ITEMS = [
  { text: "Free Shipping on orders above ₹999! 🚚" },
  { text: "New Collection Dropping Soon — Stay Tuned! 🌈" },
  { text: "Joy-First Kids Lifestyle Brand — Hop Into Your Hue! 🐰" },
  { text: "Use code HUEHOP10 for 10% off your first order! 🎉" },
  { text: "Free Shipping on orders above ₹999! 🚚" },
  { text: "New Collection Dropping Soon — Stay Tuned! 🌈" },
  { text: "Joy-First Kids Lifestyle Brand — Hop Into Your Hue! 🐰" },
  { text: "Use code HUEHOP10 for 10% off your first order! 🎉" },
];

const TopBanner = () => {
  return (
    <div className="tf-top-bar bg_white line">
      <div className="px_15 lg-px_40">
        <div className="tf-top-bar_wrap grid-3 gap-30 align-items-center">
          {/* ── Social Icons ── */}
          <ul className="tf-top-bar_item tf-social-icon d-flex gap-10">
            <li>
              <a
                href="https://facebook.com/huehoppers"
                target="_blank"
                rel="noreferrer"
                className="box-icon w_28 round social-facebook bg_line"
              >
                <i className="icon fs-12 icon-fb" />
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/huehoppers26"
                target="_blank"
                rel="noreferrer"
                className="box-icon w_28 round social-instagram bg_line"
              >
                <i className="icon fs-12 icon-instagram" />
              </a>
            </li>
          </ul>

          {/* ── Marquee Text ── */}
          <div className="text-center overflow-hidden">
            <div className="tf-marquee-wrapper">
              <div className="tf-marquee-track">
                {MARQUEE_ITEMS.map((item, i) => (
                  <span key={i} className="tf-marquee-item">
                    {item.text}
                    <span className="tf-marquee-sep">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Contact link ── */}
          <div className="tf-top-bar_item justify-content-end d-flex">
            <a
              href="mailto:hello@huehoppers.com"
              className="top-bar-text fw-5"
              style={{ fontSize: 13 }}
            >
              hello@huehoppers.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Marquee CSS ── */}
      <style>{`
        .tf-marquee-wrapper {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }
        .tf-marquee-track {
          display: inline-flex;
          animation: marquee-scroll 30s linear infinite;
        }
        .tf-marquee-track:hover {
          animation-play-state: paused;
        }
        .tf-marquee-item {
          font-size: 13px;
          font-weight: 500;
          color: #2c3a34;
          padding: 0 8px;
          white-space: nowrap;
        }
        .tf-marquee-sep {
          margin: 0 12px;
          color: #aaa;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default TopBanner;
