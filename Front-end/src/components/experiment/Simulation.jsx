import Simulator from "./Simulator/Simulator";

const Simulation = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md min-h-[600px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Virtual Workbench</h2>
            <p className="text-gray-600 mb-4">
                Drag components from the palette, connect them, and run the simulation.
                (Note: Connect Battery to LED to test. Ensure Switches are toggled ON).
            </p>
            <Simulator />
        </div>
    );
};

export default Simulation;
