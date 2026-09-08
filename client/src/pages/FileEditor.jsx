import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function FileEditor() {
  const { id, fileId } = useParams();

  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [committing, setCommitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFile = async () => {
      try {
        const response = await api.get(`/files/${fileId}`);

        setFile(response.file);
        setContent(response.file.content || "");
      } catch (error) {
        console.error("Load file error:", error);
        setError(error.message || "Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [fileId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put(`/files/${fileId}`, {
        content,
      });

      setFile(response.file);
      setContent(response.file.content || "");

      setMessage("File saved successfully!");
    } catch (error) {
      console.error("Save file error:", error);
      setError(error.message || "Failed to save file");
    } finally {
      setSaving(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      setError("Please enter a commit message.");
      return;
    }

    try {
      setCommitting(true);
      setMessage("");
      setError("");

      // First save the latest code
      const fileResponse = await api.put(`/files/${fileId}`, {
        content,
      });

      setFile(fileResponse.file);
      setContent(fileResponse.file.content || "");

      // Then create commit
      await api.post("/commits", {
        repository: id,
        file: fileId,
        message: commitMessage.trim(),
      });

      setCommitMessage("");

      setMessage("Changes committed successfully!");
    } catch (error) {
      console.error("Commit error:", error);
      setError(error.message || "Failed to commit changes");
    } finally {
      setCommitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading file...
      </div>
    );
  }

  if (error && !file) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <p className="text-red-400">{error}</p>
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
      <main className="max-w-7xl mx-auto p-8">

        {/* FILE HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-2xl font-bold">
              {file?.name}
            </h1>

            <p className="text-gray-500 mt-1">
              {file?.path}
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || committing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-5 py-2 rounded-lg font-semibold"
          >
            {saving ? "Saving..." : "Save File"}
          </button>

        </div>

        {/* SUCCESS */}
        {message && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* CODE EDITOR */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">

          <div className="px-5 py-3 border-b border-gray-800 text-sm text-gray-400">
            {file?.name}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck="false"
            className="w-full min-h-[500px] bg-gray-950 text-gray-200 p-6 font-mono text-sm leading-6 outline-none resize-y"
          />

        </div>

        {/* COMMIT SECTION */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-2">
            Commit Changes
          </h2>

          <p className="text-gray-400 text-sm mb-4">
            Save this version of the file to the repository history.
          </p>

          <div className="flex gap-3">

            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="e.g. Add hello message"
              className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={handleCommit}
              disabled={committing || saving}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold"
            >
              {committing ? "Committing..." : "Commit Changes"}
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}

export default FileEditor;