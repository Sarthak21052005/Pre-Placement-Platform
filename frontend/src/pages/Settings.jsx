import { useState } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import SettingsSidebar from "../components/SettingsSidebar";
import { useNavigate } from "react-router-dom";
import { updateProfile, changePassword, deleteAccount } from "../services/api";
import "../styles/settings.css";

function Settings() {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [form, setForm] = useState({
    name: localStorage.getItem("user_name") || "",
    password: "",
    newPassword: ""
  });

  const [active, setActive] = useState("profile");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ PROFILE
  const handleSaveProfile = async () => {
    if (!form.name) return toast.error("Enter name");

    setProfileLoading(true);

    try {
      await updateProfile({ name: form.name });
      localStorage.setItem("user_name", form.name);
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    }

    setProfileLoading(false);
  };

  // ✅ PASSWORD
  const handleChangePassword = async () => {
    if (!form.password) return toast.error("Enter current password");
    if (!form.newPassword) return toast.error("Enter new password");

    setPasswordLoading(true);

    try {
      await changePassword({
        old_password: form.password,
        new_password: form.newPassword
      });

      toast.success("Password updated");

      setForm((prev) => ({
        ...prev,
        password: "",
        newPassword: ""
      }));
    } catch {
      toast.error("Incorrect password");
    }

    setPasswordLoading(false);
  };

const confirmDeleteAccount = async () => {
  setShowDeleteModal(false);
  setDeleteLoading(true);

  try {
    await deleteAccount();
    toast.success("Account deleted");

    localStorage.clear();
    navigate("/login");
  } catch {
    toast.error("Delete failed");
  }

  setDeleteLoading(false);
};

  return (
    <>
      <Navbar />

      <div className="settings-page">
        <SettingsSidebar active={active} setActive={setActive} />

        <div className="settings-content">
          <div className="settings-inner">

            {/* PROFILE */}
            {active === "profile" && (
              <div className="settings-card">
                <h1>Profile</h1>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                />

                <button
                  onClick={handleSaveProfile}
                  disabled={profileLoading}
                >
                  {profileLoading ? "Saving..." : "Save"}
                </button>
              </div>
            )}

            {/* SECURITY */}
            {active === "security" && (
              <div className="settings-card">
                <h1>Security</h1>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Current Password"
                />

                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                />

                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}

            {/* ACCOUNT */}
            {active === "account" && (
              <div className="settings-card danger">
                <h1>Account</h1>

                <button
                  className="delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            )}
          {showDeleteModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <p>Are you sure you want to delete your account?</p>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>

        <button
          className="confirm-btn"
          onClick={confirmDeleteAccount}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;