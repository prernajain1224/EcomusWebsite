import { PageTitle } from "../components/PageTitle";

const TermsOfService = () => {
  return (
    <>
      <PageTitle
        title="Terms of Service"
        subtitle="The Rules of The Hop!"
        bgImage="policyBanner.png"
      />

      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page">
            <h4>HueHoppers Terms of Service</h4>
            <p>
              Welcome to HueHoppers! By accessing or purchasing from our
              website, you agree to be bound by the following Terms of Service.
              Please read them carefully.
            </p>

            <br />
            <h5>1.1 About HueHoppers</h5>
            <p>
              HueHoppers is a Joy-First kids' lifestyle brand headquartered in
              New Delhi, India. We design and sell premium, vibrant children's
              clothing and lifestyle products through our online store.
            </p>

            <h5>1.2 Use of Website</h5>
            <br />
            <ul>
              <li>
                You must be at least 18 years old to make a purchase on our
                website.
              </li>
              <li>
                You agree not to use our website for any unlawful or harmful
                purpose.
              </li>
              <li>
                HueHoppers reserves the right to refuse service, terminate
                accounts, or cancel orders at its sole discretion.
              </li>
            </ul>

            <br />
            <h5>1.3 Product Information</h5>
            <br />
            <ul>
              <li>
                We make every effort to display our products as accurately as
                possible. However, actual colors may vary slightly due to screen
                settings and monitor calibrations.
              </li>
              <li>
                All product descriptions, images, and specifications are subject
                to change without notice.
              </li>
              <li>
                HueHoppers reserves the right to limit quantities of products
                sold.
              </li>
            </ul>

            <br />
            <h5>1.4 Pricing &amp; Payments</h5>
            <br />
            <ul>
              <li>
                All prices are listed in Indian Rupees (INR) and are inclusive
                of applicable taxes unless stated otherwise.
              </li>
              <li>
                We accept payments via major debit/credit cards, UPI, net
                banking, and other methods available at checkout.
              </li>
              <li>
                HueHoppers reserves the right to modify prices at any time
                without prior notice.
              </li>
              <li>
                In case of a pricing error, we reserve the right to cancel
                orders placed at incorrect prices and offer a full refund.
              </li>
            </ul>

            <br />
            <h5>1.5 Intellectual Property</h5>
            <p>
              All content on the HueHoppers website — including logos, designs,
              images, brand name, copy, and product artwork — is the exclusive
              property of HueHoppers and is protected under applicable
              intellectual property laws. Unauthorized use, reproduction, or
              distribution is strictly prohibited.
            </p>

            <h5>1.6 Limitation of Liability</h5>
            <p>
              HueHoppers shall not be liable for any indirect, incidental, or
              consequential damages arising out of your use of our products or
              services. Our total liability, in any case, shall not exceed the
              value of the order placed.
            </p>

            <h5>1.7 Governing Law</h5>
            <p>
              These Terms of Service shall be governed by and construed in
              accordance with the laws of India. Any disputes shall be subject
              to the exclusive jurisdiction of the courts in New Delhi, India.
            </p>

            <h5>1.8 Changes to Terms</h5>
            <p>
              We reserve the right to update or modify these Terms of Service at
              any time. Changes will be effective immediately upon posting to
              the website. Continued use of the website after changes
              constitutes acceptance of the revised terms.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
export default TermsOfService;
