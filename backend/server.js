const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const connectDB = require("./config/db");
connectDB();


const app = express();
app.use(cors());
app.use(express.json());



const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use("/api/auth", require("./routes/auth"));

server.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});
