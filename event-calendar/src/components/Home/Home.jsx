import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <h2>Home</h2>
      <nav>
        <ul>
          <li>
            <Link to="/create-an-event">Create An Event</Link>
          </li>
          <li>
            <Link to="/event/67c9de56ff7fc07b94f36e96">View Event</Link>
          </li>
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

export default Home;
