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
  const [ phoneNumber, setPhoneNumber] = useState("");
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

      const createdUser = await createUser(email, username, firstName, lastName, phoneNumber);
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
    <form onSubmit={handleRegister}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="FirstName"
      />
       <input
        type="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="LastName"
      />
      <input
        type="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="PhoneNumber"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
