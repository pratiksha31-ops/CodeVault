import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Branches() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [branchName, setBranchName] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // LOAD BRANCHES
  const loadBranches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/branches/repository/${id}`
      );

      setBranches(response.branches || []);
    } catch (error) {
      console.error(
        "Load branches error:",
        error
      );

      setError(
        error.message ||
          "Failed to load branches"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, [id]);

  // CREATE BRANCH
  const handleCreateBranch = async (e) => {
    e.preventDefault();

    if (!branchName.trim()) {
      setError("Please enter a branch name.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setMessage("");

      await api.post("/branches", {
        name: branchName.trim(),
        repository: id,
      });

      setBranchName("");

      setMessage(
        "Branch created successfully!"
      );

      await loadBranches();
    } catch (error) {
      console.error(
        "Create branch error:",
        error
      );

      setError(
        error.message ||
          "Failed to create branch"
      );
    } finally {
      setCreating(false);
    }
  };

  // DELETE BRANCH
  const handleDeleteBranch = async (branchId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this branch?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(branchId);
      setError("");
      setMessage("");

      await api.delete(
        `/branches/${branchId}`
      );

      setMessage(
        "Branch deleted successfully!"
      );

      await loadBranches();
    } catch (error) {
      console.error(
        "Delete branch error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete branch"
      );
    } finally {
      setDeleting("");
    }
  };

  // SWITCH TO BRANCH
  const handleSwitchBranch = (branchId) => {
    navigate(
      `/repository/${id}?branch=${branchId}`
    );
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading branches...
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
          Branches
        </h1>

        <p className="text-gray-400 mb-8">
          Create, manage and switch between
          repository branches.
        </p>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* CREATE BRANCH */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

          <h2 className="text-xl font-semibold mb-2">
            Create New Branch
          </h2>

          <p className="text-gray-500 text-sm mb-4">
            Create a separate branch for
            developing new features.
          </p>

          <form
            onSubmit={handleCreateBranch}
            className="flex gap-3"
          >

            <input
              type="text"
              value={branchName}
              onChange={(e) =>
                setBranchName(e.target.value)
              }
              placeholder="e.g. feature-login"
              disabled={creating}
              className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold"
            >
              {creating
                ? "Creating..."
                : "Create Branch"}
            </button>

          </form>

        </div>

        {/* BRANCH LIST */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Repository Branches
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {branches.length}{" "}
                {branches.length === 1
                  ? "branch"
                  : "branches"}
              </p>
            </div>

          </div>

          {branches.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No branches found.
            </div>
          ) : (
            <div>

              {branches.map((branch) => (
                <div
                  key={branch._id}
                  className="px-6 py-5 border-b border-gray-800 last:border-b-0 flex items-center justify-between gap-6"
                >

                  {/* BRANCH INFORMATION */}
                  <div className="min-w-0">

                    <div className="flex items-center gap-3 flex-wrap">

                      <span className="text-xl">
                        🌿
                      </span>

                      <span className="text-lg text-white font-semibold">
                        {branch.name}
                      </span>

                      {branch.isDefault && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                          Default
                        </span>
                      )}

                    </div>

                    <p className="text-gray-500 text-sm mt-2">
                      Created by{" "}
                      <span className="text-gray-400">
                        {branch.createdBy?.username ||
                          branch.createdBy?.name ||
                          "Unknown"}
                      </span>
                    </p>

                    {branch.createdAt && (
                      <p className="text-gray-600 text-xs mt-1">
                        Created{" "}
                        {new Date(
                          branch.createdAt
                        ).toLocaleString()}
                      </p>
                    )}

                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3 shrink-0">

                    <button
                      onClick={() =>
                        handleSwitchBranch(
                          branch._id
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Switch
                    </button>

                    {!branch.isDefault && (
                      <button
                        onClick={() =>
                          handleDeleteBranch(
                            branch._id
                          )
                        }
                        disabled={
                          deleting === branch._id
                        }
                        className="border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        {deleting === branch._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Branches;