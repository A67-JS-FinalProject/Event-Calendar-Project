// filepath: d:\Final -project\Event-Calendar-Project\event-calendar\src\components\Register\Register.jsx
import { useState, useContext } from "react";
import { registerUser } from "../../services/authenticationService";
import { createUser } from "../../services/usersService";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../store/app.context";
import { getIdToken } from "firebase/auth";
import NavBarPublic from "../NavBarPublic/NavBarPublic.jsx";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const validateFields = () => {
    let valid = true;
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }
    if (!username) {
      newErrors.username = "Username is required."
      valid = false;
    }
    else if (!username || username.length < 3 || username.length > 30) {
      newErrors.username = "Username must be between 3 and 30 characters.";
      valid = false;
    }
    if (!firstName || firstName.length < 1 || firstName.length > 30) {
      newErrors.firstName = "First name must be between 1 and 30 characters.";
      valid = false;
    }
    if (!lastName || lastName.length < 1 || lastName.length > 30) {
      newErrors.lastName = "Last name must be between 1 and 30 characters.";
      valid = false;
    }
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must have 10 digits.";
      valid = false;
    }
    if (!password || password.length < 8 || password.length > 30) {
      newErrors.password = "Password must be between 8 and 30 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const user = await registerUser(email, password);
      const token = await getIdToken(user);

      setAppState({
        user: user.email,
        userData: { email, username },
        token,
      });

      const createdUser = await createUser(email, username, firstName, lastName, phoneNumber);
      if (!createdUser) throw new Error("User creation failed.");

      navigate("/home");
      console.log(`User registered successfully: ${user.email}`);
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <>
      <NavBarPublic />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form className="flex flex-col p-6 w-96 bg-white shadow-md rounded-lg" onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          {Object.values(errors).map((err, index) => (
            <p key={index} className="text-red-500 text-sm">{err}</p>
          ))}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 border rounded" />
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="mb-2 p-2 border rounded" />
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="mb-2 p-2 border rounded" />
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="mb-2 p-2 border rounded" />
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" className="mb-2 p-2 border rounded" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mb-2 p-2 border rounded" />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;
