import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderEvent from "./components/RenderEvent/ViewEvent";
import CreateAnEvent from "./components/CreateAEvent/CreateAnEvent";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home.jsx";
import LandingPage from "./components/Home/LadningPage.jsx";
import { AppContext } from "./store/app.context.js";
import { useState } from "react";
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
          <Route path="/home" element={<Home />} />
          <Route path="/create-an-event" element={<CreateAnEvent />} />
          <Route path="/event/:id" element={<RenderEvent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
