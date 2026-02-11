import React from 'react';
import { FaBook, FaTools, FaListOl, FaMicrochip, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';

const Sidebar = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: "aim", label: "Aim", icon: <FaBook /> },
        { id: "components", label: "Components", icon: <FaTools /> },
        { id: "procedure", label: "Procedure", icon: <FaListOl /> },
        { id: "simulation", label: "Simulation", icon: <FaMicrochip /> },
        { id: "quiz", label: "Quiz", icon: <FaQuestionCircle /> },
    ];

    return (
        <div className="w-64 h-screen fixed left-0 top-0 z-20 hidden md:flex flex-col bg-slate-900 border-r border-slate-700/50">
            <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                    ⚡
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Virtual Lab
                </h1>
            </div>

            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${activeTab === tab.id
                                ? "bg-blue-600 shadow-lg shadow-blue-600/20 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                    >
                        <span className={`text-lg ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}`}>
                            {tab.icon}
                        </span>
                        <span className="font-medium">{tab.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700/50 bg-slate-800/20">
                <button
                    onClick={() => window.history.back()}
                    className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors py-2"
                >
                    <FaArrowLeft size={12} /> Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
