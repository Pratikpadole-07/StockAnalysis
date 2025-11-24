import axios from "axios";

const API = "http://localhost:5000/api";

export const registerUser = (data) =>
  axios.post(`${API}/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${API}/auth/login`, data);

export const getStocks = () =>
  axios.get(`${API}/stocks`);

// helper to attach token
function authHeader() {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const buyStock = (data) =>
  axios.post(`${API}/trades/buy`, data, {
    headers: authHeader(),
  });

export const sellStock = (data) =>
  axios.post(`${API}/trades/sell`, data, {
    headers: authHeader(),
  });

export const getPortfolioStats = () =>
  axios.get(`${API}/portfolio/stats`, {
    headers: authHeader(),
  });

export const getLeaderboard = () =>
  axios.get(`${API}/portfolio/leaderboard`);
