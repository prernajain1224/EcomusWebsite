import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Register</div>
        </div>
      </div>

      <section className="flat-spacing-10">
        <div className="container">
          <div className="form-register-wrap">

            <div className="flat-title mb_30 px-0">
              <h5 className="mb_18">Register</h5>
              <p className="text_black-2">
                Sign up for early Sale access plus tailored new arrivals, trends and promotions. To opt out, click unsubscribe in our emails
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

              {/* Submit */}
              <div className="mb_20">
                <button
                  type="submit"
                  className="tf-btn w-100 btn-fill"
                >
                  Register
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <a href="/login" className="tf-btn btn-line">
                  Already have an account? Log in here   <i class="icon icon-arrow1-top-left"></i>
                </a>
              </div>

            </form>

          </div>
        </div>
      </section>
    </>
  );
};

export default Register;