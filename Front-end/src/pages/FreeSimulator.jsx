import React from 'react';
import Simulator from "../components/experiment/Simulator/Simulator";
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const FreeSimulator = () => {
    return (
        <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center">
            <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to="/student-dashboard" className="text-slate-400 hover:text-white transition-colors">
                        <FaArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            Circuit Simulator Playground
                        </h1>
                        <p className="text-slate-400 text-sm">Build and test circuits freely. Designs here are not saved.</p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl flex-grow bg-slate-900/50 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-sm p-4">
                <Simulator readOnly={false} />
            </div>
        </div>
    );
};

export default FreeSimulator;
