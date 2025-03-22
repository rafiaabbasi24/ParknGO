import express from "express";
import auth from "../middlewares/auth.js";
import prisma from "../prisma/client.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_PAYMENT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    const { userId, parkingLotId, inTime, registrationNumber } = payload;

    if (!userId || !parkingLotId || !registrationNumber || !inTime) {
      return res.status(400).json({ message: "Incomplete token data" });
    }

    // Step 1: Find the vehicle by registration number and inTime
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        registrationNumber,
        inTime: new Date(inTime),
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Booking not found — no matching vehicle entry",
        status: "failed",
      });
    }

    // Step 2: Get the related booking
    const booking = await prisma.booking.findUnique({
      where: {
        bookId: vehicle.bookId,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking record missing",
        status: "failed",
      });
    }

    // Step 3: Verify user and parking lot match
    if (booking.userId !== userId || booking.parkingLotId !== parkingLotId) {
      return res.status(403).json({
        message: "User or parking lot mismatch",
        status: "failed",
      });
    }

    // Step 4: Check payment status
    if (booking.paymentId) {
      return res.status(200).json({
        message: "Booking successful",
        status: "success",
        bookId: booking.bookId,
      });
    } else {
      return res.status(200).json({
        message: "Booking found but payment is pending",
        status: "pending",
        bookId: booking.bookId,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
