const Aim = ({ aim }) => {
    return (
        <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Aim of the Experiment</h2>
            <p className="text-slate-300 text-lg leading-relaxed">{aim}</p>
        </div>
    );
};

export default Aim;
