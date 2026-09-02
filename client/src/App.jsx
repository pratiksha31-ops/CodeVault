import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateRepository from "./pages/CreateRepository";
import Repository from "./pages/Repository";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/create-repository"
          element={<CreateRepository />}
        />
        <Route
          path="/repository/:id"
          element={<Repository />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;