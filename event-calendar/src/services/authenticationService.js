import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    getIdToken
} from "firebase/auth";
import { authObject } from '../config/firebaseConfig';

export const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(authObject, email, password);
};

export const loginUser = async (email, password) => {
    const user = await signInWithEmailAndPassword(authObject, email, password);
    return getIdToken(user);
};

export const logoutUser = () => {
    return signOut(authObject);
};


