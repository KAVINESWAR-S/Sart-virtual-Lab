import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ComponentPalette from './ComponentPalette';
import {
    BatteryNode,
    LEDNode,
    SwitchNode,
    ResistorNode,
    AndGateNode,
    OrGateNode,
    NotGateNode
} from './CustomNodes';
import { runSimulation } from "../../../utils/simulationEngine";

const nodeTypes = {
    battery: BatteryNode,
    led: LEDNode,
    switch: SwitchNode,
    resistor: ResistorNode,
    andGate: AndGateNode,
    orGate: OrGateNode,
    notGate: NotGateNode,
};

const initialNodes = [];
const initialEdges = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Simulator = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    // Handle Drag & Drop
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: getId(),
                type,
                position,
                data: { label, onChange: (data) => handleNodeDataChange(newNode.id, data) }, // Callback for interactive nodes
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    // Simulation Loop
    const handleNodeDataChange = (id, data) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, ...data } };
                }
                return node;
            })
        );
        // The effect hook will traverse and run simulation when nodes change
        setIsRunning(true);
    };

    const toggleSimulation = () => {
        if (!isRunning) {
            setIsRunning(true);
            runSimulation(nodes, edges, setNodes);
        } else {
            setIsRunning(false);
            // Optional: Reset state
        }
    };

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                runSimulation(nodes, edges, setNodes);
            }, 500); // Update every 500ms
        }
        return () => clearInterval(interval);
    }, [isRunning, nodes, edges]); // Be careful with dependencies to avoid infinite loops


    const deleteSelected = useCallback(() => {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
    }, [setNodes, setEdges]);

    return (
        <div className="flex h-[600px] w-full border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <ReactFlowProvider>
                <ComponentPalette />

                <div className="flex-grow h-full relative" ref={reactFlowWrapper}>
                    <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded shadow flex gap-2">
                        <button
                            onClick={toggleSimulation}
                            className={`px-4 py-2 rounded font-bold transition ${isRunning ? 'bg-red-100 text-red-600 border border-red-300' : 'bg-green-100 text-green-600 border border-green-300'
                                }`}
                        >
                            {isRunning ? '⏹ Stop Simulation' : '▶ Run Simulation'}
                        </button>
                        <button
                            onClick={deleteSelected}
                            className="px-4 py-2 rounded bg-orange-100 text-orange-600 border border-orange-300 hover:bg-orange-200"
                            title="Delete Selected (Backspace)"
                        >
                            🗑 Delete
                        </button>
                        <button
                            onClick={() => { setNodes([]); setEdges([]); }}
                            className="px-4 py-2 rounded bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                        >
                            Clear All
                        </button>
                    </div>

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        deleteKeyCode={['Backspace', 'Delete']}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Controls />
                        <Background variant="dots" gap={12} size={1} />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default Simulator;
