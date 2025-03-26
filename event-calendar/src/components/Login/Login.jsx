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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <form
          className="flex flex-col p-8 w-full max-w-md bg-white shadow-lg rounded-xl border border-gray-100"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-[#DA4735]">Welcome Back</h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA4735] focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA4735] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="mt-6 p-3 bg-[#DA4735] text-white rounded-lg hover:bg-[#c23d2d] focus:outline-none focus:ring-2 focus:ring-[#DA4735] focus:ring-opacity-50 transition-all duration-200 font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;