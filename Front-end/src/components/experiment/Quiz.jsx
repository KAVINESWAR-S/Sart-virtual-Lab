import { useState } from "react";

const Quiz = ({ questions }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleOptionSelect = (questionIndex, option) => {
        if (submitted) return;
        setAnswers({
            ...answers,
            [questionIndex]: option,
        });
    };

    const handleSubmit = () => {
        let newScore = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.answer) {
                newScore += 1;
            }
        });
        setScore(newScore);
        setSubmitted(true);
    };

    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Quiz</h2>

            {!submitted ? (
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="font-semibold text-gray-800 mb-3">{index + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map((option, optIndex) => (
                                    <label
                                        key={optIndex}
                                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer border transition border-transparent hover:bg-gray-100 ${answers[index] === option ? "bg-blue-50 border-blue-200" : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`q-${index}`}
                                            value={option}
                                            checked={answers[index] === option}
                                            onChange={() => handleOptionSelect(index, option)}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < questions.length}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition ${Object.keys(answers).length < questions.length
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        Submit Quiz
                    </button>
                </div>
            ) : (
                <div className="text-center py-10">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h3>
                    <p className="text-xl text-gray-600 mb-6">
                        You scored <span className="text-blue-600 font-bold">{score}</span> out of <span className="text-gray-800">{questions.length}</span>
                    </p>

                    <div className="w-full h-4 bg-gray-200 rounded-full mb-8 overflow-hidden max-w-md mx-auto">
                        <div
                            className={`h-full ${score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${(score / questions.length) * 100}%` }}
                        ></div>
                    </div>

                    <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
