const {
  createLostProductInDB,
  getLostProductsFromDB,
  getLostProductByIdFromDB,
  updateLostProductInDB,
  deleteLostProductFromDB,
} = require("../models/LostProductsModel");

// Create a lost product
const createLostProduct = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);
  const { title, description, location, lost_time } = req.body;
  const userId = req.user.id; // Extract user ID from JWT token

  // Check if all required fields are provided
  if (!title || !description || !location || !lost_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Handle images (if sent via form-data)
  const images = req.files ? req.files.map((file) => file.path) : []; // Array of file paths

  try {
    const newLostProduct = await createLostProductInDB({
      title,
      description,
      location,
      images, // Save the array of file paths
      lost_time,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(newLostProduct);
  } catch (error) {
    console.error("Error creating lost product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all lost products
const getAllLostProducts = async (req, res) => {
  try {
    const lostProducts = await getLostProductsFromDB();
    res.status(200).json(lostProducts);
  } catch (error) {
    console.error("Error fetching lost products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific lost product by ID
const getLostProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const lostProduct = await getLostProductByIdFromDB(id);
    if (!lostProduct) {
      return res.status(404).json({ error: "Lost product not found" });
    }
    res.status(200).json(lostProduct);
  } catch (error) {
    console.error("Error fetching lost product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a lost product
const updateLostProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await updateLostProductInDB(id, updates);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Lost product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating lost product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a lost product
const deleteLostProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteLostProductFromDB(id);
    if (!deleted) {
      return res.status(404).json({ error: "Lost product not found" });
    }
    res.status(200).json({ message: "Lost product deleted successfully" });
  } catch (error) {
    console.error("Error deleting lost product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createLostProduct,
  getAllLostProducts,
  getLostProductById,
  updateLostProduct,
  deleteLostProduct,
};