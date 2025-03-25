import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { getUserByEmail } from "../services/usersService"; // Import the function to get user data from MongoDB

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await getUserByEmail(email); // Fetch user data from MongoDB
    console.log("User fetched:", user); // Add logging
    if (user.isBlocked) {
      alert("Yor are blocked");
      return;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error(error.message);
  }
};

export const logout = () => {
  return signOut(auth);
};
