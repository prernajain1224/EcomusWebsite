import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { forgotPassword, resetPassword } from "../api/login";
import {
  OK,
  isValidEmail,
  showErrorMessage,
  showSuccessMessage,
} from "../utils";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  // mode: "request" = enter email, "reset" = enter new password
  const [mode, setMode] = useState(token ? "reset" : "request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  // If token appears in URL, switch to reset mode
  useEffect(() => {
    setMode(token ? "reset" : "request");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ type: "", text: "" });

    // ── Request Reset Link ──
    if (mode === "request") {
      if (!email) {
        showErrorMessage("Email is required");
        return;
      }
      if (!isValidEmail(email)) {
        showErrorMessage("Enter a valid email address");
        return;
      }

      try {
        setLoading(true);
        const res = await forgotPassword({ email: email.trim() });
        if (res?.status !== OK)
          throw res?.error || res?.message || "Failed to send reset link";

        const msg =
          res?.message ||
          "If this email is registered, you will receive a reset link shortly.";
        showSuccessMessage(msg);
        setNotice({ type: "success", text: msg });
      } catch (err) {
        showErrorMessage(err || "Failed to send reset link");
        setNotice({ type: "error", text: err || "Failed to send reset link" });
      } finally {
        setLoading(false);
      }
      return;
    }

    // ── Reset Password ──
    if (!token) {
      showErrorMessage("Reset token is missing");
      return;
    }
    if (!password) {
      showErrorMessage("Password is required");
      return;
    }
    if (password.length < 6 || password.length > 32) {
      showErrorMessage("Password must be between 6 and 32 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({ token, password });
      if (res?.status !== OK)
        throw res?.error || res?.message || "Failed to reset password";

      showSuccessMessage("Password reset successful! Please log in.");
      navigate("/login");
    } catch (err) {
      showErrorMessage(err || "Failed to reset password");
      setNotice({ type: "error", text: err || "Failed to reset password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        title={mode === "reset" ? "Reset Password" : "Forgot Password"}
        subtitle="Oops! Even the best Hoppers forget sometimes! 🌈"
        bgImage="forgotPassBanner.png"
      />

      <section className="flat-spacing-10">
        <div className="container">
          <div className="form-register-wrap">
            {/* ── Form ── */}
            <div className="tf-register-form">
              <h5 className="mb_24">
                {mode === "reset" ? "Set New Password" : "Reset your password"}
              </h5>
              <p className="mb_30">
                {mode === "reset"
                  ? "Enter your new password below."
                  : "We will send you an email to reset your password."}
              </p>

              <form onSubmit={handleSubmit}>
                {mode === "request" ? (
                  /* Email input */
                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="tf-field-label">Email *</label>
                  </div>
                ) : (
                  /* New Password input with show/hide */
                  <div
                    className="tf-field style-1 mb_15"
                    style={{ position: "relative" }}
                  >
                    <input
                      className="tf-field-input tf-input"
                      type={showPassword ? "text" : "password"}
                      maxLength={32}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: 50 }}
                    />
                    <label className="tf-field-label">New Password *</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#666",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showPassword ? (
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 3L21 21"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.58 10.58A2 2 0 0 0 13.42 13.42"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M9.36 5.37A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7-0.59 1.31-1.46 2.5-2.54 3.5M6.61 6.61C4.62 7.93 3.15 9.84 2 12c1.73 3.89 6 7 10 7 1.12 0 2.2-0.16 3.23-0.46"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M2 12C3.73 8.11 7 5 12 5s8.27 3.11 10 7c-1.73 3.89-5 7-10 7s-8.27-3.11-10-7Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                )}

                {/* Notice message */}
                {notice.text && (
                  <p
                    style={{
                      marginBottom: 16,
                      fontSize: 13,
                      color: notice.type === "success" ? "#2e7d32" : "#c62828",
                    }}
                  >
                    {notice.text}
                  </p>
                )}

                <div className="mb_20">
                  <Link to="/login" className="tf-btn btn-line">
                    Back to Login
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="tf-btn w-100 btn-fill"
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading
                    ? mode === "reset"
                      ? "Resetting..."
                      : "Sending..."
                    : mode === "reset"
                      ? "Reset Password"
                      : "Send Reset Link"}
                </button>
              </form>
            </div>

            {/* ── Right Info Panel ── */}
            <div className="tf-login-content">
              <h5 className="mb_10 mt-4">Need help?</h5>
              <p className="mb_20">
                If you're having trouble accessing your account, reach out to us
                at{" "}
                <a href="mailto:hello@huehoppers.com">hello@huehoppers.com</a>{" "}
                and we'll sort it out! 🌈
              </p>
              <Link to="/register" className="tf-btn btn-line">
                Create new account
                <i className="icon icon-arrow1-top-left" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
