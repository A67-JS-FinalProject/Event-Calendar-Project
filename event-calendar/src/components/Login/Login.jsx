import { loginUser } from "../../services/authenticationService";
import { useContext, useEffect, useState } from "react";
import { getUserByEmail } from "../../services/usersService.js";
import { AppContext } from "../../store/app.context.js";
import { useNavigate } from "react-router-dom";

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

      setAppState({
        ...appState,
        user: userCredentials.email,
        userData: userData,
        token: user,
      });

      navigate("/home"); // Redirect to home page
    };

    handleLogin();
  }, [userCredentials]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
