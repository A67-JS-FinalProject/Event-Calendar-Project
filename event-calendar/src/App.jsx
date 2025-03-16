import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderEvent from "./components/RenderEvent/ViewEvent";
 import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound.jsx";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home.jsx";
import Profile from "./components/Profile/Profile.jsx";
import LandingPage from "./components/Home/LandingPage.jsx";
import { AppContext } from "./store/app.context.js";
import { useState } from "react";
import Authenticated from "./hoc/authenticated.jsx";
import Footer from "./components/Footer/Footer.jsx";
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminRoute from './hoc/adminRoute.jsx'; // Import AdminRoute

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
    token: null,
  });
  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Authenticated><Home /></Authenticated>} />
          <Route path="/events/:id" element={<RenderEvent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home/profile" element={<Authenticated><Profile /></Authenticated>} />
          <Route path="/dashboard" element={<Authenticated><UserDashboard /></Authenticated>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Footer />
    </AppContext.Provider>
  );
}

export default App;
