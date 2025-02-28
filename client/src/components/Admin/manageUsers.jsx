    import { useEffect, useState } from 'react';
    import axios from '../api/axios';

    function ManageUsers() {
        const [users, setUsers] = useState([]);
        const [error, setError] = useState('');
        const adminId = localStorage.getItem('roles'); // Get admin ID from localStorage

        useEffect(() => {
            fetchUsers();
        }, []);

        const fetchUsers = async () => {
            try {
                const adminId = localStorage.getItem('roles');  // 🔹 Get admin ID
                const response = await axios.get('http://localhost:3004/api/admin/users', {
                    headers: { adminid: adminId }  // 🔹 Send admin ID in headers (must match backend case)
                });
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError(err.response?.data?.error || "Failed to fetch users");
            }
        };
        
        


        const updateRole = async (id, newRole) => {
            try {
                await axios.put(`/users/${id}`, { role: newRole, adminId });

                fetchUsers(); // Refresh the user list
            } catch (err) {
                setError(err.response?.data?.error || "Failed to update role");
            }
        };

        const deleteUser = async (id) => {
            try {
                await axios.delete(`/users/${id}`, { data: { adminId } });


                fetchUsers();
            } catch (err) {
                setError(err.response?.data?.error || "Failed to delete user");
            }
        };

        return (
            <div>
                <h2>Manage Users</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.user}</td>
                                <td>
                                    <select value={user.role} onChange={(e) => updateRole(user._id, e.target.value)}>
                                        <option value="student">Student</option>
                                        <option value="librarian">Librarian</option>
                                        <option value="courier">Courier</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => deleteUser(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    export default ManageUsers;
