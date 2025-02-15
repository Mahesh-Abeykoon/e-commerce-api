const itemService = require("../services/item-service");

// Create an item
const createItem = async (req, res, next) => {
  try {
    const item = await itemService.createItem(req.user, req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Get all items with pagination & filtering
const getAllItems = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const items = await itemService.getAllItems(page, limit, category);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Get item by ID
const getItemById = async (req, res, next) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Update item
const updateItem = async (req, res, next) => {
  try {
    const updatedItem = await itemService.updateItem(req.user, req.params.id, req.body);
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
};

// Soft Delete item (Mark as deleted instead of hard delete)
const deleteItem = async (req, res, next) => {
  try {
    await itemService.deleteItem(req.user, req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createItem, getAllItems, getItemById, updateItem, deleteItem };
