const express = require("express");
const cors = require("cors");


const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);

const ticketsRoutes = require("./routes/tickets.routes");
app.use("/api/tickets", ticketsRoutes);

// error handler sederhana
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
