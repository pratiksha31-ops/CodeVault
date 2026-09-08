import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function Repository() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [repository, setRepository] = useState(null);
  const [files, setFiles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [loading, setLoading] = useState(true);
  const [branchLoading, setBranchLoading] = useState(false);
  const [error, setError] = useState("");

  const [showNewFile, setShowNewFile] = useState(false);

  const [fileForm, setFileForm] = useState({
    name: "",
    path: "",
    content: "",
  });

  // LOAD FILES FOR A BRANCH
  const loadBranchFiles = async (branchId) => {
    try {
      setBranchLoading(true);
      setError("");

      const response = await api.get(
        `/files/repository/${id}?branch=${branchId}`
      );

      setFiles(response.files || []);
    } catch (error) {
      console.error(
        "Load branch files error:",
        error
      );

      setError(
        error.message ||
          "Failed to load branch files"
      );

      setFiles([]);
    } finally {
      setBranchLoading(false);
    }
  };

  // LOAD REPOSITORY
  const loadRepository = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Get repository
      const repoResponse = await api.get(
        `/repositories/${id}`
      );

      // 2. Get all branches
      const branchResponse = await api.get(
        `/branches/repository/${id}`
      );

      const loadedBranches =
        branchResponse.branches || [];

      setRepository(
        repoResponse.repository
      );

      setBranches(loadedBranches);

      // 3. Get branch from URL
      const branchFromUrl =
        searchParams.get("branch");

      let branchToSelect = null;

      if (branchFromUrl) {
        branchToSelect =
          loadedBranches.find(
            (branch) =>
              branch._id === branchFromUrl
          );
      }

      // 4. If URL branch doesn't exist,
      // use default branch
      if (!branchToSelect) {
        branchToSelect =
          loadedBranches.find(
            (branch) =>
              branch.isDefault === true
          ) || loadedBranches[0];
      }

      // 5. Select branch
      if (branchToSelect) {
        setSelectedBranch(
          branchToSelect._id
        );

        // Keep URL synchronized
        if (
          searchParams.get("branch") !==
          branchToSelect._id
        ) {
          setSearchParams({
            branch: branchToSelect._id,
          });
        }

        // 6. Load files for selected branch
        await loadBranchFiles(
          branchToSelect._id
        );
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error(
        "Repository error:",
        error
      );

      setError(
        error.message ||
          "Failed to load repository"
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD ON PAGE OPEN
  useEffect(() => {
    loadRepository();
  }, [id]);

  // CHANGE BRANCH
  const handleBranchChange = async (e) => {
    const branchId = e.target.value;

    setSelectedBranch(branchId);

    // Update URL
    setSearchParams({
      branch: branchId,
    });

    // Load files
    await loadBranchFiles(branchId);
  };

  // FORM INPUT CHANGE
  const handleFileChange = (e) => {
    setFileForm({
      ...fileForm,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE FILE
  const handleCreateFile = async (e) => {
    e.preventDefault();

    if (!selectedBranch) {
      setError(
        "Please select a branch first."
      );
      return;
    }

    if (!fileForm.name.trim()) {
      setError("Please enter a file name.");
      return;
    }

    try {
      setError("");

      await api.post("/files", {
        repository: id,
        branch: selectedBranch,
        name: fileForm.name.trim(),
        path:
          fileForm.path.trim() ||
          fileForm.name.trim(),
        content: fileForm.content,
      });

      setFileForm({
        name: "",
        path: "",
        content: "",
      });

      setShowNewFile(false);

      // Reload current branch files
      await loadBranchFiles(
        selectedBranch
      );
    } catch (error) {
      console.error(
        "Create file error:",
        error
      );

      setError(
        error.message ||
          "Failed to create file"
      );
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading repository...
        </p>
      </div>
    );
  }

  // ERROR
  if (error && !repository) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }

  const currentBranch =
    branches.find(
      (branch) =>
        branch._id === selectedBranch
    );

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
                {repository.description ||
                  "No description provided."}
              </p>

              <p className="text-gray-500 text-sm mt-3">
                Owner:{" "}
                {repository.owner?.username ||
                  repository.owner?.name ||
                  "Unknown"}
              </p>

              {/* BRANCH SELECTOR */}
              <div className="mt-5 flex items-center gap-3">

                <label className="text-gray-400">
                  Branch:
                </label>

                {branches.length > 0 ? (
                  <select
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    disabled={branchLoading}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  >
                    {branches.map(
                      (branch) => (
                        <option
                          key={branch._id}
                          value={branch._id}
                        >
                          {branch.name}
                          {branch.isDefault
                            ? " (default)"
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <span className="text-gray-500">
                    No branches available
                  </span>
                )}

              </div>

              {/* CURRENT BRANCH */}
              {currentBranch && (
                <p className="text-gray-500 text-sm mt-3">
                  Currently viewing:{" "}
                  <span className="text-green-400">
                    {currentBranch.name}
                  </span>
                </p>
              )}

            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 flex-wrap justify-end">

              <Link
                to={`/repository/${id}/branches`}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Branches
              </Link>

              <button
                onClick={() =>
                  setShowNewFile(
                    !showNewFile
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
              >
                + New File
              </button>

              <button
                disabled
                className="bg-gray-800 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
              >
                Upload File
              </button>

              <Link
                to={`/repository/${id}/history?branch=${selectedBranch}`}
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

        {/* CREATE FILE FORM */}
        {showNewFile && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

            <h2 className="text-xl font-semibold mb-2">
              Create New File
            </h2>

            <p className="text-gray-400 text-sm mb-5">
              File will be created in branch:{" "}
              <span className="text-blue-400">
                {currentBranch?.name ||
                  "Unknown"}
              </span>
            </p>

            <form
              onSubmit={handleCreateFile}
              className="space-y-4"
            >

              <div>

                <label className="block text-sm mb-2">
                  File Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={fileForm.name}
                  onChange={
                    handleFileChange
                  }
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
                  onChange={
                    handleFileChange
                  }
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
                  onChange={
                    handleFileChange
                  }
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
                  onClick={() =>
                    setShowNewFile(false)
                  }
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

          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Files
              </h2>

              {currentBranch && (
                <p className="text-gray-500 text-sm mt-1">
                  Files in{" "}
                  <span className="text-blue-400">
                    {currentBranch.name}
                  </span>
                </p>
              )}

            </div>

            <span className="text-sm text-gray-500">
              {files.length}{" "}
              {files.length === 1
                ? "file"
                : "files"}
            </span>

          </div>

          {branchLoading ? (
            <div className="p-8 text-center text-gray-400">
              Loading branch files...
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center">

              <p className="text-gray-400 mb-4">
                No files in this branch yet.
              </p>

              <button
                onClick={() =>
                  setShowNewFile(true)
                }
                className="text-blue-400 hover:text-blue-300"
              >
                + Create a file in{" "}
                {currentBranch?.name ||
                  "this branch"}
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

                    <div>

                      <span className="text-blue-400 hover:text-blue-300">
                        {file.path}
                      </span>

                      {file.name &&
                        file.name !==
                          file.path && (
                          <p className="text-gray-500 text-xs mt-1">
                            {file.name}
                          </p>
                        )}

                    </div>

                  </div>

                  <span className="text-gray-500 text-sm">
                    {file.branch?.name ||
                      currentBranch?.name ||
                      "File"}
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