import { Link, Navigate, useNavigate } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import AccountSidebar from "../components/AccountSidebar";
import { useEffect, useState } from "react";

import { changePassword, getProfile, updateProfile } from "../api/account";
import { showErrorMessage, showSuccessMessage } from "../utils";

// import { useUser } from "../store/useAuthStore";
const EMPTY_PROFILE = {
  name: "",
  email: "",
  mobile: "",
  dob: "",
  gender: "",
};
const toDateInputValue = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  // ISO datetime or date
  if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }

  // DD-MM-YYYY / DD/MM/YYYY or MM-DD-YYYY / MM/DD/YYYY
  const dayOrMonthFirst = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (dayOrMonthFirst) {
    const first = Number(dayOrMonthFirst[1]);
    const second = Number(dayOrMonthFirst[2]);
    const year = dayOrMonthFirst[3];
    // If first segment cannot be month, treat it as day.
    if (first > 12)
      return `${year}-${String(second).padStart(2, "0")}-${String(first).padStart(2, "0")}`;
    // Default fallback: month-first.
    return `${year}-${String(first).padStart(2, "0")}-${String(second).padStart(2, "0")}`;
  }

  return "";
};

const MyAccount = () => {
  // const user = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const handleSessionTimeout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userType");
    // clearCart();
    Navigate("/login");
  };
  const loadProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await getProfile();
      const data =
        res?.profile ||
        res?.customer ||
        res?.user ||
        res?.data?.profile ||
        res?.data?.customer ||
        res?.data?.user ||
        res?.data ||
        res ||
        {};
      setProfile({
        name: data?.name || "",
        email: data?.email || "",
        mobile: `${data?.mobile || data?.phone || data?.mobile_number || ""}`,
        dob: toDateInputValue(data?.dob || data?.date_of_birth || ""),
        gender: data?.gender || data?.sex || "",
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
              <AccountSidebar activeTab={"Dashboard"} />
            </div>

            {/* ── Dashboard Content ── */}
            <div className="col-lg-9">
              <div className="my-account-content account-dashboard">
                {/* Welcome Message */}
                <div className="mb_20">
                  <h5 className="fw-5 mb_5">
                    Hello, {profile?.name || "Hopper"} 👋
                  </h5>
                </div>

                {/* HueHoppers Vibe Message */}
                <div
                  style={{
                    background: "#f9f7f4",
                    borderLeft: "4px solid #2c3a34",
                    borderRadius: 4,
                    padding: "24px 28px",
                  }}
                >
                  <h6 style={{ color: "#2c3a34", marginBottom: 8 }}>
                    🌈 Every color tells a story.
                  </h6>
                  <p style={{ color: "#555", fontSize: 14, margin: 0 }}>
                    Welcome to your HueHoppers world — where joy is stitched
                    into every thread and every hop is a new adventure. Explore
                    your orders, manage your details, and keep hopping! 🐰✨
                  </p>
                </div>
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

export default MyAccount;
