const Procedure = ({ procedure }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Procedure</h2>
            <div className="space-y-4">
                {procedure.map((step, index) => (
                    <div key={index} className="flex gap-4 items-start">
                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                            {index + 1}
                        </span>
                        <p className="text-gray-700 text-lg pt-1">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Procedure;
