export const runSimulation = (nodes, edges, setNodes) => {
    // Digital Logic Simulation Engine
    // High = 1 (Voltage/True), Low = 0 (Ground/False)

    // 1. Initialize State Map
    // Map: NodeID -> { outputs: { handleId: 0|1 }, inputs: { handleId: 0|1 } }
    const state = {};

    nodes.forEach(node => {
        state[node.id] = { inputs: {}, outputs: {} };

        // Initialize sources
        if (node.type === 'battery') {
            state[node.id].outputs['pos'] = 1;
            state[node.id].outputs['neg'] = 0;
        }
    });

    // 2. Iterative Logic Solver
    // We run a few iterations to propagate signals. 
    // For non-cyclic circuits, Depth = Number of Components is safe.
    // We'll limit to 10 iterations to prevent infinite loops in cyclic feedbacks.

    let hasChanges = true;
    let iterations = 0;
    const MAX_ITERATIONS = 15;

    while (hasChanges && iterations < MAX_ITERATIONS) {
        hasChanges = false;
        iterations++;

        // A. Propagate Edges (Output -> Input)
        edges.forEach(edge => {
            const sourceVal = state[edge.source]?.outputs[edge.sourceHandle] || 0;

            // Target Input
            if (state[edge.target]) {
                const currentInput = state[edge.target].inputs[edge.targetHandle];
                if (currentInput !== sourceVal) {
                    state[edge.target].inputs[edge.targetHandle] = sourceVal;
                    hasChanges = true;
                }
            }
        });

        // B. Compute Component Logic (Input -> Output)
        nodes.forEach(node => {
            const nodeState = state[node.id];
            const type = node.type;

            if (!nodeState) return;

            let newOutputs = { ...nodeState.outputs };

            if (type === 'battery') {
                // Constant
                newOutputs['pos'] = 1;
            }
            else if (type === 'switch') {
                // If Closed (On), Output = Input
                // If Open (Off), Output = 0
                // Note: Switch custom node uses specific local state. 
                // We need to access that state via node.data.
                // We assumed in CustomNodes that `toggleSwitch` calls `data.onChange`.
                // But we can't easily read that back unless we store it in `data`.
                // FIX: Simulator.jsx must capture this.
                // Assuming `node.data.isOn` is updated by Simulator.jsx or internal state is readable.
                // For robustness, if `data.label` is "Closed" or verify data.isOn.
                // Let's rely on `node.data.isOn`. (User needs to ensure Switch updates this).

                /* 
                   IMPORTANT: In CustomNodes.jsx, SwitchNode uses `const [isOn, setIsOn] = React.useState(false)`.
                   It DOES call `data.onChange(newState)`.
                   Simulator.jsx `handleNodeDataChange` triggers `runSimulation`.
                   BUT it does NOT update the node's `data.isOn` in the ReactFlow store.
                   We need to fix Simulator.jsx to update node data on change!
                   
                   For now, let's assume `data.isOn` is correct.
                */

                // We'll treat Input 'in' -> Output 'out'
                const inputVal = nodeState.inputs['in'] || 0;
                const switchOn = node.data?.isOn;
                newOutputs['out'] = switchOn ? inputVal : 0;
            }
            else if (type === 'led') {
                // Pass through? Usually LED drops voltage, but for logic, it just passes 0.
                // It consumes signal. Output is 0 (Ground-like) or undefined.
                newOutputs['out'] = 0; // Sink
            }
            else if (type === 'resistor') {
                // Pass through (ignoring resistance for digital logic)
                newOutputs['out'] = nodeState.inputs['in'] || 0;
            }
            else if (type === 'andGate') {
                const a = nodeState.inputs['a'] || 0;
                const b = nodeState.inputs['b'] || 0;
                newOutputs['out'] = (a && b) ? 1 : 0;
            }
            else if (type === 'orGate') {
                const a = nodeState.inputs['a'] || 0;
                const b = nodeState.inputs['b'] || 0;
                newOutputs['out'] = (a || b) ? 1 : 0;
            }
            else if (type === 'notGate') {
                const inp = nodeState.inputs['in'] || 0;
                newOutputs['out'] = inp ? 0 : 1;
            }

            // Check for changes
            Object.keys(newOutputs).forEach(key => {
                if (nodeState.outputs[key] !== newOutputs[key]) {
                    nodeState.outputs[key] = newOutputs[key];
                    hasChanges = true;
                }
            });
        });
    }

    // 3. Update Visuals (LEDs)
    const newNodes = nodes.map(node => {
        if (node.type === 'led') {
            const inputLevel = state[node.id]?.inputs['in'] || 0;
            // LED is ON if input is High
            if (!!node.data.isOn !== !!inputLevel) {
                return { ...node, data: { ...node.data, isOn: !!inputLevel } };
            }
        }
        return node;
    });

    const nodesChanged = JSON.stringify(newNodes) !== JSON.stringify(nodes);
    if (nodesChanged) {
        setNodes(newNodes);
    }
};
