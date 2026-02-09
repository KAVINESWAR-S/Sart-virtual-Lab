import { useNavigate } from "react-router-dom";
import "../Styles/ExperimentCard.css";

const ExperimentCard = ({ id, title, subject, status }) => {
  const navigate = useNavigate();

  const statusClassMap = {
    Completed: "status-completed",
    Pending: "status-pending",
    "Not Started": "status-not-started",
  };

  const handleClick = () => {
    navigate(`/experiment/${id}`);
  };

  return (
    <div className="experiment-card" onClick={handleClick}>
      <h2 className="experiment-card-title">{title}</h2>

      <p className="experiment-card-subject">{subject}</p>

      <span
        className={`experiment-card-badge ${statusClassMap[status] || ""}`}
      >
        {status}
      </span>
    </div>
  );
};

export default ExperimentCard;
