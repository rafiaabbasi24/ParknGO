import express from 'express';
import auth from '../../middlewares/auth.js';
import prisma from '../../prisma/client.js';

const router = express.Router();


router.get("/stats", auth, async (req, res) => {
  try {
    if (!req.isAdmin) 
      return res.status(403).json({ message: "Access denied" });

    const totalParkingLots = await prisma.parkingLot.count();
    const totalBookings = await prisma.booking.count();
    const totalVehiclesIn = await prisma.vehicle.count({ where: { status: 'IN' } });
    const totalVehiclesOut = await prisma.vehicle.count({ where: { status: 'OUT' } });
    const totalVehiclesHistory = await prisma.vehicle.count({ where: { status: 'DONE' } });
    
    res.status(200).json({ 
      totalParkingLots,
      totalBookings,
      totalVehiclesIn,
      totalVehiclesOut,
      totalVehiclesHistory
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/occupancy", auth, async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    const parkingLots = await prisma.parkingLot.findMany({
      include: {
        bookings: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    let totalOccupied = 0;
    let totalEmpty = 0;
    const now = new Date();

    parkingLots.forEach(lot => {
      const occupiedVehicles = lot.bookings.filter(booking => {
        const vehicle = booking.vehicle;
        return vehicle && vehicle.inTime <= now && vehicle.outTime === null;
      });

      const occupiedCount = occupiedVehicles.length;
      const emptyCount = lot.totalSlot - occupiedCount;

      totalOccupied += occupiedCount;
      totalEmpty += emptyCount;
    });

    res.status(200).json([
      { name: "Occupied", value: totalOccupied },
      { name: "Empty", value: totalEmpty }
    ]);
  } catch (error) {
    console.error("Error fetching occupancy data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/trends", auth, async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      let day = new Date();
      day.setDate(day.getDate() - i);
      let start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      let end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);

      const inCount = await prisma.vehicle.count({
        where: { 
          inTime: { gte: start, lt: end }
        }
      });
      const outCount = await prisma.vehicle.count({
        where: { 
          outTime: { gte: start, lt: end }
        }
      });
      const historyCount = await prisma.vehicle.count({
        where: {
          status: 'DONE',
          outTime: { gte: start, lt: end }
        }
      });

      trendData.push({
        date: start.toISOString().split('T')[0], // e.g., "2025-04-30"
        in: inCount,
        out: outCount,
        history: historyCount
      });
    }
    res.status(200).json(trendData);
  } catch (error) {
    console.error("Error fetching trend data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/earnings", auth, async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    // Only consider bookings that have an associated vehicle with inTime.
    const bookings = await prisma.booking.findMany({
      where: {
        vehicle: {
          // Optionally filter out future records if needed
          inTime: { lte: new Date() }
        }
      },
      include: {
        parkingLot: true,
        vehicle: true,
      },
    });

    // Group earnings by month-year using vehicle.inTime.
    // For grouping, use a key like "YYYY-MM" (e.g., "2025-04").
    const earningsMap = {};

    bookings.forEach((booking) => {
      if (booking.vehicle && booking.vehicle.inTime) {
        const inDate = new Date(booking.vehicle.inTime);
        // Get year and month from inTime
        const year = inDate.getFullYear();
        // Ensure two-digit month using padStart.
        const month = String(inDate.getMonth() + 1).padStart(2, '0');
        const monthKey = `${year}-${month}`;
        // Assume each booking revenue equals the parking lot price.
        const amount = booking.parkingLot.price;
        earningsMap[monthKey] = (earningsMap[monthKey] || 0) + amount;
      }
    });

    // Convert the earningsMap into an array of objects and sort by monthKey.
    const earningsData = Object.keys(earningsMap)
      .sort()  // Alphabetical sort works when keys are in "YYYY-MM" format
      .map((month) => ({
        month,
        earnings: earningsMap[month],
      }));

    res.status(200).json(earningsData);
  } catch (error) {
    console.error("Error fetching earnings data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
