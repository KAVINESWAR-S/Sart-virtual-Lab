import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Simulator from '../experiment/Simulator/Simulator';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create Classroom State
    const [isCreating, setIsCreating] = useState(false);
    const [newClassroom, setNewClassroom] = useState({
        name: '',
        aim: '',
        procedure: [''],
        components: [],
        quiz: [{ question: '', options: ['', '', '', ''], answer: '' }],
        simulationEnabled: true
    });

    // View/Grade State
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [classroomDetails, setClassroomDetails] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentSubmissions, setStudentSubmissions] = useState([]);
    const [gradingSubmission, setGradingSubmission] = useState(null);
    const [gradeInput, setGradeInput] = useState('');
    const [feedbackInput, setFeedbackInput] = useState('');

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/classrooms', config);
            setClassrooms(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // --- Creation Handlers ---
    const handleProcedureChange = (index, value) => {
        const newProcedure = [...newClassroom.procedure];
        newProcedure[index] = value;
        setNewClassroom({ ...newClassroom, procedure: newProcedure });
    };

    const addProcedureStep = () => {
        setNewClassroom({ ...newClassroom, procedure: [...newClassroom.procedure, ''] });
    };

    const handleQuizChange = (index, field, value, optionIndex = null) => {
        const newQuiz = [...newClassroom.quiz];
        if (field === 'options') {
            newQuiz[index].options[optionIndex] = value;
        } else {
            newQuiz[index][field] = value;
        }
        setNewClassroom({ ...newClassroom, quiz: newQuiz });
    };

    const addQuizQuestion = () => {
        setNewClassroom({ ...newClassroom, quiz: [...newClassroom.quiz, { question: '', options: ['', '', '', ''], answer: '' }] });
    };

    const createClassroom = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            };
            await axios.post('http://localhost:5000/api/classrooms', newClassroom, config);
            setIsCreating(false);
            setNewClassroom({
                name: '', aim: '', procedure: [''], components: [],
                quiz: [{ question: '', options: ['', '', '', ''], answer: '' }], simulationEnabled: true
            });
            fetchClassrooms();
            alert('Classroom created successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create classroom');
        }
    };

    // --- View/Grade Handlers ---
    const viewClassroom = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`http://localhost:5000/api/classrooms/${id}`, config);
            setClassroomDetails(data);
            setSelectedClassroom(id);
            setSelectedStudent(null);
        } catch (error) { console.error(error); }
    };

    const handleViewSubmissions = async (student) => {
        setSelectedStudent(student);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`http://localhost:5000/api/submissions/student/${student._id}`, config);
            // Filter submissions relevant to this classroom (by experiment title matching classroom name)
            // Ideally we'd link by ID, but for now title match is the logic used in Simulation.jsx
            const relevantSubmissions = data.filter(sub => sub.experimentTitle === classroomDetails.name);
            setStudentSubmissions(relevantSubmissions);
        } catch (error) { console.error(error); }
    };

    const handleGradeSubmit = async (submissionId) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`http://localhost:5000/api/submissions/${submissionId}/grade`, {
                grade: gradeInput, feedback: feedbackInput
            }, config);

            handleViewSubmissions(selectedStudent);
            setGradingSubmission(null);
            alert("Graded successfully!");
        } catch (error) { console.error(error); alert("Failed to grade."); }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 relative">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {user.name}</span>
                    <button onClick={logout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Logout</button>
                </div>
            </div>

            {/* Actions */}
            <div className="mb-6">
                {!isCreating ? (
                    <button onClick={() => setIsCreating(true)} className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700">
                        + Create New Experiment Room
                    </button>
                ) : (
                    <button onClick={() => setIsCreating(false)} className="bg-gray-600 px-6 py-2 rounded font-bold hover:bg-gray-700">
                        Cancel Creation
                    </button>
                )}
            </div>

            {/* Creation Form */}
            {isCreating && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4">Create New Experiment</h2>
                    <form onSubmit={createClassroom} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Experiment Name</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                                value={newClassroom.name}
                                onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Aim</label>
                            <textarea
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                                value={newClassroom.aim}
                                onChange={(e) => setNewClassroom({ ...newClassroom, aim: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Procedure Steps</label>
                            {newClassroom.procedure.map((step, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <span className="p-2 text-gray-400">{index + 1}.</span>
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                                        value={step}
                                        onChange={(e) => handleProcedureChange(index, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={addProcedureStep} className="text-blue-400 text-sm hover:underline">+ Add Step</button>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Quiz Questions</label>
                            {newClassroom.quiz.map((q, qIndex) => (
                                <div key={qIndex} className="bg-gray-700 p-4 rounded mb-4">
                                    <input
                                        type="text"
                                        placeholder={`Question ${qIndex + 1}`}
                                        className="w-full p-2 rounded bg-gray-600 border border-gray-500 text-white mb-2"
                                        value={q.question}
                                        onChange={(e) => handleQuizChange(qIndex, 'question', e.target.value)}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        {q.options.map((opt, optIndex) => (
                                            <input
                                                key={optIndex}
                                                type="text"
                                                placeholder={`Option ${optIndex + 1}`}
                                                className="p-1 rounded bg-gray-600 border border-gray-500 text-white text-sm"
                                                value={opt}
                                                onChange={(e) => handleQuizChange(qIndex, 'options', e.target.value, optIndex)}
                                                required
                                            />
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Correct Answer (Exact Match)"
                                        className="w-full p-2 rounded bg-gray-600 border border-blue-500 text-white text-sm"
                                        value={q.answer}
                                        onChange={(e) => handleQuizChange(qIndex, 'answer', e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={addQuizQuestion} className="text-blue-400 text-sm hover:underline">+ Add Question</button>
                        </div>

                        <button type="submit" className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 w-full">
                            Create Experiment Room
                        </button>
                    </form>
                </div>
            )}

            {/* List of Classrooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map((room) => (
                    <div key={room._id} className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xl">{room.name}</h3>
                            <span className="bg-yellow-600 text-xs px-2 py-1 rounded font-mono">{room.code}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">{room.students.length} Students Joined</p>
                        <button
                            onClick={() => viewClassroom(room._id)}
                            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 w-full"
                        >
                            View & Grade
                        </button>
                    </div>
                ))}
            </div>

            {/* Selected Classroom Details */}
            {selectedClassroom && classroomDetails && !isCreating && (
                <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4">{classroomDetails.name} - Students</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classroomDetails.students.map(student => (
                                <tr key={student._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-3">{student.name}</td>
                                    <td className="p-3">{student.email}</td>
                                    <td className="p-3 text-right">
                                        <button
                                            className="bg-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-700"
                                            onClick={() => handleViewSubmissions(student)}
                                        >
                                            View Work
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Student Work Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl p-6 relative border border-gray-700 h-[90vh] flex flex-col">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-50"
                            onClick={() => setSelectedStudent(null)}
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-4">Work by {selectedStudent.name}</h2>

                        {studentSubmissions.length === 0 ? (
                            <div className="flex-grow flex items-center justify-center text-gray-500">
                                No submissions for this experiment yet.
                            </div>
                        ) : (
                            <div className="flex-grow overflow-y-auto space-y-8 pr-2">
                                {studentSubmissions.map(sub => (
                                    <div key={sub._id} className="bg-gray-800 p-4 rounded border border-gray-600">
                                        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                                            <h3 className="font-bold text-lg text-blue-400">{sub.experimentTitle}</h3>
                                            <div className="text-right text-sm">
                                                <span className="block">Submitted: {new Date(sub.submittedAt).toLocaleString()}</span>
                                                <span className="block text-green-400">Quiz Score: {sub.quizScore ?? 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Circuit Visualizer */}
                                        <div className="mb-4">
                                            <h4 className="font-bold text-sm text-gray-400 mb-2">Circuit Simulation (Teacher View)</h4>
                                            {sub.circuitData && sub.circuitData.nodes ? (
                                                <div className="h-[600px] border border-gray-600 rounded overflow-hidden relative">
                                                    <Simulator
                                                        initialNodes={sub.circuitData.nodes || []}
                                                        initialEdges={sub.circuitData.edges || []}
                                                        readOnly={true}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-gray-700 text-gray-400 italic">No circuit data available</div>
                                            )}
                                        </div>

                                        {/* Grading Controls */}
                                        <div className="bg-gray-700 p-4 rounded flex items-end gap-4">
                                            <div>
                                                <label className="block text-xs font-bold mb-1">Grade (0-10)</label>
                                                <input
                                                    type="number"
                                                    className="p-2 rounded bg-gray-600 text-white w-24 border border-gray-500"
                                                    defaultValue={sub.grade}
                                                    onChange={(e) => setGradeInput(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <label className="block text-xs font-bold mb-1">Feedback</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500"
                                                    defaultValue={sub.feedback}
                                                    onChange={(e) => setFeedbackInput(e.target.value)}
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setGradeInput(document.querySelector(`input[type="number"]`).value); // simple hack for now
                                                    handleGradeSubmit(sub._id)
                                                }}
                                                className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 h-10"
                                            >
                                                Save Grade
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
