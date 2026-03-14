import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoleSelection from "./pages/RoleSelection";
import MockInterview from "./pages/MockInterview";
import Feedback from "./pages/Feedback";
import Progress from "./pages/Progress";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/role" element={<RoleSelection />} />

        <Route path="/interview" element={<MockInterview />} />

        <Route path="/feedback" element={<Feedback />} />

        <Route path="/progress" element={<Progress />} />

      </Routes>
    </Router>
  );
}

export default App;