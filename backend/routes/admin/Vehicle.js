import express from "express";
import prisma from "../../prisma/client.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

//  GET In-Vehicles (outTime > now and status is 'IN')
router.get("/upcoming", auth, async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });

    const now = new Date();

    const upcomingVehicles = await prisma.vehicle.findMany({
      where: {
        status: "IN", // still not OUT or HISTORY
        inTime: { gt: now }, // future time
      },
      include: {
        booking: {
          include: {
            user: true,
          },
        },
      },
    });

    // Format the response for the frontend
    const formattedVehicles = upcomingVehicles.map((vehicle) => ({
      id: vehicle.id,
      registrationNumber: vehicle.registrationNumber || "",
      inTime: vehicle.inTime,
      parkingNumber: vehicle.booking?.parkingLotId || "N/A",
      ownerName: `${vehicle.booking?.user?.firstName || ""} ${
        vehicle.booking?.user?.lastName || ""
      }`.trim(),
    }));

    res.status(200).json(formattedVehicles);
  } catch (error) {
    console.error("Error fetching upcoming vehicles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  GET Out-Vehicles (status: OUT)
router.get("/out", auth, async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });

    const now = new Date();

    await prisma.vehicle.updateMany({
      where: {
        status: "IN",
        inTime: { lte: now },
      },
      data: {
        status: "OUT",
      },
    });
  } catch (error) {
    console.error("Error auto-transitioning vehicles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });

    const outVehicles = await prisma.vehicle.findMany({
      where: { status: "OUT" },
      include: {
        booking: {
          include: {
            user: true,
          },
        },
      },
    });
    const formattedVehicles = outVehicles.map((vehicle) => ({
      id: vehicle.id,
      registrationNumber: vehicle.registrationNumber || "",
      inTime: vehicle.inTime,
      // Getting parkingNumber from booking -> parkingLot
      parkingNumber: vehicle.booking?.parkingLotId || "N/A",
      // Combine firstName and lastName for the owner name
      ownerName: `${vehicle.booking?.user?.firstName || ""} ${
        vehicle.booking?.user?.lastName || ""
      }`.trim(),
    }));

    res.status(200).json(formattedVehicles);
  } catch (error) {
    console.error("Error fetching out vehicles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  POST Settle a vehicle (add remark and mark as HISTORY)
router.post("/settle", auth, async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });

    const { vehicleId, remark } = req.body;

    if (!vehicleId || !remark) {
      return res
        .status(400)
        .json({ message: "Vehicle ID and remark are required" });
    }

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Ensure vehicle exists and is currently OUT
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      if (vehicle.status !== "OUT") {
        throw new Error("Only OUT vehicles can be settled");
      }

      // Settle the vehicle
      const updatedVehicle = await prisma.vehicle.update({
        where: { id: vehicleId },
        data: {
          remark,
          status: "DONE",
          outTime: new Date(),
        },
      });

      // Get the booking info associated with the vehicle
      const booking = await prisma.booking.findUnique({
        where: { bookId: updatedVehicle.bookId },
      });

      if (booking) {
        await prisma.parkingLot.update({
          where: { id: booking.parkingLotId },
          data: {
            bookedSlot: {
              decrement: 1,
            },
          },
        });
      }

      return updatedVehicle; // Return the updated vehicle
    });

    res.status(200).json({
      message: "Vehicle settled successfully",
      vehicle: result,
    });
  } catch (error) {
    console.error("Error settling vehicle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  GET History Vehicles (status: HISTORY)
router.get("/history", auth, async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied" });

    const historyVehicles = await prisma.vehicle.findMany({
      where: { status: "DONE" },
      include: {
        booking: {
          include: {
            user: true,
          },
        },
      },
    });

    const formattedVehicles = historyVehicles.map((vehicle) => ({
      id: vehicle.id,
      registrationNumber: vehicle.registrationNumber || "",
      inTime: vehicle.inTime,
      parkingNumber: vehicle.booking?.parkingLotId || "N/A",
      ownerName: `${vehicle.booking?.user?.firstName || ""} ${
        vehicle.booking?.user?.lastName || ""
      }`.trim(),
      settledTime: vehicle.outTime,
      remark: vehicle.remark || "N/A",
    }));

    res.status(200).json(formattedVehicles);
  } catch (error) {
    console.error("Error fetching history vehicles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
