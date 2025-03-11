import React, { useState, useEffect } from "react";

const Premium = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3004/api/users/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch user data");

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("❌ Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (!userData) return <p>Error loading user data.</p>;

    const isPremium = userData.premium?.status === "lifetime";

    return (
        <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f7f1e3", borderRadius: "10px", marginTop: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h2 style={{ color: "#8B4513" }}>Premium Membership</h2>
            {isPremium ? (
                <p style={{ color: "green" }}>✅ You are a Lifetime Premium Member!</p>
            ) : (
                <button style={{ backgroundColor: "#8B4513", color: "white", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", border: "none", fontSize: "16px", marginTop: "10px" }}>
                    Request Lifetime Premium
                </button>
            )}
        </div>
    );
};

export default Premium;
