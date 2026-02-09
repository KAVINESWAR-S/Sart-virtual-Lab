const ComponentsRequired = ({ components }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Components Required</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
                {components.map((item, index) => (
                    <li key={index} className="pl-2">{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default ComponentsRequired;
