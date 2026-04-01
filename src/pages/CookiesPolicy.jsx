import { PageTitle } from "../components/PageTitle";

const CookiesPolicy = () => {
  return (
    <>
      <PageTitle
        title="Cookies Policy"
        subtitle="We Use Cookies — Not The Yummy Kind!"
        bgImage="policyBanner.png"
      />

      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page">
            <h4>HueHoppers Cookies Policy</h4>
            <p>
              At HueHoppers, we use cookies to make your shopping experience
              smoother, smarter, and more colorful! This policy explains what
              cookies are, how we use them, and your choices around them.
            </p>

            <h5>What Are Cookies?</h5>
            <p>
              Cookies are small text files stored on your device when you visit
              our website. They help us remember your preferences, understand
              how you use our site, and improve your overall experience.
            </p>

            <h5>Strictly Necessary Cookies</h5>
            <p>
              Essential for the website to work — shopping cart, checkout,
              login, and security. These cannot be turned off.
            </p>

            <h5>Analytics Cookies</h5>
            <p>
              Help us understand how visitors use our site (Google Analytics,
              Shopify Analytics). All data is anonymous.
            </p>

            <h5>Marketing Cookies</h5>
            <p>
              Used to show you relevant HueHoppers ads on Instagram, Facebook,
              and Google after you visit our site (Meta Pixel, Google Ads).
            </p>

            <h5>Functional Cookies</h5>
            <p>
              Remember your preferences like recently viewed products and
              wishlist items.
            </p>

            <h5>Your Choices</h5>
            <p>
              You can manage or disable cookies anytime through your browser
              settings. Note that disabling cookies may affect some website
              features.
            </p>

            <h5>Contact Us</h5>
            <p>
              Questions? Email us at{" "}
              <a href="mailto:hello@huehoppers.com">hello@huehoppers.com</a> or
              call <a href="tel:+919958920231">+91 99589 20231</a>.
            </p>
            <p>HueHoppers | New Delhi, India | Effective Date: March 2026</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CookiesPolicy;
