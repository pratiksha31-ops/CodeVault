import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Repositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const response = await api.get("/repositories");

        setRepositories(response.repositories || []);
      } catch (error) {
        console.error("Repositories error:", error);
        setError(error.message || "Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    loadRepositories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading repositories...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
      <nav className="border-b border-gray-800 px-8 py-5 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-2xl font-bold hover:text-blue-400"
        >
          CodeVault
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-gray-300 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            to="/profile"
            className="text-gray-300 hover:text-white"
          >
            Profile
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-8 py-10">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              My Repositories
            </h1>

            <p className="text-gray-400 mt-2">
              Manage and explore your CodeVault repositories.
            </p>
          </div>

          <Link
            to="/create-repository"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
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
        {repositories.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">

            <h2 className="text-xl font-semibold mb-2">
              No repositories yet
            </h2>

            <p className="text-gray-400 mb-6">
              Create your first repository to start storing your code.
            </p>

            <Link
              to="/create-repository"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
            >
              Create Repository
            </Link>

          </div>
        ) : (
          <div className="grid gap-4">

            {repositories.map((repo) => (
              <div
                key={repo._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition"
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

                    <div className="flex items-center gap-3 mt-4">

                      <span className="border border-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                        {repo.visibility}
                      </span>

                    </div>

                  </div>

                  <Link
                    to={`/repository/${repo._id}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Open →
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default Repositories;