const Item = require("../models/Item");

// Create a new item (Admin/Seller only)
const createItem = async (req, res) => {
  try {
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Only sellers or admins can add items" });
    }

    const item = new Item({ ...req.body, createdBy: req.user._id });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all items (Customers can view)
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single item
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an item (Only seller/admin who created it)
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only update your own items" });
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an item (Only seller/admin who created it)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own items" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createItem, getAllItems, getItemById, updateItem, deleteItem };
