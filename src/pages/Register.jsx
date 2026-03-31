import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/login";
import { showErrorMessage, showSuccessMessage } from "../utils";
import { PageTitle } from "../components/PageTitle";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim()) return setMessage("Full name is required");
    if (!/^\d{10}$/.test(form.mobile))
      return setMessage("Mobile number must be exactly 10 digits");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setMessage("Enter a valid email address");
    if (!form.password) return setMessage("Password is required");

    try {
      setLoading(true);
      const res = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile,
        password: form.password,
      });
      const token = res?.token || res?.data?.token;
      if (token) {
        localStorage.setItem("Token", token);
        localStorage.setItem("userType", "Customer");
      }
      const message =
        res?.message ||
        "Registration successful. Please check your email to verify your account.";
      showSuccessMessage(message);
      navigate("/login", {
        replace: true,
        state: { message },
      });
    } catch (err) {
      const errorMessage = err?.message || err || "Registration failed";
      setMessage(errorMessage);
      showErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Title */}
      <PageTitle
        title="Register"
        subtitle={"Join the Hop! Your hue journey starts here!"}
        bgImage="loginSignupBanner.png"
      />

      <section className="flat-spacing-10">
        <div className="container">
          <div className="form-register-wrap">
            <div className="flat-title mb_30 px-0">
              <h5 className="mb_18">Register</h5>
              <p className="text_black-2">
                Sign up for early Sale access plus tailored new arrivals, trends
                and promotions. To opt out, click unsubscribe in our emails
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                <label className="tf-field-label">Full name *</label>
              </div>

              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  maxLength={10}
                />
                <label className="tf-field-label">Mobile number *</label>
              </div>

              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <label className="tf-field-label">Email *</label>
              </div>

              {/* Password */}
              <div className="tf-field style-1 mb_30">
                <input
                  className="tf-field-input tf-input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <label className="tf-field-label">Password *</label>
              </div>
              {message ? (
                <p className="mb_20" style={{ color: "#b42318" }}>
                  {message}
                </p>
              ) : null}

              <div className="mb_20">
                <button
                  type="submit"
                  className="tf-btn w-100 text-align-center btn-fill"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Register"}
                </button>
              </div>

              <div className="text-center">
                <Link to="/login" className="tf-btn btn-line">
                  Already have an account? Log in here{" "}
                  <i className="icon icon-arrow1-top-left"></i>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
