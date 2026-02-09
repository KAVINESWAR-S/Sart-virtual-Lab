import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import ExperimentPage from "./pages/ExperimentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/experiment/:id" element={<ExperimentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
