import Header from "../components/Header";
import ExperimentCard from "../components/ExperimentCard";

const StudentDashboard = () => {

  const experiments = [
    {
      id: 1,
      title: "Ohm's Law Experiment",
      subject: "ECE",
      status: "Completed"
    },
    {
      id: 2,
      title: "Logic Gates Simulation",
      subject: "ECE",
      status: "Pending"
    },
    {
      id: 3,
      title: "Resistor Color Code",
      subject: "EEE",
      status: "Not Started"
    },
    {
      id: 4,
      title: "Kirchhoff's Law",
      subject: "Physics",
      status: "Completed"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <Header />

      {/* Body */}
      <div className="p-6">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Available Experiments
        </h2>

        {/* Experiment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {experiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              id={exp.id}
              title={exp.title}
              subject={exp.subject}
              status={exp.status}
            />
          ))}

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
