import express from "express";
import dotenv from "dotenv";
import auth from "../../middlewares/auth.js";
import prisma from "../../prisma/client.js";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });

    const {
      parkingLotId,
      vehicleCategoryId,
      vehicleCompanyName,
      registrationNumber,
      inTime,
      customerId,
    } = req.body;

    const intime = new Date(inTime);

    //  Find existing user by details
    const user = await prisma.user.findFirst({
      where: {
        id: customerId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please ensure the user is registered.",
      });
    }

    const userId = user.id;

    //  Start transaction
    const result = await prisma.$transaction(async (tx) => {
      const parkingLot = await tx.parkingLot.findUnique({
        where: { id: parkingLotId },
      });
      const vehicleCategory = await tx.category.findUnique({
        where: { id: vehicleCategoryId },
      });
      if (!vehicleCategory) {
        throw new Error("Vehicle category not found");
      }
      if (!parkingLot) {
        throw new Error("Parking lot not found");
      }

      const availableSlots = parkingLot.totalSlot - parkingLot.bookedSlot;
      if (availableSlots <= 0) {
        throw new Error("No available slots");
      }

      //  Create Booking
      await tx.parkingLot.update({
        where: { id: parkingLotId },
        data: { bookedSlot: { increment: 1 } },
      });

      const booking = await tx.booking.create({
        data: {
          userId,
          parkingLotId,
          paymentId: "Done manually by Admin",
        },
      });

      const vehicle = await tx.vehicle.create({
        data: {
          bookId: booking.bookId,
          categoryId: vehicleCategoryId,
          vehicleCompanyName,
          registrationNumber,
          inTime: intime,
          status: "IN",
        },
      });

      return { booking, vehicle };
    });
    const verifytoken = jwt.sign(
      { userId, parkingLotId, inTime, registrationNumber },
      process.env.JWT_PAYMENT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Booking successful",
      booking: result.booking,
      vehicle: result.vehicle,
      verifytoken: verifytoken,
    });
  } catch (error) {
    console.error("Booking error:", error);
    const msg = [
      "User not found. Please ensure the user is registered.",
      "Parking lot not found",
      "No available slots",
    ].includes(error.message)
      ? error.message
      : "Server error during booking";
    res.status(500).json({ message: msg });
  }
});

export default router;
