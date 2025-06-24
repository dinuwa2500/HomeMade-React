import express from "express";
import {
  createTicket,
  getAllTickets,
  getUserTickets,
  replyTicket,
  deleteTicket,
  updateTicket,
} from "../controllers/ticketController.js";

import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, upload.single("image"), createTicket);
router.get("/all", auth, getAllTickets); // Admin can protect this route if needed
router.get("/user", auth, getUserTickets);
router.post("/reply", auth, replyTicket);
router.delete("/delete/:ticketId", auth, deleteTicket);
router.put("/update/:ticketId", auth, updateTicket);

export default router;
