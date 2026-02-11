import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('students'); // 'students' or 'teachers'
    const [loading, setLoading] = useState(true);

    // Create Teacher State
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
            fetchUsers();
            alert('User deleted');
        } catch (error) {
            console.error(error);
            alert('Failed to delete user');
        }
    };

    const createTeacher = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            };
            await axios.post('http://localhost:5000/api/admin/users', { ...newTeacher, role: 'teacher' }, config);
            setNewTeacher({ name: '', email: '', password: '' });
            fetchUsers();
            alert('Teacher account created successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create teacher account');
        }
    };

    const filteredUsers = users.filter(u => activeTab === 'students' ? u.role === 'student' : u.role === 'teacher');

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-red-500">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>Admin: {user.name}</span>
                    <button onClick={logout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Logout</button>
                </div>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-700 pb-4">
                <button
                    onClick={() => setActiveTab('students')}
                    className={`px-4 py-2 rounded ${activeTab === 'students' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    Manage Students
                </button>
                <button
                    onClick={() => setActiveTab('teachers')}
                    className={`px-4 py-2 rounded ${activeTab === 'teachers' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    Manage Teachers
                </button>
            </div>

            {/* Create Teacher Form (Only visible in Teachers tab) */}
            {activeTab === 'teachers' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Create New Teacher Account</h2>
                    <form onSubmit={createTeacher} className="flex gap-4 items-end flex-wrap">
                        <div>
                            <label className="block text-sm mb-1">Name</label>
                            <input
                                type="text"
                                className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
                                value={newTeacher.name}
                                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                type="email"
                                className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
                                value={newTeacher.email}
                                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Password</label>
                            <input
                                type="password"
                                className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
                                value={newTeacher.password}
                                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 h-10">
                            Create Teacher
                        </button>
                    </form>
                </div>
            )}

            {/* User List */}
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="4" className="p-4 text-center">Loading users...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="4" className="p-4 text-center text-gray-400">No users found.</td></tr>
                        ) : (
                            filteredUsers.map(u => (
                                <tr key={u._id} className="hover:bg-gray-700/50 transition">
                                    <td className="p-4">{u.name}</td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'teacher' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}`}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => deleteUser(u._id)}
                                            className="text-red-400 hover:text-red-300 font-bold text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
