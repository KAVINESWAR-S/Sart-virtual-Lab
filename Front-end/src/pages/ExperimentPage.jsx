import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Aim from "../components/experiment/Aim";
import ComponentsRequired from "../components/experiment/ComponentsRequired";
import Procedure from "../components/experiment/Procedure";
import Simulation from "../components/experiment/Simulation";
import Quiz from "../components/experiment/Quiz";
import { experimentsData } from "../data/experimentsData";

const ExperimentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("aim");

    const experiment = experimentsData[id];

    if (!experiment) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Experiment Not Found</h2>
                    <button
                        onClick={() => navigate("/")}
                        className="text-blue-600 hover:underline"
                    >
                        Go back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "aim":
                return <Aim aim={experiment.aim} />;
            case "components":
                return <ComponentsRequired components={experiment.components} />;
            case "procedure":
                return <Procedure procedure={experiment.procedure} />;
            case "simulation":
                return <Simulation />;
            case "quiz":
                return <Quiz questions={experiment.quiz} />;
            default:
                return <Aim aim={experiment.aim} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Mobile Header */}
            <div className="md:hidden bg-white shadow-sm p-4 sticky top-0 z-20 flex justify-between items-center">
                <h1 className="font-bold text-gray-800 truncate">{experiment.title}</h1>
                <button
                    onClick={() => navigate("/")}
                    className="text-sm text-blue-600 font-medium"
                >
                    Exit
                </button>
            </div>

            <div className="md:ml-64 p-6 lg:p-10 transition-all duration-300">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8 hidden md:block">
                        <h1 className="text-3xl font-bold text-gray-900">{experiment.title}</h1>
                        <p className="text-gray-500 mt-1">Experiment ID: {experiment.id}</p>
                    </header>

                    <main className="fade-in">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ExperimentPage;
