import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { forgotPassword, loginUser, verifyEmailToken } from "../api/login";
import { showErrorMessage, showSuccessMessage } from "../utils";
import { PageTitle } from "../components/PageTitle";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isRecover, setIsRecover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recoverEmail, setRecoverEmail] = useState("");
  const hasTriggeredVerify = useRef(false);
  const hasShownLoginMessage = useRef(false);

  const showMessage = (text) => setMessage(text || "");

  useEffect(() => {
    if (location.pathname !== "/verify-email") return;
    if (hasTriggeredVerify.current) return;
    hasTriggeredVerify.current = true;

    const token = searchParams.get("token") || "";
    if (!token) {
      showErrorMessage("Verification token is missing");
      navigate("/login", { replace: true });
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmailToken(token);
        if (res?.status === "ok") {
          showSuccessMessage(
            res?.message || "Email verified successfully. Please login.",
          );
        } else if (res?.code === "token_expired") {
          showErrorMessage(
            res?.error ||
              "Verification link has expired. Please login again to get a new link.",
          );
        } else {
          showErrorMessage(res?.error || "Invalid verification link");
        }
      } catch (err) {
        showErrorMessage(err || "Unable to verify email");
      } finally {
        navigate("/login", { replace: true });
      }
    };

    verify();
  }, [location.pathname, navigate, searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    showMessage("");

    if (!username.trim())
      return showMessage("Email or mobile number is required");
    if (!password) return showMessage("Password is required");

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username.trim());
    const isMobile = /^\d{10}$/.test(username.trim());
    if (!isEmail && !isMobile) {
      return showMessage("Enter a valid email or 10 digit mobile number");
    }

    try {
      setLoading(true);
      const res = await loginUser({
        username: username.trim(),
        password,
      });
      const token = res?.token || res?.data?.token;
      if (!token) throw new Error(res?.error || "Invalid login response");

      localStorage.setItem("Token", token);
      localStorage.setItem("userType", "Customer");
      showMessage("");
      navigate("/", { replace: true });
    } catch (err) {
      showMessage(err?.message || err || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    showMessage("");

    if (!recoverEmail.trim()) return showMessage("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoverEmail.trim())) {
      return showMessage("Enter a valid email address");
    }

    try {
      setLoading(true);
      const res = await forgotPassword({ email: recoverEmail.trim() });
      showMessage(
        res?.message || "If this email exists, a reset link has been sent.",
      );
      setIsRecover(false);
    } catch (err) {
      showMessage(err?.message || err || "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loginMessage = location.state?.message;
    if (!loginMessage || hasShownLoginMessage.current) return;
    hasShownLoginMessage.current = true;
    showSuccessMessage(loginMessage);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  return (
    <>
      {/* Page Title */}
      <PageTitle
        title="Login"
        subtitle="Welcome back, Hopper! Your hue is waiting!"
        bgImage="loginSignupBanner.png"
      />

      <section className="flat-spacing-10">
        <div className="container">
          <div className="form-register-wrap">
            <div className="flat-title mb_30 px-0">
              <h5 className="mb_18">Login</h5>
            </div>

            <form onSubmit={handleLogin}>
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  type="text"
                  name="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label className="tf-field-label">Email or mobile *</label>
              </div>

              <div className="tf-field style-1 mb_30">
                <input
                  className="tf-field-input tf-input"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="tf-field-label">Password *</label>
              </div>

              <div className="mb_20">
                <Link
                  to={"/forgot-password"}
                  type="button"
                  className="tf-btn btn-line"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="mb_20 w-100">
                <button
                  className="tf-btn w-100 text-align-center btn-fill"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>
            {message ? (
              <p className="mt_20" style={{ color: "#b42318" }}>
                {message}
              </p>
            ) : null}

            {/* RIGHT SIDE */}
            <div className="tf-login-content">
              <h5 className="mb_10">I'm new here</h5>

              <Link to="/register" className="tf-btn btn-line">
                Register
                <i className="icon icon-arrow1-top-left"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
