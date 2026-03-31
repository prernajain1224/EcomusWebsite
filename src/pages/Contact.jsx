import { useState } from "react";
import { PageTitle } from "../components/PageTitle";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // TODO: Replace with your actual contact form API call
      // await submitContactForm(formData);
      await new Promise((res) => setTimeout(res, 1000)); // placeholder
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Contact Us"
        subtitle="Please use the contact details mentioned below if you have any questions or requests concerning our services."
        bgImage="contactBanner.png"
      />

      <section className="flat-spacing-21">
        <div className="container">
          <div className="tf-grid-layout gap30 lg-col-2">
            {/* ── Left: Contact Info ── */}
            <div className="tf-content-left">
              <h5 className="mb_20">Our Office</h5>

              <div className="mb_20">
                <p className="mb_15">
                  <strong>Address</strong>
                </p>
                <p>
                  HueHoppers Lifestyle LLP
                  <br />
                  96, UGF, Pocket B, Sector 26, Rohini
                  <br />
                  New Delhi, Delhi 110042, India
                </p>
              </div>

              <div className="mb_20">
                <p className="mb_15">
                  <strong>Phone</strong>
                </p>
                <p>
                  <a href="tel:+918527894154">+91 85278 94154</a>
                </p>
              </div>

              <div className="mb_36">
                <p className="mb_15">
                  <strong>Email</strong>
                </p>
                <p>
                  <a href="mailto:hello@huehoppers.com">hello@huehoppers.com</a>
                </p>
              </div>

              {/* Social Icons */}
              <div>
                <ul className="tf-social-icon d-flex gap-20 style-default">
                  <li>
                    <a
                      href="https://www.facebook.com/huehoppers"
                      target="_blank"
                      rel="noreferrer"
                      className="box-icon link round social-facebook border-line-black"
                    >
                      <i className="icon fs-14 icon-fb" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/huehoppers26"
                      target="_blank"
                      rel="noreferrer"
                      className="box-icon link round social-instagram border-line-black"
                    >
                      <i className="icon fs-14 icon-instagram" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* ── Right: Contact Form ── */}
            <div className="tf-content-right">
              <h5 className="mb_20">Get in Touch</h5>
              <p className="mb_24">
                Have a question, feedback, or just want to say hi? We'd love to
                hear from you! Drop us a message and we'll get back to you
                within 2 business days. 🌈
              </p>

              {/* Success Message */}
              {submitted && (
                <div
                  style={{
                    background: "#f0faf4",
                    border: "1px solid #b7dfc7",
                    borderRadius: 4,
                    padding: "16px 20px",
                    marginBottom: 20,
                    color: "#2c6e49",
                    fontSize: 14,
                  }}
                >
                  🎉 Thank you for reaching out! We'll get back to you soon.
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    background: "#fff5f5",
                    border: "1px solid #f5c6cb",
                    borderRadius: 4,
                    padding: "16px 20px",
                    marginBottom: 20,
                    color: "#842029",
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              )}

              <form className="form-contact" onSubmit={handleSubmit}>
                <div className="d-flex gap-15 mb_15">
                  <fieldset className="w-100">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Name *"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </fieldset>
                  <fieldset className="w-100">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </fieldset>
                </div>
                <div className="mb_15">
                  <textarea
                    name="message"
                    required
                    placeholder="Message *"
                    cols={30}
                    rows={10}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <div className="send-wrap">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                    style={{
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
