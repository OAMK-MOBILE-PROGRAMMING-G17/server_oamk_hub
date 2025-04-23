const {
  createMarketplaceItemInDB,
  getAllMarketplaceItemsFromDB,
  getMarketplaceItemByIdFromDB,
  updateMarketplaceItemInDB,
  deleteMarketplaceItemFromDB,
} = require("../models/MarketplaceModel");

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Create a marketplace item
const createMarketplaceItem = async (req, res) => {
  const { title, description, price, end_date, address, gps_location } = req.body;
  const userId = req.user.id; // Extract user ID from JWT token

  if (!title || !description || !price || !end_date || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const images = req.files ? req.files.map((file) => file.path) : []; // Array of file paths

  try {
    const newItem = await createMarketplaceItemInDB({
      id: uuidv4(),
      title,
      description,
      price,
      user_id: userId,
      images,
      address,
      gps_location: gps_location || null,
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

//Delete Marketplace Item
const deleteMarketplaceItem = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  try {
    const item = await getMarketplaceItemByIdFromDB(id);
    if (!item) {
      return res.status(404).json({ error: "Marketplace item not found" });
    }

    // Check ownership
    if (item.user_id !== currentUserId) {
      return res.status(403).json({ error: "You are not authorized to delete this item" });
    }

    // Delete associated images
    if (item.images && item.images.length > 0) {
      item.images.forEach((filePath) => {
        const fullPath = path.join(__dirname, "..", "..", filePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error("Error deleting file:", fullPath, err.message);
          }
        });
      });
    }
    
    const result = await deleteMarketplaceItemFromDB(id);
    if (result.deletedCount === 0) {
      return res.status(500).json({ error: "Failed to delete item" });
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