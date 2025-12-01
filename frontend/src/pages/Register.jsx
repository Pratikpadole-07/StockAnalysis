import React, { useState, useEffect } from "react";
import { registerUser } from "../api/api";
import { Link } from "react-router-dom";

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/dashboard";
    }
  }, []);

  const submit = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      alert("🎉 Registration successful!");
      window.location.href = "/login";
    } catch {
      alert("❌ Registration failed, please try again!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-gray-100 dark:bg-black dark:text-white transition-colors duration-500">

      <div className="w-full max-w-md p-8 rounded-2xl
        bg-white/10 backdrop-blur-xl shadow-2xl
        border border-gray-300 dark:border-gray-700 animate-fadeIn">

        <h2 className="text-3xl font-extrabold mb-2 text-center">
          Create Account ✨
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Join the Smart Stock Trading Community
        </p>

        {/* Name */}
        <div className="relative mb-6">
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 pt-5 bg-gray-200 dark:bg-gray-800
            rounded-lg text-black dark:text-white
            focus:ring-2 focus:ring-yellow-500 outline-none peer"
          />
          <label className="absolute left-3 top-2 text-gray-600 dark:text-gray-400
            text-sm transition-transform
            peer-focus:-translate-y-2 peer-focus:text-xs peer-focus:text-yellow-500
            peer-valid:-translate-y-2 peer-valid:text-xs">
            Full Name
          </label>
        </div>

        {/* Email */}
        <div className="relative mb-6">
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pt-5 bg-gray-200 dark:bg-gray-800
            rounded-lg text-black dark:text-white
            focus:ring-2 focus:ring-yellow-500 outline-none peer"
          />
          <label className="absolute left-3 top-2 text-gray-600 dark:text-gray-400
            text-sm transition-transform
            peer-focus:-translate-y-2 peer-focus:text-xs peer-focus:text-yellow-500
            peer-valid:-translate-y-2 peer-valid:text-xs">
            Email
          </label>
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pt-5 bg-gray-200 dark:bg-gray-800
            rounded-lg text-black dark:text-white
            focus:ring-2 focus:ring-yellow-500 outline-none peer"
          />
          <label className="absolute left-3 top-2 text-gray-600 dark:text-gray-400
            text-sm transition-transform
            peer-focus:-translate-y-2 peer-focus:text-xs peer-focus:text-yellow-500
            peer-valid:-translate-y-2 peer-valid:text-xs">
            Password
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold
          bg-yellow-500 hover:bg-yellow-600 text-black
          transition-all shadow-md disabled:bg-gray-600
          disabled:cursor-not-allowed">
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
