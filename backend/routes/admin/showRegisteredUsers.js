// show all registered users
import express from "express";
import prisma from "../../prisma/client.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

// Get all registered users
router.get("/", auth, async (req, res) => {
  // Check if the user is an admin
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobileNumber: true,
        regDate: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching registered users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
