import React from 'react';

const ComponentPalette = () => {
    const onDragStart = (event, nodeType, label) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    const components = [
        { type: 'battery', label: 'Battery (9V)', icon: '🔋' },
        { type: 'led', label: 'LED', icon: '💡' },
        { type: 'switch', label: 'Switch', icon: '🔌' },
        { type: 'resistor', label: 'Resistor', icon: '〰️' },
        { type: 'andGate', label: 'AND Gate', icon: 'AND' },
        { type: 'orGate', label: 'OR Gate', icon: 'OR' },
        { type: 'notGate', label: 'NOT Gate', icon: 'NOT' },
    ];

    return (
        <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-3 h-full overflow-y-auto">
            <h3 className="font-bold text-gray-700 mb-2">Components</h3>
            <p className="text-xs text-gray-500 mb-4">Drag and drop to canvas</p>

            {components.map((comp) => (
                <div
                    key={comp.type}
                    className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-move hover:shadow-md flex items-center gap-3 transition"
                    onDragStart={(event) => onDragStart(event, comp.type, comp.label)}
                    draggable
                >
                    <span className="text-xl">{comp.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{comp.label}</span>
                </div>
            ))}
        </div>
    );
};

export default ComponentPalette;
