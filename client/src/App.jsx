import { BrowserRouter, Routes, Route } from "react-router-dom";
import Repositories from "./pages/Repositories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateRepository from "./pages/CreateRepository";
import Repository from "./pages/Repository";
import FileEditor from "./pages/FileEditor";
import CommitHistory from "./pages/CommitHistory";
import CommitDetails from "./pages/CommitDetails";
import Branches from "./pages/Branches";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/repository/:id/commit/:commitId"
          element={<CommitDetails />}
        />
        <Route
          path="/repository/:id/branches"
          element={<Branches />}
        />
        <Route
          path="/repository/:id/history"
          element={<CommitHistory />}
        />
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/repositories" element={<Repositories />} />

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/create-repository"
          element={<CreateRepository />}
        />

        <Route
          path="/repository/:id"
          element={<Repository />}
        />

        <Route
          path="/repository/:id/file/:fileId"
          element={<FileEditor />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;