import dotenv from "dotenv";
dotenv.config(); // Safely load env here too

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const generateJWT = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyJWT = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
