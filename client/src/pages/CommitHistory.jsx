import { useEffect, useState } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import api from "../services/api";

function CommitHistory() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const branchId = searchParams.get("branch");

  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCommits = async () => {
      try {
        setLoading(true);
        setError("");

        let endpoint = `/commits/repository/${id}`;

        // If a branch was selected, show commits only from that branch
        if (branchId) {
          endpoint += `?branch=${branchId}`;
        }

        const response = await api.get(endpoint);

        setCommits(response.commits || []);
      } catch (error) {
        console.error("Commit history error:", error);

        setError(
          error.message ||
            "Failed to load commit history"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCommits();
  }, [id, branchId]);

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

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Commit History
          </h1>

          <p className="text-gray-400 mt-2">
            View all changes made to this repository.
          </p>

          {branchId && (
            <p className="text-gray-500 text-sm mt-3">
              Showing commits for the selected branch.
            </p>
          )}

        </div>

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
              No commits found.
            </p>

            <Link
              to={`/repository/${id}`}
              className="inline-block mt-4 text-blue-400 hover:text-blue-300"
            >
              ← Return to Repository
            </Link>

          </div>
        )}

        {/* COMMITS */}
        <div className="space-y-4">

          {commits.map((commit) => (

            <Link
              key={commit._id}
              to={`/repository/${id}/commit/${commit._id}`}
              className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:bg-gray-800 transition"
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-6">

                <div className="flex-1">

                  {/* COMMIT MESSAGE */}
                  <h2 className="text-lg font-semibold text-white">
                    {commit.message}
                  </h2>

                  {/* FILE */}
                  <p className="text-gray-400 text-sm mt-3">
                    File:{" "}
                    <span className="text-blue-400">
                      {commit.file?.path ||
                        commit.file?.name ||
                        "Unknown file"}
                    </span>
                  </p>

                  {/* BRANCH */}
                  <p className="text-gray-400 text-sm mt-2">
                    Branch:{" "}
                    <span className="text-green-400">
                      {commit.branch?.name ||
                        "Unknown branch"}
                    </span>
                  </p>

                  {/* AUTHOR */}
                  <p className="text-gray-500 text-sm mt-2">
                    Author:{" "}
                    <span className="text-gray-300">
                      {commit.author?.username ||
                        commit.author?.name ||
                        "Unknown"}
                    </span>
                  </p>

                  {/* DATE */}
                  <p className="text-gray-500 text-sm mt-2">
                    {commit.createdAt
                      ? new Date(
                          commit.createdAt
                        ).toLocaleString()
                      : "Unknown date"}
                  </p>

                </div>

                {/* VIEW */}
                <span className="text-blue-400 text-sm whitespace-nowrap">
                  View →
                </span>

              </div>

            </Link>

          ))}

        </div>

      </main>

    </div>
  );
}

export default CommitHistory;