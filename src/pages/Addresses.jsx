import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import AccountSidebar from "../components/AccountSidebar";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../api/account";
import { showErrorMessage, showSuccessMessage } from "../utils";
// import { useAuthStore } from "../store/useAuthStore";

// ── Empty form state ─────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  is_default: false,
};

// ── Address Form Component ───────────────────────────────────
const AddressForm = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  loading,
  editingAddress,
}) => {
  return (
    <div style={{ marginTop: 32 }}>
      <h5 style={{ color: "#2c3a34", marginBottom: 20 }}>
        {editingAddress ? "Edit Address" : "Add New Address"}
      </h5>
      <form onSubmit={onSubmit}>
        <div className="tf-field style-1 mb_15">
          <input
            className="tf-field-input tf-input"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
            required
          />
          <label className="tf-field-label fw-4 text_black-2">
            Full Name *
          </label>
        </div>

        <div className="tf-field style-1 mb_15">
          <input
            className="tf-field-input tf-input"
            type="tel"
            maxLength={10}
            value={formData.phone}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                phone: e.target.value.replace(/\D/g, ""),
              }))
            }
            required
          />
          <label className="tf-field-label fw-4 text_black-2">
            Phone Number *
          </label>
        </div>

        <div className="tf-field style-1 mb_15">
          <input
            className="tf-field-input tf-input"
            type="text"
            value={formData.address_line1}
            onChange={(e) =>
              setFormData((p) => ({ ...p, address_line1: e.target.value }))
            }
            required
          />
          <label className="tf-field-label fw-4 text_black-2">
            Address Line 1 *
          </label>
        </div>

        <div className="tf-field style-1 mb_15">
          <input
            className="tf-field-input tf-input"
            type="text"
            value={formData.address_line2}
            onChange={(e) =>
              setFormData((p) => ({ ...p, address_line2: e.target.value }))
            }
          />
          <label className="tf-field-label fw-4 text_black-2">
            Address Line 2
          </label>
        </div>

        <div className="box-field grid-2-lg mb_15">
          <div className="tf-field style-1">
            <input
              className="tf-field-input tf-input"
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData((p) => ({ ...p, city: e.target.value }))
              }
              required
            />
            <label className="tf-field-label fw-4 text_black-2">City *</label>
          </div>
          <div className="tf-field style-1">
            <input
              className="tf-field-input tf-input"
              type="text"
              value={formData.state}
              onChange={(e) =>
                setFormData((p) => ({ ...p, state: e.target.value }))
              }
              required
            />
            <label className="tf-field-label fw-4 text_black-2">State *</label>
          </div>
        </div>

        <div className="tf-field style-1 mb_15">
          <input
            className="tf-field-input tf-input"
            type="text"
            maxLength={6}
            value={formData.pincode}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                pincode: e.target.value.replace(/\D/g, ""),
              }))
            }
            required
          />
          <label className="tf-field-label fw-4 text_black-2">Pincode *</label>
        </div>

        <div className="box-checkbox fieldset-radio d-flex align-items-center gap-8 mb_20">
          <input
            type="checkbox"
            id="is_default"
            className="tf-check"
            checked={formData.is_default}
            onChange={(e) =>
              setFormData((p) => ({ ...p, is_default: e.target.checked }))
            }
          />
          <label htmlFor="is_default" className="text_black-2 fw-4">
            Set as default address
          </label>
        </div>

        <div className="d-flex gap-10">
          <button
            type="submit"
            disabled={loading}
            className="tf-btn btn-fill animate-hover-btn"
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="tf-btn btn-outline animate-hover-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// ── Normalize address fields from API ───────────────────────
const normalizeAddress = (addr) => ({
  ...addr,
  address_line1: addr.address_line1 ?? addr.address_line_1 ?? "",
  address_line2: addr.address_line2 ?? addr.address_line_2 ?? "",
});

// ── Main Addresses Page ──────────────────────────────────────
const Addresses = () => {
  const navigate = useNavigate();
  // const logout = useAuthStore((s) => s.logout);

  const [addresses, setAddresses] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const hasAddresses = useMemo(() => addresses.length > 0, [addresses]);

  // ── Session timeout handler ──────────────────────────────
  const handleSessionTimeout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userType");
    // clearCart();
    return <Navigate to="/login" />;
  };

  // ── Load addresses ───────────────────────────────────────
  const loadAddresses = async () => {
    try {
      setLoadingList(true);
      const res = await getAddresses();
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.addresses)
          ? res.addresses
          : Array.isArray(res?.data)
            ? res.data
            : [];
      setAddresses(list.map(normalizeAddress));
    } catch (err) {
      if (err === "sessionTimeout") {
        handleSessionTimeout();
        return;
      }
      showErrorMessage(err || "Failed to load addresses");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // ── Form handlers ────────────────────────────────────────
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData(EMPTY_FORM);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setFormData({
      name: addr.name || "",
      phone: addr.phone || "",
      address_line1: addr.address_line1 || "",
      address_line2: addr.address_line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      is_default: !!addr.is_default,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.address_line1 ||
      !formData.city ||
      !formData.state
    ) {
      showErrorMessage("Please fill all required fields");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      showErrorMessage("Phone number must be 10 digits");
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      showErrorMessage("Pincode must be 6 digits");
      return;
    }

    try {
      setLoadingAction(true);
      const payload = {
        ...formData,
        phone: formData.phone.trim(),
        pincode: formData.pincode.trim(),
      };

      if (editingAddress?.id) {
        await updateAddress(editingAddress.id, payload);
        if (formData.is_default) await setDefaultAddress(editingAddress.id);
        showSuccessMessage("Address updated successfully!");
      } else {
        const res = await createAddress(payload);
        const createdId = res?.id || res?.data?.id;
        if (formData.is_default && createdId)
          await setDefaultAddress(createdId);
        showSuccessMessage("Address added successfully!");
      }

      handleCloseForm();
      await loadAddresses();
    } catch (err) {
      if (err === "sessionTimeout") {
        handleSessionTimeout();
        return;
      }
      showErrorMessage(err || "Unable to save address");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!addressToDelete?.id) return;
    try {
      setLoadingAction(true);
      await deleteAddress(addressToDelete.id);
      setAddressToDelete(null);
      setShowDeleteSuccess(true);
      await loadAddresses();
    } catch (err) {
      if (err === "sessionTimeout") {
        handleSessionTimeout();
        return;
      }
      showErrorMessage(err || "Unable to delete address");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setLoadingAction(true);
      await setDefaultAddress(id);
      showSuccessMessage("Default address updated!");
      await loadAddresses();
    } catch (err) {
      if (err === "sessionTimeout") {
        handleSessionTimeout();
        return;
      }
      showErrorMessage(err || "Unable to update default address");
    } finally {
      setLoadingAction(false);
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
              <AccountSidebar activeTab="Addresses" />
            </div>

            {/* ── Content ── */}
            <div className="col-lg-9">
              <div className="my-account-content account-address">
                {/* Add New button — show only when list is visible */}
                {!showForm && !loadingList && (
                  <div className="text-end mb_20">
                    <button
                      onClick={handleAddNew}
                      className="tf-btn btn-fill animate-hover-btn"
                    >
                      + Add New Address
                    </button>
                  </div>
                )}

                {/* ── Add / Edit Form ── */}
                {showForm && (
                  <AddressForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSave}
                    onClose={handleCloseForm}
                    loading={loadingAction}
                    editingAddress={editingAddress}
                  />
                )}

                {/* ── Loading ── */}
                {!showForm && loadingList && (
                  <div style={{ color: "#888", fontSize: 14 }}>
                    Loading addresses...
                  </div>
                )}

                {/* ── Empty State ── */}
                {!showForm && !loadingList && !hasAddresses && (
                  <div className="text-center" style={{ padding: "40px 0" }}>
                    <p style={{ color: "#888", marginBottom: 16 }}>
                      No addresses saved yet. Add one to make checkout faster!
                      🌈
                    </p>
                  </div>
                )}

                {/* ── Address Cards Grid ── */}
                {!showForm && !loadingList && hasAddresses && (
                  <div
                    className="list-account-address"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 20,
                    }}
                  >
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="account-address-item"
                        style={{
                          border: addr.is_default
                            ? "2px solid #2c3a34"
                            : "1px solid #ddd",
                          padding: 24,
                          position: "relative",
                          backgroundColor: "#fff",
                        }}
                      >
                        {/* Default badge */}
                        {addr.is_default && (
                          <span
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              backgroundColor: "#2c3a34",
                              color: "#fff",
                              fontSize: 11,
                              padding: "2px 8px",
                              fontWeight: 600,
                              letterSpacing: 0.5,
                            }}
                          >
                            DEFAULT
                          </span>
                        )}

                        <p
                          style={{
                            fontWeight: 700,
                            color: "#2c3a34",
                            marginBottom: 4,
                          }}
                        >
                          {addr.name}
                        </p>
                        <p
                          style={{
                            color: "#555",
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          {addr.address_line1}
                        </p>
                        {!!addr.address_line2 && (
                          <p
                            style={{
                              color: "#555",
                              fontSize: 14,
                              marginBottom: 4,
                            }}
                          >
                            {addr.address_line2}
                          </p>
                        )}
                        <p
                          style={{
                            color: "#555",
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p
                          style={{
                            color: "#555",
                            fontSize: 14,
                            marginBottom: 16,
                          }}
                        >
                          {addr.phone}
                        </p>

                        <div className="d-flex gap-10 flex-wrap">
                          <button
                            onClick={() => handleEdit(addr)}
                            disabled={loadingAction}
                            className="tf-btn btn-fill animate-hover-btn justify-content-center"
                          >
                            Edit
                          </button>
                          {!addr.is_default && (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              disabled={loadingAction}
                              className="tf-btn btn-outline animate-hover-btn justify-content-center"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => setAddressToDelete(addr)}
                            disabled={loadingAction}
                            style={{
                              background: "transparent",
                              border: "1px solid #b52c2c",
                              color: "#b52c2c",
                              padding: "8px 16px",
                              cursor: "pointer",
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* ── Delete Confirm Modal ── */}
      {addressToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              backgroundColor: "#fff",
              border: "1px solid #d8dfdb",
              padding: 28,
            }}
          >
            <h5 style={{ margin: "0 0 10px", color: "#2c3a34" }}>
              Delete Address
            </h5>
            <p style={{ margin: "0 0 20px", color: "#5f6b65", fontSize: 14 }}>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>
            <div className="d-flex gap-10 justify-content-end">
              <button
                onClick={() => setAddressToDelete(null)}
                disabled={loadingAction}
                className="tf-btn btn-outline animate-hover-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loadingAction}
                style={{
                  background: "#b52c2c",
                  border: "1px solid #b52c2c",
                  color: "#fff",
                  padding: "8px 20px",
                  cursor: loadingAction ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                {loadingAction ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Success Modal ── */}
      {showDeleteSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              backgroundColor: "#fff",
              border: "1px solid #d8dfdb",
              padding: 28,
              textAlign: "center",
            }}
          >
            <h5 style={{ margin: "0 0 8px", color: "#2c3a34" }}>
              Address Deleted ✓
            </h5>
            <p style={{ margin: "0 0 20px", color: "#5f6b65", fontSize: 14 }}>
              The address has been removed successfully.
            </p>
            <button
              onClick={() => setShowDeleteSuccess(false)}
              className="tf-btn btn-fill animate-hover-btn"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Addresses;
