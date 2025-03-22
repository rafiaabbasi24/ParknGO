import express from "express";
import prisma from "../../prisma/client.js";
import dotenv from "dotenv";
import auth from "../../middlewares/auth.js";

const router = express.Router();
dotenv.config();

// Add Parking Lot Route
router.post("/", auth, async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });

    const { location, imgUrl, totalSlot, price } = req.body;
    const parkingLot = await prisma.parkingLot.create({
      data: {
        adminId: req.userId,
        location: location,
        imgUrl: imgUrl,
        totalSlot: totalSlot,
        bookedSlot: 0,
        price: price,
      },
    });
    res.status(201).json(parkingLot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// patch request to update parking lot details
router.patch("/:id", auth, async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });

    const { location, imgUrl, totalSlot, price } = req.body;
    const parkingLot = await prisma.parkingLot.update({
      where: {
        id: req.params.id,
      },
      data: {
        location: location,
        imgUrl: imgUrl,
        totalSlot: totalSlot,
        price: price,
      },
    });
    res.status(200).json(parkingLot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;

//delete parking lot
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });

    //check whether the integrity is maintained or not
    const bookings = await prisma.booking.findMany({
      where: {
        parkingLotId: req.params.id,
      },
    });
    if (bookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete parking lot with bookings" });
    }
    const parkingLot = await prisma.parkingLot.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(parkingLot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
