import { PageTitle } from "../components/PageTitle";

const ShippingPolicy = () => {
  return (
    <>
      <PageTitle
        title="Shipping Policy"
        subtitle="We Deliver Joy — Here's How!"
        bgImage="policyBanner.png"
      />

      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page">
            <h4>HueHoppers Shipping Policy</h4>
            <p>
              We believe the magic begins the moment you open your HueHoppers
              package — so we work hard to get it to you as quickly and
              carefully as possible.
            </p>

            <h5>1.1 Order Processing</h5>
            <p>
              All orders are processed within 3–5 business days after payment
              confirmation. Orders are not processed on Sundays or public
              holidays. You will receive a confirmation email with tracking
              details once your order is shipped.
            </p>

            <h5>1.2 Shipping Partner</h5>
            <p>
              HueHoppers uses Qikink as our fulfillment and Print-on-Demand
              (POD) partner. Orders are dispatched directly from
              Qikink-authorized fulfillment centers located across India.
            </p>

            <h5>1.3 Estimated Delivery Times</h5>
            <p>
              Delivery timelines are estimates. HueHoppers is not responsible
              for delays caused by courier partners, natural events, or other
              factors beyond our control.
            </p>
            <ul>
              <li>
                <strong>Metro Cities</strong> (Delhi, Mumbai, Bangalore,
                Hyderabad, Chennai, Kolkata): 4–7 business days.
              </li>
              <li>
                <strong>Tier 2 &amp; Tier 3 Cities:</strong> 6–10 business days.
              </li>
              <li>
                <strong>Remote or Difficult-to-Access Areas:</strong> 10–14
                business days.
              </li>
            </ul>
            <br />
            <h5>1.4 Shipping Charges</h5>
            <p>
              Standard shipping charges are calculated at checkout based on
              delivery location and order weight. Free shipping promotions (if
              applicable) will be communicated on the website and at checkout.
            </p>

            <h5>1.5 Order Tracking</h5>
            <p>
              Once shipped, you will receive a tracking link via email. You can
              use this to monitor your delivery in real time. For tracking
              issues, contact us at{" "}
              <a href="mailto:hello@huehoppers.com">hello@huehoppers.com</a>.
            </p>

            <h5>1.6 Failed Deliveries &amp; Undeliverable Packages</h5>
            <p>
              If delivery fails due to an incorrect address or the customer
              being unavailable, the package may be returned to the fulfillment
              center. Re-shipping charges will apply for packages returned due
              to customer error. HueHoppers is not responsible for packages lost
              due to incorrect address information provided at checkout.
            </p>

            <h5>1.7 Currently Shipping To</h5>
            <p>
              We currently ship across India only. International shipping is not
              available at this time, but we're working on it! Stay tuned. 🌍
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
export default ShippingPolicy;
