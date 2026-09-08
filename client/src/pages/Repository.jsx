import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function Repository() {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showNewFile, setShowNewFile] = useState(false);

  const [fileForm, setFileForm] = useState({
    name: "",
    path: "",
    content: "",
  });

  const loadRepository = async () => {
    try {
      setLoading(true);
      setError("");

      const repoResponse = await api.get(`/repositories/${id}`);
      const fileResponse = await api.get(`/files/repository/${id}`);

      setRepository(repoResponse.repository);
      setFiles(fileResponse.files || []);
    } catch (error) {
      console.error("Repository error:", error);
      setError(error.message || "Failed to load repository");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepository();
  }, [id]);

  const handleFileChange = (e) => {
    setFileForm({
      ...fileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateFile = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/files", {
        repository: id,
        name: fileForm.name,
        path: fileForm.path || fileForm.name,
        content: fileForm.content,
      });

      setFileForm({
        name: "",
        path: "",
        content: "",
      });

      setShowNewFile(false);

      await loadRepository();
    } catch (error) {
      console.error("Create file error:", error);
      setError(error.message || "Failed to create file");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading repository...
      </div>
    );
  }

  if (error && !repository) {
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
          to="/repositories"
          className="text-blue-400 hover:text-blue-300"
        >
          ← Back to Repositories
        </Link>
      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto p-8">

        {/* REPOSITORY HEADER */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

          <div className="flex items-start justify-between">

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">
                  {repository.name}
                </h1>

                <span className="px-3 py-1 text-xs rounded-full border border-gray-700 text-gray-400">
                  {repository.visibility}
                </span>
              </div>

              <p className="text-gray-400 mt-3">
                {repository.description || "No description provided."}
              </p>

              <p className="text-gray-500 text-sm mt-3">
                Owner:{" "}
                {repository.owner?.username ||
                  repository.owner?.name ||
                  "Unknown"}
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => setShowNewFile(!showNewFile)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
              >
                + New File
              </button>

              <button
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Upload File
              </button>

              {/* HISTORY BUTTON */}
              <Link
                to={`/repository/${id}/history`}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                History
              </Link>

            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* NEW FILE FORM */}
        {showNewFile && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

            <h2 className="text-xl font-semibold mb-5">
              Create New File
            </h2>

            <form onSubmit={handleCreateFile} className="space-y-4">

              <div>
                <label className="block text-sm mb-2">
                  File Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={fileForm.name}
                  onChange={handleFileChange}
                  placeholder="hello.js"
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  File Path
                </label>

                <input
                  type="text"
                  name="path"
                  value={fileForm.path}
                  onChange={handleFileChange}
                  placeholder="src/hello.js"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  File Content
                </label>

                <textarea
                  name="content"
                  value={fileForm.content}
                  onChange={handleFileChange}
                  placeholder='console.log("Hello from CodeVault!");'
                  rows="8"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex gap-3">

                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold"
                >
                  Create File
                </button>

                <button
                  type="button"
                  onClick={() => setShowNewFile(false)}
                  className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* FILES */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold">
              Files
            </h2>
          </div>

          {files.length === 0 ? (
            <div className="p-8 text-center">

              <p className="text-gray-400 mb-4">
                No files in this repository yet.
              </p>

              <button
                onClick={() => setShowNewFile(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                + Create your first file
              </button>

            </div>
          ) : (
            <div>

              {files.map((file) => (
                <Link
                  key={file._id}
                  to={`/repository/${id}/file/${file._id}`}
                  className="px-5 py-4 border-b border-gray-800 hover:bg-gray-800 flex items-center justify-between block"
                >
                  <div className="flex items-center gap-3">

                    <span>📄</span>

                    <span className="text-blue-400 hover:text-blue-300">
                      {file.path}
                    </span>

                  </div>

                  <span className="text-gray-500 text-sm">
                    File
                  </span>

                </Link>
              ))}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default Repository;