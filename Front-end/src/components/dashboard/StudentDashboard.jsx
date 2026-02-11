import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [classrooms, setClassrooms] = useState([]);
    const [joinCode, setJoinCode] = useState('');
    const [mySubmissions, setMySubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const classroomRes = await axios.get('http://localhost:5000/api/classrooms', config);
            const submissionRes = await axios.get('http://localhost:5000/api/submissions/my', config);

            setClassrooms(classroomRes.data);
            setMySubmissions(submissionRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const joinClassroom = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            };
            await axios.post('http://localhost:5000/api/classrooms/join', { code: joinCode }, config);
            setJoinCode('');
            fetchData(); // Refresh list
            alert('Joined classroom successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error joining classroom');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {user.name}</span>
                    <button onClick={logout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Logout</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Join Classroom */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Join Classroom</h2>
                    <form onSubmit={joinClassroom} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Enter 6-char Code"
                            className="p-2 rounded bg-gray-700 border border-gray-600 text-white font-mono uppercase"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            maxLength={6}
                            required
                        />
                        <button type="submit" className="bg-blue-600 py-2 rounded hover:bg-blue-700">Join</button>
                    </form>
                    <div className="mt-8">
                        <Link to="/simulator" className="block w-full bg-purple-600 hover:bg-purple-700 text-center py-3 rounded font-bold">
                            Go to Simulator
                        </Link>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg md:col-span-2">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">My Classrooms</h2>
                        {classrooms.length === 0 ? (
                            <p className="text-gray-400">You haven't joined any classrooms yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {classrooms.map(room => (
                                    <div key={room._id} className="bg-gray-700 p-4 rounded border-l-4 border-blue-500">
                                        <h3 className="font-bold">{room.name}</h3>
                                        <Link to={`/experiment/${room._id}`} className="block mt-2 text-blue-400 hover:text-blue-300 font-bold text-sm">
                                            Start Experiment &rarr;
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                        <div className="space-y-3">
                            {mySubmissions.length === 0 ? (
                                <p className="text-gray-400">No experiments submitted yet.</p>
                            ) : (
                                mySubmissions.map(sub => (
                                    <div key={sub._id} className="bg-gray-700 p-4 rounded flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold">{sub.experimentTitle}</h3>
                                            <p className="text-xs text-gray-400">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            {sub.grade !== null ? (
                                                <div className="text-green-400 font-bold">Grade: {sub.grade}/10</div>
                                            ) : (
                                                <div className="text-yellow-400 text-sm">Pending Grade</div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
