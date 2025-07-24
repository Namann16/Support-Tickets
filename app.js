import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import screenRoutes from "./routes/screen.routes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json());

app.use("/", screenRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send(" Helpdesk Ticketing API is Live");
});


app.use((req, res, next) => {
  next(new ApiError(404, "Route Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(
    new ApiResponse(false, null, err.message || "Internal Server Error")
  );
});

export default app;
