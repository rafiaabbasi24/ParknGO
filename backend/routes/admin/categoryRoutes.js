import express from "express";
import prisma from "../../prisma/client.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

// Add Category
router.post("/add", auth, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { vehicleCat } = req.body;
    const category = vehicleCat?.trim();
    if (!category || category.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const newCategory = await prisma.category.create({
      data: {
        vehicleCat: category,
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Categories
router.get("/", auth, async (req, res) => {
  try {
    // if (!req.isAdmin) {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error.code === "P2003") {
      return res.status(400).json({
        error: "Cannot delete category",
        message:
          "Cannot delete category because it is associated with vehicles.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const { vehicleCat } = req.body;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        vehicleCat,
      },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
