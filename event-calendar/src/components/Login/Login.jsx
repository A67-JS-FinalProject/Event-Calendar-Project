import { loginUser } from "../../services/authenticationService";
import { useContext, useEffect, useState } from "react";
import { getUserByEmail } from "../../services/usersService.js";
import { AppContext } from "../../store/app.context.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userCrendentials, setUserCredentials] = useState(null);
  const { appState, setAppState } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Use state variables directly
    setUserCredentials({ email, password });
  };

  useEffect(() => {
    const handleLogin = async () => {
      const user = await loginUser(
        userCrendentials.email,
        userCrendentials.password
      );
      if (user === "Error") {
        return;
      }

      const userData = await getUserByEmail(
        userCrendentials.email,
        user.getIdToken()
      );

      setAppState({
        ...appState,
        user: userCrendentials.email,
        userData: userData,
        token: user,
      });
    };

    if (userCrendentials) {
      handleLogin();
    }
  }, [userCrendentials]);

  return (
    <form onSubmit={handleLogin}>
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
