const ComponentsRequired = ({ components }) => {
    return (
        <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Components Required</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300 text-lg">
                {components.map((item, index) => (
                    <li key={index} className="pl-2">{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default ComponentsRequired;
