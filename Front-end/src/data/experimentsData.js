export const experimentsData = {
    1: {
        id: 1,
        title: "Ohm's Law Experiment",
        aim: "To verify Ohm's Law and determine the resistance of a given wire.",
        components: [
            "Battery Eliminator",
            "Voltmeter",
            "Ammeter",
            "Rheostat",
            "Resistor (Unknown Resistance)",
            "Connecting Wires"
        ],
        procedure: [
            "Connect the circuit as per the circuit diagram.",
            "Adjust the rheostat to get a small reading in the ammeter and voltmeter.",
            "Note down the readings of Ammeter (I) and Voltmeter (V).",
            "Take at least 5 sets of readings by varying the rheostat.",
            "Plot a graph between V and I.",
            "Calculate the resistance R = V/I."
        ],
        quiz: [
            {
                question: "What is the relationship between Voltage and Current in Ohm's Law?",
                options: ["V ∝ I", "V ∝ 1/I", "V = I^2", "V = R/I"],
                answer: "V ∝ I"
            },
            {
                question: "The unit of Resistance is?",
                options: ["Ampere", "Volt", "Ohm", "Watt"],
                answer: "Ohm"
            },
            {
                question: "If V=10V and I=2A, what is R?",
                options: ["20 Ohm", "5 Ohm", "0.2 Ohm", "12 Ohm"],
                answer: "5 Ohm"
            },
            {
                question: "Ohm's law is applicable to?",
                options: ["Metals", "Semiconductors", "Insulators", "Superconductors"],
                answer: "Metals"
            },
            {
                question: "In V-I graph, the slope represents?",
                options: ["Current", "Voltage", "Resistance", "Power"],
                answer: "Resistance"
            },
            {
                question: "What remains constant in Ohm's law?",
                options: ["Temperature", "Voltage", "Current", "None"],
                answer: "Temperature"
            },
            {
                question: "Voltmeter is connected in?",
                options: ["Series", "Parallel", "Both", "None"],
                answer: "Parallel"
            },
            {
                question: "Ammeter is connected in?",
                options: ["Series", "Parallel", "Both", "None"],
                answer: "Series"
            },
            {
                question: "Unit of Current is?",
                options: ["Ohm", "Volt", "Ampere", "Joule"],
                answer: "Ampere"
            },
            {
                question: "Unit of Voltage is?",
                options: ["Watt", "Volt", "Newton", "Tesla"],
                answer: "Volt"
            }
        ]
    },
    2: {
        id: 2,
        title: "Logic Gates Simulation",
        aim: "To verify the truth tables of basic logic gates (AND, OR, NOT).",
        components: [
            "Breadboard",
            "LEDs",
            "Resistors",
            "IC 7408 (AND)",
            "IC 7432 (OR)",
            "IC 7404 (NOT)",
            "Connecting Wires",
            "5V Power Supply"
        ],
        procedure: [
            "Place the IC on the breadboard.",
            "Connect Pin 14 to VCC and Pin 7 to Ground.",
            "Connect inputs to the input pins of the gate.",
            "Connect the output pin to an LED with a series resistor.",
            "Apply different logic combinations (0 and 1) and observe the LED.",
            "Verify the truth table."
        ],
        quiz: [
            {
                question: "Which gate is known as the universal gate?",
                options: ["AND", "OR", "NAND", "NOT"],
                answer: "NAND"
            },
            {
                question: "Output of AND gate is 1 only when?",
                options: ["Both inputs are 0", "Both inputs are 1", "One input is 1", "None"],
                answer: "Both inputs are 1"
            },
            {
                question: "IC 7404 corresponds to which gate?",
                options: ["AND", "OR", "NOT", "NAND"],
                answer: "NOT"
            },
            {
                question: "Output of OR gate is 0 only when?",
                options: ["Both inputs are 1", "Both inputs are 0", "One input is 0", "None"],
                answer: "Both inputs are 0"
            },
            {
                question: "Inversion of 1 is?",
                options: ["0", "1", "High", "Positive"],
                answer: "0"
            },
            {
                question: "How many inputs does a NOT gate have?",
                options: ["1", "2", "3", "4"],
                answer: "1"
            },
            {
                question: "Boolean expression for AND gate is?",
                options: ["A+B", "A.B", "A'", "A-B"],
                answer: "A.B"
            },
            {
                question: "Boolean expression for OR gate is?",
                options: ["A+B", "A.B", "A'", "A/B"],
                answer: "A+B"
            },
            {
                question: "High voltage level corresponds to logic?",
                options: ["0", "1", "Unknown", "Floating"],
                answer: "1"
            },
            {
                question: "Low voltage level corresponds to logic?",
                options: ["0", "1", "High", "Positive"],
                answer: "0"
            }
        ]
    }
};
