const Sidebar = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: "aim", label: "Aim" },
        { id: "components", label: "Components Required" },
        { id: "procedure", label: "Procedure" },
        { id: "simulation", label: "Simulation" },
        { id: "quiz", label: "Quiz" },
    ];

    return (
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto z-10 hidden md:block border-r border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-600">Smart Virtual Lab</h1>
            </div>

            <nav className="mt-6 px-4">
                <ul className="space-y-2">
                    {tabs.map((tab) => (
                        <li key={tab.id}>
                            <button
                                onClick={() => onTabChange(tab.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${activeTab === tab.id
                                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50">
                <button
                    onClick={() => window.history.back()}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-900 py-2"
                >
                    &larr; Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
