import axios from "axios";

const API = "http://localhost:5000/api";

// Helper to attach token correctly
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};



/* ---------------- AUTH ---------------- */
export const registerUser = (data) =>
  axios.post(`${API}/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${API}/auth/login`, data);

/* ---------------- STOCKS ---------------- */
export const getStocks = () =>
  axios.get(`${API}/stocks`);

/* ---------------- ADMIN ---------------- */
export const adminAddStock = (data) =>
  axios.post(`${API}/admin/add-stock`, data, authHeader());

export const adminUpdateVolatility = (data) =>
  axios.post(`${API}/admin/update-volatility`, data, authHeader());

/* ---------------- TRADES ---------------- */
export const buyStock = (data) =>
  axios.post(`${API}/trades/buy`, data, authHeader());

export const sellStock = (data) =>
  axios.post(`${API}/trades/sell`, data, authHeader());


export const getPortfolioStats = () =>
  axios.get(`${API}/portfolio/stats`, authHeader());

export const getTradeHistory = () =>
  axios.get(`${API}/trades/history`, authHeader());

export const getLeaderboard = () =>
  axios.get(`${API}/portfolio/leaderboard`, authHeader());

/* ---------------- CHART & NEWS ---------------- */
export const getHistoricalCandles = (symbol, range = "1D") =>
  axios.get(`${API}/history/${symbol}/${range}`);

export const getStockNews = (symbol) =>
  axios.get(`${API}/news/${symbol}`);
