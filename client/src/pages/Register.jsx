import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

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
        "/auth/register",
        form
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-2">
          Create CodeVault Account
        </h1>

        <p className="text-gray-400 mb-6">
          Start managing your code today.
        </p>

        {error && (
          <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          />

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold">
            Create Account
          </button>
        </form>

        <p className="text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;