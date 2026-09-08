import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [repositories, setRepositories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        const response = await api.get("/repositories");

        setRepositories(response.repositories || []);
      } catch (error) {
        console.error("Dashboard error:", error);

        if (
          error.message === "Not authorized, no token" ||
          error.message === "Not authorized, token failed"
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }

        setError(error.message || "Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
      <nav className="border-b border-gray-800 px-8 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          CodeVault
        </h1>

        <div className="flex items-center gap-6">
          <Link
            to="/profile"
            className="text-gray-300 hover:text-white"
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-8 py-10">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h2 className="text-4xl font-bold">
              Welcome, {user?.name || user?.username || "User"} 👋
            </h2>

            <p className="text-gray-400 mt-3 text-lg">
              Manage your repositories and code.
            </p>
          </div>

          <Link
            to="/create-repository"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
          >
            + New Repository
          </Link>

        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* REPOSITORIES */}
        <section>

          <h3 className="text-2xl font-semibold mb-5">
            Your Repositories
          </h3>

          {repositories.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">

              <p className="text-gray-400 mb-5">
                You don't have any repositories yet.
              </p>

              <Link
                to="/create-repository"
                className="inline-block bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
              >
                Create Your First Repository
              </Link>

            </div>
          ) : (
            <div className="grid gap-4">

              {repositories.map((repo) => (
                <div
                  key={repo._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700"
                >

                  <div className="flex items-start justify-between">

                    <div>
                      <Link
                        to={`/repository/${repo._id}`}
                        className="text-xl font-semibold text-blue-400 hover:text-blue-300"
                      >
                        {repo.name}
                      </Link>

                      <p className="text-gray-400 mt-2">
                        {repo.description || "No description"}
                      </p>

                      <div className="flex gap-3 mt-4">

                        <span className="border border-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                          {repo.visibility}
                        </span>

                      </div>
                    </div>

                    <Link
                      to={`/repository/${repo._id}`}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Open →
                    </Link>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Dashboard;