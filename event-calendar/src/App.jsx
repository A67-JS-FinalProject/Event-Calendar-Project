import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderEvent from "./components/RenderEvent/ViewEvent";
import CreateAnEvent from "./components/CreateAEvent/CreateAnEvent";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound.jsx";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home.jsx";
import LandingPage from "./components/Home/LandingPage.jsx";
import { AppContext } from "./store/app.context.js";
import { useState } from "react";
import Authenticated from "./hoc/authenticated.jsx";
import Footer from "./components/Footer/Footer.jsx";
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
          <Route path="/create-an-event" element={<CreateAnEvent />} />
          <Route path="/event/:id" element={<RenderEvent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Footer />
    </AppContext.Provider>
  );
}

export default App;
