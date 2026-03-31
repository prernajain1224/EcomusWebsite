import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import AccountSidebar from "../components/AccountSidebar";
import { getProfile, updateProfile, changePassword } from "../api/account";
import { showErrorMessage, showSuccessMessage } from "../utils";
// import { useAuthStore } from "../store/useAuthStore";

// ── Eye SVGs ─────────────────────────────────────────────────
const EyeOpen = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 12C3.73 8.11 7 5 12 5s8.27 3.11 10 7c-1.73 3.89-5 7-10 7s-8.27-3.11-10-7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const EyeOff = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
);

const PasswordToggle = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
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
    {show ? <EyeOff /> : <EyeOpen />}
  </button>
);

// ── Date normalizer ───────────────────────────────────────────
const toDateInputValue = (value) => {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(trimmed)) return trimmed.slice(0, 10);
  const match = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (match) {
    const first = Number(match[1]),
      second = Number(match[2]),
      year = match[3];
    if (first > 12)
      return `${year}-${String(second).padStart(2, "0")}-${String(first).padStart(2, "0")}`;
    return `${year}-${String(first).padStart(2, "0")}-${String(second).padStart(2, "0")}`;
  }
  return "";
};

const EMPTY_PROFILE = { name: "", email: "", mobile: "", dob: "", gender: "" };

// ── Main Profile Page ─────────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate();
  // const logout = useAuthStore((s) => s.logout);

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSessionTimeout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userType");
    // clearCart();
    navigate("/login");
  };

  const loadProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await getProfile();
      const data =
        res?.profile || res?.customer || res?.user || res?.data || res || {};
      setProfile({
        name: data?.name || "",
        email: data?.email || "",
        mobile: `${data?.mobile_number || data?.phone || ""}`,
        dob: toDateInputValue(data?.dob || data?.date_of_birth || ""),
        gender: data?.gender || "",
      });
    } catch (err) {
      if (err === "sessionTimeout") {
        handleSessionTimeout();
        return;
      }
      showErrorMessage(err || "Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ── Save profile ─────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.email || !profile.mobile) {
      showErrorMessage("Name, email and mobile are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      showErrorMessage("Enter a valid email");
      return;
    }
    if (!/^\d{10}$/.test(profile.mobile)) {
      showErrorMessage("Mobile number must be 10 digits");
      return;
    }
    try {
      setSavingProfile(true);
      await updateProfile({
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        dob: profile.dob || null,
        date_of_birth: profile.dob || null,
        gender: profile.gender || null,
      });
      showSuccessMessage("Profile updated successfully!");
      await loadProfile();
    } catch (err) {
      if (err === "sessionTimeout") {
        handleSessionTimeout();
        return;
      }
      showErrorMessage(err || "Unable to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change password ──────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showErrorMessage("Both current and new password are required");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 32) {
      showErrorMessage("Password must be between 6 and 32 characters");
      return;
    }
    try {
      setSavingPassword(true);
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      showSuccessMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      if (err === "sessionTimeout") {
        handleSessionTimeout();
        return;
      }
      showErrorMessage(err || "Unable to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <PageTitle
        title="My Account"
        subtitle="Your Hue. Your World. Your Space!"
        bgImage="profileBanner.png"
      />

      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            {/* ── Sidebar ── */}
            <div className="col-lg-3">
              <AccountSidebar />
            </div>

            {/* ── Content ── */}
            <div className="col-lg-9">
              <div className="my-account-content account-edit">
                {/* ── Profile Form ── */}
                <form id="form-profile" onSubmit={handleProfileSubmit}>
                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="text"
                      id="property1"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, name: e.target.value }))
                      }
                      disabled={loadingProfile}
                      required
                    />
                    <label
                      className="tf-field-label fw-4 text_black-2"
                      htmlFor="property1"
                    >
                      Full Name *
                    </label>
                  </div>

                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="email"
                      id="property3"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, email: e.target.value }))
                      }
                      disabled={loadingProfile}
                      required
                    />
                    <label
                      className="tf-field-label fw-4 text_black-2"
                      htmlFor="property3"
                    >
                      Email *
                    </label>
                  </div>

                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="tel"
                      id="property_mobile"
                      maxLength={10}
                      value={profile.mobile}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          mobile: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                      disabled={loadingProfile}
                      required
                    />
                    <label
                      className="tf-field-label fw-4 text_black-2"
                      htmlFor="property_mobile"
                    >
                      Mobile Number *
                    </label>
                  </div>

                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="date"
                      id="property_dob"
                      value={profile.dob || ""}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, dob: e.target.value }))
                      }
                      onClick={(e) => e.target.showPicker?.()}
                    />
                    <label
                      className="tf-field-label fw-4 text_black-2"
                      htmlFor="property_dob"
                    >
                      Date of Birth
                    </label>
                  </div>

                  <div className="tf-field style-1 mb_30">
                    <select
                      className="tf-field-input tf-input"
                      id="property_gender"
                      style={{ width: "100%" }}
                      value={profile.gender || ""}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, gender: e.target.value }))
                      }
                      disabled={loadingProfile}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <label
                      className="tf-field-label fw-4 text_black-2"
                      htmlFor="property_gender"
                    >
                      Gender
                    </label>
                  </div>

                  <div className="mb_20">
                    <button
                      type="submit"
                      disabled={savingProfile || loadingProfile}
                      className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                      style={{ opacity: savingProfile ? 0.7 : 1 }}
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>

                {/* ── Password Change Form ── */}
                <form id="form-password-change" onSubmit={handlePasswordSubmit}>
                  <h6 className="mb_20">Password Change</h6>

                  {/* Current Password */}
                  <div
                    className="tf-field style-1 mb_30"
                    style={{ position: "relative" }}
                  >
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type={showCurrentPassword ? "text" : "password"}
                      id="property4"
                      value={currentPassword}
                      maxLength={32}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{ paddingRight: 50 }}
                    />
                    <label
                      className="tf-field-label fw-4 text_black-2"
                      htmlFor="property4"
                    >
                      Current password
                    </label>
                    <PasswordToggle
                      show={showCurrentPassword}
                      onToggle={() => setShowCurrentPassword((p) => !p)}
                    />
                  </div>

                  {/* New Password */}
                  <div
                    className="tf-field style-1 mb_30"
                    style={{ position: "relative" }}
                  >
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type={showNewPassword ? "text" : "password"}
                      id="property5"
                      value={newPassword}
                      maxLength={32}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ paddingRight: 50 }}
                    />
                    <label
                      className="tf-field-label fw-4 text_black-2"
                      htmlFor="property5"
                    >
                      New password
                    </label>
                    <PasswordToggle
                      show={showNewPassword}
                      onToggle={() => setShowNewPassword((p) => !p)}
                    />
                  </div>

                  <div className="mb_20">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                      style={{ opacity: savingPassword ? 0.7 : 1 }}
                    >
                      {savingPassword ? "Updating..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sidebar toggle */}
      <div className="btn-sidebar-account">
        <button
          data-bs-toggle="offcanvas"
          data-bs-target="#mbAccount"
          aria-controls="offcanvas"
        >
          <i className="icon icon-sidebar-2" />
        </button>
      </div>
    </>
  );
};

export default Profile;
