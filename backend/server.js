const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const connectDB = require("./config/db");
const startPriceEngine = require("./services/priceEngine");

const app = express();
app.use(cors());
app.use(express.json());

// 1) Create HTTP server
const server = http.createServer(app);

// 2) Create Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// 3) Pass IO to controllers that need it
const tradeController = require("./controllers/tradeController");
tradeController.setIO(io);

// 4) DB Connect
connectDB();

// 5) Price engine (Io required)
startPriceEngine(io);

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/stocks", require("./routes/stocks"));
app.use("/api/trades", require("./routes/trades"));
app.use("/api/portfolio", require("./routes/portfolio"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/history", require("./routes/history"));
app.use("/api/news", require("./routes/news"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    console.log("User joined room:", userId);
    socket.join(userId);
  });
});
