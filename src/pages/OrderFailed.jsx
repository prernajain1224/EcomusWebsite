import { Link } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";

const OrderFailed = () => {
  return (
    <>
      <PageTitle
        title="Payment Failed"
        subtitle="Something went wrong while processing your payment."
        bgImage="collections-banner.jpg"
      />

      <section className="flat-spacing-11">
        <div className="container">
          <div
            className="text-center mx-auto"
            style={{
              maxWidth: 560,
              border: "1px solid #e5e5e5",
              padding: "48px 40px",
              background: "#fff",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor: "#ffebee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: 36,
              }}
            >
              ✕
            </div>

            <h3 className="mb_15">Payment failed</h3>
            <p className="text_black-2 mb_30">
              Your order was not placed. Please try again or choose another
              payment option.
            </p>

            <div className="d-flex justify-content-center flex-wrap gap-3">
              <Link to="/checkout" className="tf-btn btn-fill">
                Try Again
              </Link>
              <Link to="/shop" className="tf-btn btn-line">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderFailed;
