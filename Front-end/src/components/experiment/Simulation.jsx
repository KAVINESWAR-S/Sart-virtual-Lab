import React, { useState, useEffect } from 'react';
import Simulator from "./Simulator/Simulator";
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';

const Simulation = ({ experiment }) => {
    const { user } = useAuth();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.role === 'student' && experiment) {
            checkSubmission();
        }
    }, [user, experiment]);

    const checkSubmission = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            // Ideally we search by experiment ID or title. 
            // For now, fetching all and filtering (inefficient but works for MVP)
            // Or better, add a query param to the API. 
            // Let's assume the backend 'my' submissions returns everything and we filter here.

            const { data } = await axios.get('http://localhost:5000/api/submissions/my', config);
            const existing = data.find(sub => sub.experimentTitle === experiment.title);
            if (existing) {
                setSubmission(existing);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (circuitData) => {
        if (!window.confirm("Are you sure you want to submit your circuit? You cannot edit it afterwards.")) {
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            };

            const payload = {
                experimentTitle: experiment.title,
                circuitData: circuitData
            };

            const { data } = await axios.post('http://localhost:5000/api/submissions', payload, config);
            setSubmission(data);
            alert("Experiment submitted successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to submit experiment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md min-h-[600px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Virtual Workbench</h2>
                {submission && (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg border border-green-200">
                        <span className="font-bold">Status: Submitted</span>
                        {submission.grade !== null && (
                            <span className="ml-4 font-bold text-lg">Grade: {submission.grade}/10</span>
                        )}
                        {submission.feedback && (
                            <div className="text-sm mt-1 text-gray-600">Feedback: {submission.feedback}</div>
                        )}
                    </div>
                )}
            </div>

            <p className="text-gray-600 mb-4">
                Drag components from the palette, connect them, and run the simulation.
                (Note: Connect Battery to LED to test. Ensure Switches are toggled ON).
            </p>

            {submission ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Experiment Completed</h3>
                    <p>You have already submitted this experiment.</p>
                    {/* Optionally we could load the read-only view of the circuit here */}
                </div>
            ) : (
                <Simulator onSubmit={user?.role === 'student' ? handleSubmit : null} />
            )}
        </div>
    );
};

export default Simulation;
