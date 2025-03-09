import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css"; 

function Navbar() {
  const location = useLocation(); // Get current path
  const navigate = useNavigate(); // For logout navigation

  
  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/"); // Redirect to login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass-navbar px-3">
      <Link className="navbar-brand" to="/dashboard">💰 Finance Manager</Link>
      <button 
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
