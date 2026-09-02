import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateRepository() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    visibility: "public",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/repositories",
        form
      );

      navigate(
        `/repository/${response.data.repository._id}`
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to create repository"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold">
          Create a New Repository
        </h1>

        <p className="text-gray-400 mt-2 mb-8">
          Create a new place to store and manage your code.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 p-8 rounded-2xl space-y-6"
        >
          <div>
            <label className="block mb-2">
              Repository Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="my-awesome-project"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your project"
              rows="4"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">
              Visibility
            </label>

            <select
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            >
              <option value="public">
                Public
              </option>

              <option value="private">
                Private
              </option>
            </select>
          </div>

          <button className="bg-blue-600 px-6 py-3 rounded-lg font-semibold">
            Create Repository
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRepository;