import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { getOrderDetail, getOrders } from "../api/checkout";
import { getImageUrl } from "../api/utils";
import { showErrorMessage } from "../utils";

const FALLBACK_IMAGE = "/assets/images/product-placeholder.svg";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderParam = searchParams.get("order") || "";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      setLoading(true);
      try {
        let foundOrder = null;

        if (/^\d+$/.test(orderParam)) {
          const res = await getOrderDetail(orderParam);
          foundOrder = res?.order || res || null;
        } else if (orderParam) {
          const res = await getOrders(1);
          const orders = res?.orders || [];
          foundOrder = orders.find(
            (item) =>
              String(item.order_number) === String(orderParam) ||
              String(item.id) === String(orderParam),
          );
        }

        if (active) setOrder(foundOrder);
      } catch (err) {
        if (active) {
          showErrorMessage("Could not load order summary");
          setOrder(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderParam]);

  const items = useMemo(() => order?.order_items || [], [order]);
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.selling_price || item.price || 0) *
            Number(item.quantity || 1),
        0,
      ),
    [items],
  );
  const discountAmount = Number(
    order?.discount?.discount_amount || order?.discount_amount || 0,
  );
  const shippingAmount = Number(
    order?.shipping_charge || order?.shipping_amount || 0,
  );
  const grandTotal = Number(
    order?.total_amount || subtotal + shippingAmount - discountAmount || 0,
  );
  const firstItem = items[0];

  return (
    <>
      <PageTitle
        title="Order Confirmed"
        subtitle="Your order is confirmed and being prepared."
        bgImage="collections-banner.jpg"
      />

      <section className="flat-spacing-11">
        <div className="container">
          <div
            className="text-center mx-auto"
            style={{
              maxWidth: 760,
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
                backgroundColor: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: 36,
              }}
            >
              ✓
            </div>

            <h3 className="mb_15">Thank you for your order!</h3>
            <p className="text_black-2 mb_30">
              Your payment was successful and your order has been placed.
            </p>

            {orderParam ? (
              <div className="mb_30">
                <div className="text_black-2 mb_5">Order Number</div>
                <div className="fw-5">#{orderParam}</div>
              </div>
            ) : null}

            <div className="d-flex justify-content-center flex-wrap gap-3 mb_40">
              <Link to="/shop" className="tf-btn btn-fill">
                Continue Shopping
              </Link>
              <Link to="/my-account/orders" className="tf-btn btn-line">
                View Orders
              </Link>
            </div>

            <div
              className="text-start"
              style={{ borderTop: "1px solid #eee", paddingTop: 28 }}
            >
              <h5 className="fw-5 mb_20">Order summary</h5>

              {loading ? (
                <div className="text-center py-4">Loading order details...</div>
              ) : order ? (
                <>
                  <div
                    className="d-flex flex-wrap gap-3 align-items-center mb_24"
                    style={{ background: "#fafafa", padding: 16 }}
                  >
                    <img
                      src={
                        firstItem?.image_url
                          ? getImageUrl(firstItem.image_url) || FALLBACK_IMAGE
                          : FALLBACK_IMAGE
                      }
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      alt={firstItem?.product_name || "product"}
                      style={{
                        width: 84,
                        height: 84,
                        objectFit: "cover",
                        border: "1px solid #eee",
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-6 mb_5">
                        Order #{order.order_number}
                      </div>
                      <div className="text_black-2 mb_5">
                        Status:{" "}
                        {String(order.status || "pending").replace(/_/g, " ")}
                      </div>
                      <div className="text_black-2 mb_5">
                        Payment:{" "}
                        {String(order.payment_status || "unpaid").replace(
                          /_/g,
                          " ",
                        )}
                      </div>
                      {order.address ? (
                        <div className="text_black-2">
                          Ship to: {order.address.name || "Customer"}{" "}
                          {order.address.city ? `· ${order.address.city}` : ""}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mb_24">
                    {items.map((item) => (
                      <div
                        key={item.id || `${item.product_name}-${item.quantity}`}
                        className="d-flex justify-content-between align-items-center"
                        style={{
                          padding: "12px 0",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <div>
                          <div className="fw-6">
                            {item.product_name || item.name || "Item"}
                          </div>
                          <div className="text_black-2">
                            {item.variant_name || item.variant || ""}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-6">
                            × {Number(item.quantity || 1)}
                          </div>
                          <div className="text_black-2">
                            ₹
                            {Number(
                              item.selling_price || item.price || 0,
                            ).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className="d-flex justify-content-between flex-wrap gap-2"
                    style={{ borderTop: "1px solid #eee", paddingTop: 16 }}
                  >
                    <span className="text_black-2">Subtotal</span>
                    <span className="fw-6">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between flex-wrap gap-2 mt-2">
                    <span className="text_black-2">Discount</span>
                    <span className="fw-6">
                      -₹{discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between flex-wrap gap-2 mt-2">
                    <span className="text_black-2">Shipping</span>
                    <span className="fw-6">
                      ₹{shippingAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between flex-wrap gap-2 mt-3">
                    <span className="fw-6">Total</span>
                    <span className="fw-7">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center text_black-2 py-4">
                  We couldn't load the order details, but your payment was
                  received.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;
