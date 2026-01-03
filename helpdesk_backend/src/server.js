import 'dotenv/config'
import express from 'express'
import cors from "cors";  


import authRouter from './routes/auth.routes.js'
import ticketsRoutes from "./routes/tickets.routes.js"

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  // tambahkan IP laptop kamu (contoh):
  "http://192.168.70.101:5173",
];

const app = express()

app.use(
  cors({
    origin(origin, cb) {
      // allow non-browser tools (curl/postman)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json())
app.use("/api/tickets", ticketsRoutes)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
  res.send('API running')
})

const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`API running on http://${HOST}:${PORT}`);
});

