import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function Repository() {
  const { id } = useParams();

  const [repository, setRepository] =
    useState(null);

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadRepository = async () => {
      try {
        const repoResponse = await api.get(
          `/repositories/${id}`
        );

        const fileResponse = await api.get(
          `/files/repository/${id}`
        );

        setRepository(repoResponse.data);
        setFiles(fileResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadRepository();
  }, [id]);

  if (!repository) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 p-5">
        <Link
          to="/dashboard"
          className="text-blue-400"
        >
          ← Dashboard
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {repository.name}
            </h1>

            <span className="border border-gray-700 px-3 py-1 rounded-full text-sm">
              {repository.visibility}
            </span>
          </div>

          <p className="text-gray-400 mt-3">
            {repository.description}
          </p>

          <p className="text-sm text-gray-500 mt-3">
            Owner: {repository.owner?.username}
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <button className="bg-blue-600 px-4 py-2 rounded-lg">
            + New File
          </button>

          <button className="border border-gray-700 px-4 py-2 rounded-lg">
            Upload File
          </button>

          <button className="border border-gray-700 px-4 py-2 rounded-lg">
            History
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {files.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No files in this repository yet.
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file._id}
                className="p-4 border-b border-gray-800 hover:bg-gray-800"
              >
                📄 {file.path}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Repository;