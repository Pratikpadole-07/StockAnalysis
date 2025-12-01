import React, { useState, useEffect } from "react";
import { loginUser } from "../api/api";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/dashboard";
    }
  }, []);

  const submit = async () => {
  try {
    const res = await loginUser({ email, password });

    const data = res.data.data; // FIXED

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.data));

    window.location.href = "/dashboard";
  } catch (err) {
    console.error(err);
    alert("Invalid Credentials");
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center 
      bg-gray-100 text-black transition-colors duration-500
      dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800 dark:text-white">

      <div className="w-full max-w-md bg-white dark:bg-gray-900
        border border-gray-300 dark:border-gray-700
        shadow-xl rounded-2xl p-8 mx-4
        animate-fadeIn">

        <h2 className="text-3xl font-bold mb-2 text-center">
          👋 Welcome Back
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          Enter your credentials to continue
        </p>

        <input
          type="email"
          className="w-full p-3 rounded-lg mb-4 bg-gray-200 dark:bg-gray-800
            text-black dark:text-white border border-transparent
            focus:ring-2 focus:ring-yellow-500 outline-none"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />

        <input
          type="password"
          className="w-full p-3 rounded-lg mb-6 bg-gray-200 dark:bg-gray-800
            text-black dark:text-white border border-transparent
            focus:ring-2 focus:ring-yellow-500 outline-none"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full py-3 rounded-lg font-semibold
            bg-yellow-500 hover:bg-yellow-600
            text-black transition-all shadow-md"
        >
          Login
        </button>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          New here?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
