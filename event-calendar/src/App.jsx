import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderEvent from "./components/RenderEvent/ViewEvent";
import CreateAnEvent from "./components/CreateAEvent/CreateAnEvent";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-an-event" element={<CreateAnEvent />} />
        <Route path="/event/:id" element={<RenderEvent />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
