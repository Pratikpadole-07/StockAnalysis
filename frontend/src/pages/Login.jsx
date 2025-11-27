import React, { useState, useEffect } from 'react';
import { loginUser } from '../api/api';

export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  useEffect(() => {
    if(localStorage.getItem("token")){
      window.location.href="/dashboard";
    }
  }, []);

  const submit = async ()=>{
     try{
       const res = await loginUser({email,password});
       localStorage.setItem("token",res.data.token);
       localStorage.setItem("user",JSON.stringify(res.data.user));
       window.location.href="/dashboard";
     }catch(err){
        alert("Invalid credentials");
     }
  }

  return (
    <div className="min-h-screen p-8 transition-colors duration-500
+   bg-gray-100 text-black
+   dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800
+   dark:text-white">

      <div className="bg-gray-800/40 border border-gray-700 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-96">

        <h1 className="text-3xl font-bold text-white text-center mb-6 tracking-wide">
          Welcome Back
        </h1>

        <p className="text-gray-300 text-center mb-8">
          Login to continue trading
        </p>

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
          Login
        </button>

        <p className="mt-5 text-gray-400 text-center">
          New user?{" "}
          <a href="/register" className="text-blue-400 hover:text-blue-500">
            Register here
          </a>
        </p>

      </div>

    </div>
  )
}
