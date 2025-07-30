import express from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
  filterTickets,
  getTicketsByUser,
} from "../controllers/ticket.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createTicketValidation, updateTicketStatusValidation, assignTicketValidation, filterTicketsValidation } from "../validators/ticketValidators.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

// Protected routes
router.use(authMiddleware);

router.post("/", createTicketValidation, validateRequest, createTicket);
router.get("/me", getMyTickets);
router.get("/filter/params", filterTicketsValidation, validateRequest, filterTickets);
router.get("/user/:userId", getTicketsByUser);
router.get("/", getAllTickets);
router.get("/:id", getTicketById);
router.put("/:id/status", updateTicketStatusValidation, validateRequest, updateTicketStatus);
router.put("/:id/assign", assignTicketValidation, validateRequest, assignTicket);
router.delete("/:id", deleteTicket);

export default router;
