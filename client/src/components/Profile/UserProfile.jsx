import React, { useState, useEffect } from "react";

const Profile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 userId received in Profile component:", userId);

    const cleanUserId = typeof userId === "string" ? userId.trim() : null;

    if (!cleanUserId) {
      console.error("❌ Invalid userId detected!");
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log("📢 Fetching user data for:", cleanUserId);
        const response = await fetch(`http://localhost:3004/api/users/${cleanUserId}`);

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        console.log("✅ User Data Received:", data);

        if (!data || !data.user || !data.email || !data.role)
          throw new Error("Incomplete user data");

        setUserData(data);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
        setError(err.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // 📌 Determine user plan
  const userPlan = userData?.premium?.status === "lifetime" ? "Lifetime Premium" : "Basic User";

  return (
    <div style={styles.pageContainer}>
      <div style={styles.profileContainer}>
        <h2 style={styles.heading}>User Profile</h2>

        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : userData ? (
          <div style={styles.profileInfo}>
            <label style={styles.label}>Username:</label>
            <p style={styles.text}>{userData.user}</p>

            <label style={styles.label}>Email:</label>
            <p style={styles.text}>{userData.email}</p>

            <label style={styles.label}>Role:</label>
            <p style={styles.text}>{userData.role}</p> {/* ✅ Shows user role */}

            <label style={styles.label}>Plan:</label>
            <p style={styles.text}>{userPlan}</p> {/* ✅ Shows premium/basic status */}
          </div>
        ) : (
          <p style={styles.error}>No user data available.</p>
        )}
      </div>
    </div>
  );
};

// 🔹 Styles
const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  profileContainer: {
    background: "linear-gradient(145deg, #fff8f3, #f2e1d5)",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.15)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#5c3d2e",
    marginBottom: "20px",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    textAlign: "left",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#7a6652",
  },
  text: {
    fontSize: "16px",
    color: "#5c3d2e",
    padding: "8px",
    background: "#f5ebe0",
    borderRadius: "8px",
    textAlign: "center",
  },
  loading: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#7a6652",
  },
  error: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "red",
  },
};

export default Profile;
