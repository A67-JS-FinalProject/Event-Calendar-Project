import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="home">
      <h2>Landing Page</h2>
      <nav>
        <ul>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default LandingPage;
