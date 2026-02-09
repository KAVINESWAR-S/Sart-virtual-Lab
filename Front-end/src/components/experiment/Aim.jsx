const Aim = ({ aim }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Aim of the Experiment</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{aim}</p>
        </div>
    );
};

export default Aim;
