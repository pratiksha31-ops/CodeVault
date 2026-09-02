import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [repositories, setRepositories] =
    useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await api.get(
          "/repositories"
        );

        setRepositories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 p-5 flex justify-between">
        <h1 className="text-xl font-bold">
          CodeVault
        </h1>

        <div className="flex gap-4">
          <Link
            to="/profile"
            className="text-gray-300"
          >
            Profile
          </Link>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="text-red-400"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Welcome, {user?.name} 👋
            </h2>

            <p className="text-gray-400 mt-2">
              Manage your repositories and code.
            </p>
          </div>

          <Link
            to="/create-repository"
            className="bg-blue-600 px-5 py-3 rounded-lg"
          >
            + New Repository
          </Link>
        </div>

        <h3 className="text-xl font-semibold mb-4">
          Your Repositories
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          {repositories.map((repo) => (
            <Link
              key={repo._id}
              to={`/repository/${repo._id}`}
              className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-blue-500"
            >
              <h4 className="text-xl font-semibold text-blue-400">
                {repo.name}
              </h4>

              <p className="text-gray-400 mt-2">
                {repo.description ||
                  "No description"}
              </p>

              <p className="text-sm text-gray-500 mt-4">
                {repo.visibility}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;