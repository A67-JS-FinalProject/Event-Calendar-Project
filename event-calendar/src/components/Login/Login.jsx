import { loginUser } from "../../services/authenticationService";
import { useContext, useEffect, useState } from "react";
import { getUserByEmail } from "../../services/usersService.js";
import { AppContext } from "../../store/app.context.js";
import { useNavigate } from "react-router-dom";
import NavBarPublic from "../NavBarPublic/NavBarPublic.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userCredentials, setUserCredentials] = useState(null);
  const { appState, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserCredentials({ email, password });
  };

  useEffect(() => {
    const handleLogin = async () => {
      if (!userCredentials) return;

      const user = await loginUser(
        userCredentials.email,
        userCredentials.password
      );
      if (user === "Error") {
        return;
      }

      const userData = await getUserByEmail(
        userCredentials.email,
        user.getIdToken()
      );

      const newState = {
        user: userCredentials.email,
        userData: userData,
        token: user,
      };

      setAppState(newState);
      localStorage.setItem("appState", JSON.stringify(newState));

      navigate("/home"); // Redirect to home page
    };

    handleLogin();
  }, [userCredentials]);

  return (
    <>
      <NavBarPublic />
      <div className="flex justify-center items-center min-h-screen">
        <form
          className="flex flex-col p-4 w-80 bg-black shadow-md rounded"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-2 p-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-2 p-2 border rounded"
          />
          <button type="submit" className="p-2 bg-blue-500 text-black rounded">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
