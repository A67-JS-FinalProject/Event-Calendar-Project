// filepath: d:\Final -project\Event-Calendar-Project\event-calendar\src\components\Register\Register.jsx
import { useState, useContext } from "react";
import { registerUser } from "../../services/authenticationService";
import { createUser } from "../../services/usersService";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../store/app.context";
import { getIdToken } from "firebase/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const { setAppState } = useContext(AppContext);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(email, password);
      console.log(user);

      const token = await getIdToken(user);

      setAppState({
        user: user.email,
        userData: { email, username },
        token: token,
      });

      const createdUser = await createUser(
        email,
        username,
        firstName,
        lastName,
        phoneNumber
      );
      if (!createdUser) {
        console.error("User creation failed");
        return;
      }

      navigate("/home");
      console.log(`Token: ${user}`);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="flex flex-col p-4 w-80 bg-black shadow-md rounded"
        onSubmit={handleRegister}
      >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-2 p-2 border rounded"
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="mb-2 p-2 border rounded"
        />
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="mb-2 p-2 border rounded"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="mb-2 p-2 border rounded"
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
