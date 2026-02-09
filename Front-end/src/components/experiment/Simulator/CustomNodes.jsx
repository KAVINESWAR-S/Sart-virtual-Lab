import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';


const nodeStyles = "bg-white border-2 border-gray-800 rounded shadow-md p-2 min-w-[100px] text-center flex flex-col items-center justify-center relative";

// Battery Node
export const BatteryNode = memo(({ data }) => {
    return (
        <div className={`${nodeStyles} border-yellow-500`}>
            <Handle type="source" position={Position.Right} id="pos" style={{ top: '30%', background: 'red' }} />
            <div className="text-sm font-bold">Battery</div>
            <div className="text-xs text-gray-500">9V</div>
            <Handle type="target" position={Position.Right} id="neg" style={{ top: '70%', background: 'black' }} />
        </div>
    );
});

// LED Node
export const LEDNode = memo(({ data }) => {
    const isOn = data.isOn || false;
    return (
        <div className={`${nodeStyles} ${isOn ? 'bg-yellow-100 border-yellow-400 shadow-[0_0_15px_rgba(255,255,0,0.6)]' : 'border-gray-400'}`}>
            <Handle type="target" position={Position.Left} id="in" />
            <div className={`text-3xl transition-all ${isOn ? 'grayscale-0' : 'grayscale opacity-50'}`}>💡</div>
            <div className="text-xs font-bold mt-1">LED</div>
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
});

// Switch Node
export const SwitchNode = memo(({ data }) => {
    const [isOn, setIsOn] = React.useState(false);

    const toggleSwitch = () => {
        const newState = !isOn;
        setIsOn(newState);
        data.onChange && data.onChange({ isOn: newState }); // Callback to update simulation state
    };

    return (
        <div className={nodeStyles}>
            <Handle type="target" position={Position.Left} id="in" />
            <div
                className={`cursor-pointer w-10 h-6 rounded-full flex items-center p-1 transition-colors ${isOn ? 'bg-green-500' : 'bg-gray-300'}`}
                onClick={toggleSwitch}
            >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${isOn ? 'translate-x-4' : ''}`}></div>
            </div>
            <div className="text-xs mt-1">Switch</div>
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
});

// Resistor Node
export const ResistorNode = memo(({ data }) => {
    return (
        <div className={nodeStyles}>
            <Handle type="target" position={Position.Left} id="in" />
            <div className="text-xl font-bold tracking-widest">〰️</div>
            <div className="text-xs">1kΩ</div>
            <Handle type="source" position={Position.Right} id="out" />
        </div>
    );
});

// Logic Gate Template
const GateNode = ({ label, symbol }) => (
    <div className={`${nodeStyles} rounded-lg`}>
        <Handle type="target" position={Position.Left} id="a" style={{ top: '30%' }} />
        <Handle type="target" position={Position.Left} id="b" style={{ top: '70%' }} />
        <div className="text-lg font-bold">{symbol}</div>
        <div className="text-[10px] uppercase font-bold">{label}</div>
        <Handle type="source" position={Position.Right} id="out" />
    </div>
);

export const AndGateNode = memo(({ data }) => <GateNode label="AND" symbol="&" />);
export const OrGateNode = memo(({ data }) => <GateNode label="OR" symbol="≥1" />);
export const NotGateNode = memo(({ data }) => (
    <div className={`${nodeStyles} rounded-lg`}>
        <Handle type="target" position={Position.Left} id="in" />
        <div className="text-lg font-bold">!</div>
        <div className="text-[10px] uppercase font-bold">NOT</div>
        <Handle type="source" position={Position.Right} id="out" />
    </div>
));
