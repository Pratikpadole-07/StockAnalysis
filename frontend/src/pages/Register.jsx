import React,{useState} from 'react';
import { registerUser } from '../api/api';

export default function Register(){

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const submit = async()=>{
     await registerUser({name,email,password});
     alert("registered");
     window.location.href="/login";
  }

  return(
    <div>
      <h2>Register</h2>
      <input placeholder="name" onChange={e=>setName(e.target.value)}/>
      <input placeholder="email" onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="password" type="password" onChange={e=>setPassword(e.target.value)}/>
      <button onClick={submit}>Register</button>
    </div>
  )
}
