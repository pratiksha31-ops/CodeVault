import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function CommitDetails() {
  const { id, commitId } = useParams();
  const navigate = useNavigate();

  const [commit, setCommit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoring, setRestoring] = useState(false);

  // LOAD COMMIT
  useEffect(() => {
    const loadCommit = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/commits/${commitId}`
        );

        setCommit(response.commit);
      } catch (error) {
        console.error(
          "Commit details error:",
          error
        );

        setError(
          error.message ||
            "Failed to load commit"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCommit();
  }, [commitId]);

  // RESTORE VERSION
  const handleRestore = async () => {
    if (!commit) return;

    const confirmRestore = window.confirm(
      "Are you sure you want to restore this version? The current file content will be replaced."
    );

    if (!confirmRestore) {
      return;
    }

    try {
      setRestoring(true);
      setError("");

      await api.post(
        `/files/${commit.file._id}/restore`,
        {
          commitId: commit._id,
        }
      );

      alert(
        "File version restored successfully!"
      );

      navigate(
        `/repository/${id}/file/${commit.file._id}`
      );
    } catch (error) {
      console.error(
        "Restore error:",
        error
      );

      setError(
        error.message ||
          "Failed to restore version"
      );
    } finally {
      setRestoring(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading commit...
        </p>
      </div>
    );
  }

  // ERROR
  if (error && !commit) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">

        <nav className="border-b border-gray-800 px-8 py-5">
          <Link
            to={`/repository/${id}/history`}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to History
          </Link>
        </nav>

        <main className="max-w-6xl mx-auto p-8">

          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-5 rounded-xl">
            {error}
          </div>

        </main>

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
            to={`/repository/${id}`}
            className="text-gray-300 hover:text-white"
          >
            Repository
          </Link>

          <Link
            to={`/repository/${id}/history`}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to History
          </Link>

        </div>

      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-6">
          Commit Details
        </h1>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* COMMIT INFORMATION */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

          <h2 className="text-2xl font-semibold">
            {commit.message ||
              "No commit message"}
          </h2>

          <div className="text-gray-400 mt-5 space-y-3">

            {/* FILE */}
            <p>
              File:{" "}
              <span className="text-blue-400">
                {commit.file?.path ||
                  commit.file?.name ||
                  "Unknown file"}
              </span>
            </p>

            {/* BRANCH */}
            <p>
              Branch:{" "}
              <span className="text-green-400">
                {commit.branch?.name ||
                  "Unknown branch"}
              </span>
            </p>

            {/* AUTHOR */}
            <p>
              Author:{" "}
              <span className="text-gray-300">
                {commit.author?.username ||
                  commit.author?.name ||
                  "Unknown"}
              </span>
            </p>

            {/* DATE */}
            <p>
              Date:{" "}
              {commit.createdAt
                ? new Date(
                    commit.createdAt
                  ).toLocaleString()
                : "Unknown date"}
            </p>

            {/* COMMIT ID */}
            <p className="break-all">
              Commit ID:{" "}
              <span className="text-gray-500">
                {commit._id}
              </span>
            </p>

          </div>

          {/* RESTORE */}
          <button
            onClick={handleRestore}
            disabled={restoring}
            className="mt-6 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-5 py-3 rounded-lg font-semibold"
          >
            {restoring
              ? "Restoring..."
              : "Restore This Version"}
          </button>

        </div>

        {/* CODE */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Code at this Version
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                This is the exact code stored in this commit.
              </p>
            </div>

          </div>

          <pre className="bg-gray-950 p-6 overflow-x-auto text-sm text-gray-300 font-mono min-h-[400px] whitespace-pre-wrap">
            {commit.content ||
              "// No code stored in this commit"}
          </pre>

        </div>

      </main>

    </div>
  );
}

export default CommitDetails;