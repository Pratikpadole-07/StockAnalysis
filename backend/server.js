const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const connectDB = require("./config/db");
const startPriceEngine = require("./services/priceEngine");

const app = express();
app.use(cors());
app.use(express.json());

// 1) create HTTP server FIRST
const server = http.createServer(app);

// 2) NOW create Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
// make io available in routes/controllers
app.set("io", io);

// 3) connect DB
connectDB();

// 4) now start price engine
startPriceEngine(io);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/stocks", require("./routes/Stocks"));
app.use("/api/trades", require("./routes/trades"));
app.use("/api/portfolio", require("./routes/portfolio"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});

// socket connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});
