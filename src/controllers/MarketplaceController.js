const {
  createMarketplaceItemInDB,
  getAllMarketplaceItemsFromDB,
  getMarketplaceItemByIdFromDB,
  updateMarketplaceItemInDB,
  deleteMarketplaceItemFromDB,
} = require("../models/MarketplaceModel");

// Create a marketplace item
const createMarketplaceItem = async (req, res) => {
  const { title, description, price, end_date } = req.body;
  const userId = req.user.id; // Extract user ID from JWT token

  if (!title || !description || !price || !end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const images = req.files ? req.files.map((file) => file.path) : []; // Array of file paths

  try {
    const newItem = await createMarketplaceItemInDB({
      title,
      description,
      price,
      user_id: userId,
      images,
      end_date,
      expired: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating marketplace item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all marketplace items
const getAllMarketplaceItems = async (req, res) => {
  try {
    const items = await getAllMarketplaceItemsFromDB();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching marketplace items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific marketplace item by ID
const getMarketplaceItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await getMarketplaceItemByIdFromDB(id);
    if (!item) {
      return res.status(404).json({ error: "Marketplace item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching marketplace item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a marketplace item
const updateMarketplaceItem = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedItem = await updateMarketplaceItemInDB(id, updates);
    if (!updatedItem) {
      return res.status(404).json({ error: "Marketplace item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating marketplace item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a marketplace item
const deleteMarketplaceItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteMarketplaceItemFromDB(id);
    if (!deleted) {
      return res.status(404).json({ error: "Marketplace item not found" });
    }
    res.status(200).json({ message: "Marketplace item deleted successfully" });
  } catch (error) {
    console.error("Error deleting marketplace item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createMarketplaceItem,
  getAllMarketplaceItems,
  getMarketplaceItemById,
  updateMarketplaceItem,
  deleteMarketplaceItem,
};