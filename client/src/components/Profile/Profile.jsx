import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    console.log("✅ Received User Data:", user);
}, [user]);

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3004/api/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
  
    fetchUser();
  }, [user, isPremium]);  // ✅ Refetch user when premium status changes
  

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("profilePic", profilePic);
    formData.append("fullName", user.fullName);
    formData.append("phone", user.phone);
    formData.append("address", user.address);
    
    try {
      await axios.put("http://localhost:3004/api/users/{userID}", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10 border border-gray-300">
      <h2 className="text-2xl font-semibold text-center mb-4 text-brown-700">Profile</h2>
      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <label className="cursor-pointer">
              <input type="file" className="hidden" onChange={handleProfilePicChange} />
              <img src={preview || user.profilePic || "/default-avatar.png"} alt="Profile" className="w-24 h-24 mx-auto rounded-full border border-gray-400" />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input type="text" value={user.fullName || ""} onChange={e => setUser({ ...user, fullName: e.target.value })} className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-brown-500 focus:border-brown-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone</label>
            <input type="text" value={user.phone || ""} onChange={e => setUser({ ...user, phone: e.target.value })} className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-brown-500 focus:border-brown-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Address</label>
            <input type="text" value={user.address || ""} onChange={e => setUser({ ...user, address: e.target.value })} className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-brown-500 focus:border-brown-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <input type="text" value={user.role} disabled className="mt-1 block w-full p-2 border rounded-md bg-gray-100" />
          </div>
          <button type="submit" className="w-full bg-brown-700 text-white py-2 px-4 rounded-lg shadow hover:bg-brown-800">Save Changes</button>
        </form>
      )}
    </div>
  );
}
