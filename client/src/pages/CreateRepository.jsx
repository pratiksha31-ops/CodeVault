import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function CreateRepository() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    visibility: "public",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/repositories", form);

      console.log("Repository created:", response);

      navigate("/repositories");
    } catch (error) {
      console.error("Create repository error:", error);

      setError(error.message || "Failed to create repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 p-5">
        <Link
          to="/dashboard"
          className="text-blue-400 hover:text-blue-300"
        >
          ← Dashboard
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto p-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">
            Create a New Repository
          </h1>

          <p className="text-gray-400 mb-8">
            Create a repository to store and manage your code.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Repository Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="my-project"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Describe your project..."
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Visibility
              </label>

              <select
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-3 rounded-lg font-semibold"
            >
              {loading ? "Creating..." : "Create Repository"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateRepository;