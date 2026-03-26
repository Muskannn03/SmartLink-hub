
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("client"));

// middleware
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/links", require("./routes/links"));
app.use("/api/analytics", require("./routes/analytics"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Serve frontend
app.use(express.static(path.join(__dirname, "../client")));

// Default route → frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Server start
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
