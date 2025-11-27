import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard.jsx";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { Navigate } from "react-router-dom";
import TradeHistory from "./pages/TradeHistory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Analytics from "./pages/Analytics";
import StockDetails from "./pages/StockDetails";


function App(){

  return(
    <BrowserRouter>
      <Navbar />
      <ToastContainer position="top-right" theme="dark" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={
        <ProtectedRoute>
        <Analytics />
        </ProtectedRoute>
        } />

        <Route path="/history" element={
        <ProtectedRoute>
          <TradeHistory />
          </ProtectedRoute>
          } />
        <Route path="/stock/:symbol" element={<ProtectedRoute><StockDetails /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
