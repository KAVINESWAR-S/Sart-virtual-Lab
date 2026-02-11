import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Aim from "../components/experiment/Aim";
import ComponentsRequired from "../components/experiment/ComponentsRequired";
import Procedure from "../components/experiment/Procedure";
import Simulation from "../components/experiment/Simulation";
import Quiz from "../components/experiment/Quiz";

const ExperimentPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("aim");
    const [experiment, setExperiment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExperiment = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Fetch classroom details which acts as the experiment definition
                const { data } = await axios.get(`http://localhost:5000/api/classrooms/${id}`, config);

                // Transform data if necessary or use directly
                setExperiment({
                    id: data._id,
                    title: data.name,
                    aim: data.aim || "No aim provided.",
                    procedure: data.procedure && data.procedure.length > 0 ? data.procedure : ["No procedure provided."],
                    components: data.components || [],
                    quiz: data.quiz || [],
                    code: data.code // store code if needed
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load experiment. " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };

        if (user && id) {
            fetchExperiment();
        }
    }, [id, user]);

    if (loading) return <div className="text-center p-10">Loading experiment...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!experiment) return <div className="text-center p-10">Experiment not found</div>;

    const renderContent = () => {
        switch (activeTab) {
            case "aim":
                return <Aim aim={experiment.aim} />;
            case "components":
                return <ComponentsRequired components={experiment.components} />;
            case "procedure":
                return <Procedure procedure={experiment.procedure} />;
            case "simulation":
                // experiment object passed here matches what Simulation expects (has title)
                return <Simulation experiment={experiment} />;
            case "quiz":
                return <Quiz questions={experiment.quiz} experimentTitle={experiment.title} />;
            default:
                return <Aim aim={experiment.aim} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar needs to be updated or mocked if it relies on hardcoded indices */}
            {/* Assuming sidebar takes activeTab and setter, it should work fine */}
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-grow p-6 lg:p-10 transition-all duration-300 md:ml-64">
                <div className="md:hidden bg-white shadow-sm p-4 sticky top-0 z-20 flex justify-between items-center mb-6 rounded">
                    <h1 className="font-bold text-gray-800 truncate">{experiment.title}</h1>
                    <button
                        onClick={() => navigate("/student-dashboard")}
                        className="text-sm text-blue-600 font-medium"
                    >
                        Exit
                    </button>
                </div>

                <div className="max-w-4xl mx-auto">
                    <header className="mb-8 hidden md:block border-b pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{experiment.title}</h1>
                                <p className="text-gray-500 mt-1">Classroom Code: {experiment.code}</p>
                            </div>
                            <button
                                onClick={() => navigate("/student-dashboard")}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </header>

                    <main className="fade-in bg-white p-6 rounded shadow-sm min-h-[500px]">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ExperimentPage;
