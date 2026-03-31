import { PageTitle } from "../components/PageTitle";

export const ReturnPolicy = () => {
  return (
    <>
      <PageTitle
        title="Return & Refund Policy"
        subtitle="No Worries, We've Got You!"
        bgImage="policyBanner.png"
      />

      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page">
            <h4>HueHoppers Return &amp; Refund Policy</h4>
            <p>
              At HueHoppers, every order is created with love and color — and we
              want you to love what you receive just as much. If something isn't
              right, we're here to make it better. 🌈
            </p>

            <br />
            <h5>1.1 Eligibility for Returns</h5>
            <br />
            <ul>
              <li>
                The item must be unused, unwashed, and in its original condition
                with all tags intact.
              </li>
              <li>
                The return request must be raised within 7 days of receiving the
                order.
              </li>
              <li>
                Items purchased during sale or marked as 'Final Sale' are not
                eligible for return.
              </li>
              <li>
                Customised or personalised products cannot be returned unless
                they arrive damaged or defective.
              </li>
            </ul>

            <br />
            <h5>1.2 Non-Returnable Items</h5>
            <p>The following items are strictly non-returnable:</p>
            <ul>
              <li>
                Innerwear, socks, or any intimate apparel for hygiene reasons.
              </li>
              <li>
                Items that have been worn, washed, altered, or damaged after
                delivery.
              </li>
              <li>
                Products with missing original packaging, tags, or accessories.
              </li>
            </ul>

            <br />
            <h5>1.3 Refund Process</h5>
            <br />
            <ul>
              <li>
                Once your return is received and inspected, we will notify you
                of the approval or rejection of your refund.
              </li>
              <li>
                Approved refunds will be processed to your original payment
                method within 7–10 business days.
              </li>
              <li>
                Shipping charges are non-refundable unless the return is due to
                our error (e.g., wrong item, defective product).
              </li>
              <li>
                If the refund is delayed, please first check with your bank or
                payment provider before contacting us.
              </li>
            </ul>

            <br />
            <h5>1.4 Damaged or Defective Products</h5>
            <p>
              If you receive a damaged or defective item, please email us at{" "}
              <a href="mailto:hello@huehoppers.com">hello@huehoppers.com</a>{" "}
              within 48 hours of delivery with your order number and clear
              photographs of the issue. We will arrange a replacement or full
              refund at no extra cost.
            </p>

            <br />
            <h5>1.5 How to Initiate a Return</h5>
            <br />
            <ul>
              <li>
                <strong>Step 1:</strong> Email{" "}
                <a href="mailto:hello@huehoppers.com">hello@huehoppers.com</a>{" "}
                with subject line: 'Return Request – [Order ID]'
              </li>
              <li>
                <strong>Step 2:</strong> Include your order number, item name,
                reason for return, and supporting photos (if applicable).
              </li>
              <li>
                <strong>Step 3:</strong> Our team will respond within 2 business
                days with return instructions.
              </li>
              <li>
                <strong>Step 4:</strong> Ship the item back as directed. Please
                retain proof of shipping.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
