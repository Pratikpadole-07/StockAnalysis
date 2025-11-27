import React, { useState, useEffect } from "react";
import { registerUser } from "../api/api";

export default function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  useEffect(() => {
    if(localStorage.getItem("token")){
      window.location.href="/dashboard";
    }
  }, []);

  const submit = async ()=>{
     try{
       await registerUser({name,email,password});
       alert("Registration successful!");
       window.location.href="/login";
     }catch{
       alert("Failed! Try again.");
     }
  }

  return (
    <div className="min-h-screen p-8 transition-colors duration-500
+   bg-gray-100 text-black
+   dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800
+   dark:text-white">

      <div className="bg-gray-800/40 border border-gray-700 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-96">

        <h1 className="text-3xl font-bold text-white text-center mb-6 tracking-wide">
          Create Account
        </h1>

        <p className="text-gray-300 text-center mb-8">
          Join the simulated stock market
        </p>

        <input
          className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-lg p-3 mb-4 focus:outline-none focus:border-yellow-400"
          placeholder="Full Name"
          onChange={e=>setName(e.target.value)}
        />

        <input
          className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-lg p-3 mb-4 focus:outline-none focus:border-yellow-400"
          placeholder="Email"
          onChange={e=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-lg p-3 mb-6 focus:outline-none focus:border-yellow-400"
          placeholder="Password"
          onChange={e=>setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg py-3 transition-all shadow"
        >
          Register
        </button>

        <p className="mt-5 text-gray-400 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-500">
            Login here
          </a>
        </p>

      </div>

    </div>
  );
}
