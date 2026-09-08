import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function CommitHistory() {
  const { id } = useParams();

  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCommits = async () => {
      try {
        const response = await api.get(`/commits/repository/${id}`);

        setCommits(response.commits || []);
      } catch (error) {
        console.error("Commit history error:", error);
        setError(error.message || "Failed to load commit history");
      } finally {
        setLoading(false);
      }
    };

    loadCommits();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading commit history...
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

        <Link
          to={`/repository/${id}`}
          className="text-blue-400 hover:text-blue-300"
        >
          ← Back to Repository
        </Link>
      </nav>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-2">
          Commit History
        </h1>

        <p className="text-gray-400 mb-8">
          View all changes made to this repository.
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* NO COMMITS */}
        {commits.length === 0 && !error && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">
              No commits found in this repository.
            </p>
          </div>
        )}

        {/* COMMITS */}
        <div className="space-y-4">

          {commits.map((commit) => (
            <div
              key={commit._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {commit.message}
                  </h2>

                  <p className="text-gray-400 text-sm mt-2">
                    File:{" "}
                    <span className="text-blue-400">
                      {commit.file?.path || "Unknown file"}
                    </span>
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Author:{" "}
                    {commit.author?.username ||
                      commit.author?.name ||
                      "Unknown"}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(commit.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-xs text-gray-600">
                  {commit._id}
                </div>

              </div>

            </div>
          ))}

        </div>

      </main>
    </div>
  );
}

export default CommitHistory;