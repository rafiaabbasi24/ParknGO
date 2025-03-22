import prisma from "../prisma/client.js";
import dotenv from "dotenv";
dotenv.config();

export async function getUserReportData(userId) {
  try {
    // Format response
    const format = (data) =>
      data.map((b) => ({
        id: b.bookId,
        registrationNumber: b.vehicle?.registrationNumber || "N/A",
        location: b.parkingLot.location,
        company: b.vehicle?.vehicleCompanyName || "N/A",
        category: b.vehicle?.vehicleCategory?.vehicleCat || "N/A",
        inTime: b.vehicle?.inTime,
        outTime: b.vehicle?.outTime,
        totalSpent: b.parkingLot.price, // assuming flat price
      }));

    // Fetch user bookings with vehicle and parkingLot data
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        vehicle: {
          include: {
            vehicleCategory: true,
          },
        },
        parkingLot: true,
      },
    });

    return format(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
