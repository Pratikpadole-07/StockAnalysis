import React, { useState, useEffect } from "react";
import { getLeaderboard } from "../api/api";

export default function Leaderboard(){

  const [data, setData] = useState([]);

  useEffect(()=>{
    load();
  },[]);

  const load = async ()=>{
    const res = await getLeaderboard();
    setData(res.data);
  };

  return(
    <div>
      <h2>Leaderboard</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User</th>
            <th>Net Worth</th>
            <th>Profit %</th>
          </tr>
        </thead>

        <tbody>
          {data.map((u,i)=>(
            <tr key={i}>
              <td>{u.user}</td>
              <td>₹{u.netWorth.toFixed(2)}</td>
              <td>{u.profitPercent.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
