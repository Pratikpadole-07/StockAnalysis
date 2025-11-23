import React, { useState } from 'react';
import { loginUser } from '../api/api';

const Login = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const submit = async ()=>{
     const res = await loginUser({email,password});
     localStorage.setItem("token",res.data.token);
     localStorage.setItem("user",JSON.stringify(res.data.user));
     window.location.href="/dashboard";
  }

  return(
    <div>
      <h2>Login</h2>
      <input placeholder="email" onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="password" onChange={e=>setPassword(e.target.value)} type="password"/>
      <button onClick={submit}>Login</button>
    </div>
  );
}

export default Login;
