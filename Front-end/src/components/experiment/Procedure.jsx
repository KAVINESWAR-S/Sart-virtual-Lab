const Procedure = ({ procedure }) => {
    return (
        <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Procedure</h2>
            <div className="space-y-4">
                {procedure.map((step, index) => (
                    <div key={index} className="flex gap-4 items-start">
                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm border border-blue-500/30">
                            {index + 1}
                        </span>
                        <p className="text-slate-300 text-lg pt-1">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Procedure;
