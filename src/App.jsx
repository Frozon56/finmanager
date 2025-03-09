import { Routes, Route } from "react-router-dom"; // ✅ Only import Routes and Route
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SetAvatar from "./pages/Avatar/setAvatar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
