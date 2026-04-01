import React, { useState } from "react";
import { PageTitle } from "../components/PageTitle";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", form);

    // 👉 yaha API call kar sakta hai (Django backend)
  };

  return (
    <>
      {/* Page Title */}
      <PageTitle
        title="Register"
        subtitle="Join the Hop! Your hue journey starts here!"
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
              {/* First Name */}
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <label className="tf-field-label">First name</label>
              </div>

              {/* Last Name */}
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
                <label className="tf-field-label">Last name</label>
              </div>

              {/* Email */}
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
              <div
                className="tf-field style-1 mb_30"
                style={{ position: "relative" }}
              >
                <input
                  className="tf-field-input tf-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  style={{ paddingRight: "44px" }}
                />
                <label className="tf-field-label">Password *</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "#8a8a8a",
                    opacity: 0.75,
                  }}
                >
                  {!showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.58 10.58A2 2 0 0 0 13.42 13.42"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.36 5.37A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7-0.59 1.31-1.46 2.5-2.54 3.5M6.61 6.61C4.62 7.93 3.15 9.84 2 12c1.73 3.89 6 7 10 7 1.12 0 2.2-0.16 3.23-0.46"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 12C3.73 8.11 7 5 12 5s8.27 3.11 10 7c-1.73 3.89-5 7-10 7s-8.27-3.11-10-7Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Submit */}
              <div className="mb_20">
                <button type="submit" className="tf-btn w-100 btn-fill">
                  Register
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link to="/login" className="tf-btn btn-line">
                  Already have an account? Log in here{" "}
                  <i class="icon icon-arrow1-top-left"></i>
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
