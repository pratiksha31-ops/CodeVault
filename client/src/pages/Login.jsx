import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800">

        <h1 className="text-3xl font-bold mb-2">
          Welcome to CodeVault
        </h1>

        <p className="text-gray-400 mb-6">
          Login to manage your repositories and code.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-gray-400 mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;