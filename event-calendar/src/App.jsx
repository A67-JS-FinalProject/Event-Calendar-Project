import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderEvent from "./components/RenderEvent/ViewEvent";
import CreateAnEvent from "./components/CreateAEvent/CreateAnEvent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-an-event" element={<CreateAnEvent />} />
        <Route path="/event/:id" element={<RenderEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
