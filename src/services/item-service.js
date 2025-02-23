const Item = require("../models/Item");
const CustomError = require("../utils/custom-error");

const createItem = async (user, data) => {
  if (user.role !== "seller" && user.role !== "admin") {
    throw new CustomError(403, "Only sellers or admins can add items");
  }

  const item = new Item({ ...data, createdBy: user._id });
  await item.save();
  return item;
};

const getAllItems = async (user, page, limit, category) => {
  const query = {};

  if (category) {
    query.category = category;
  }

  // Sellers should only see their own items
  if (user.role === "seller") {
    query.createdBy = user._id;
  }

  return await Item.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();
};

const getItemById = async (id) => {
  const item = await Item.findById(id);
  if (!item) throw new CustomError(404, "Item not found");
  return item;
};

const updateItem = async (user, id, data) => {
  const item = await Item.findById(id);
  if (!item) throw new CustomError(404, "Item not found");

  // Only allow the seller who created the item or an admin to update
  if (item.createdBy.toString() !== user._id.toString() && user.role !== "admin") {
    throw new CustomError(403, "You can only update your own items");
  }

  Object.assign(item, data);
  await item.save();
  return item;
};

// Soft delete: Marks as deleted instead of removing from DB
const deleteItem = async (user, id) => {
  const item = await Item.findById(id);
  if (!item) throw new CustomError(404, "Item not found");

  // Only allow the seller who created the item or an admin to delete
  if (item.createdBy.toString() !== user._id.toString() && user.role !== "admin") {
    throw new CustomError(403, "You can only delete your own items");
  }

  item.isDeleted = true;
  await item.save();
};

module.exports = { createItem, getAllItems, getItemById, updateItem, deleteItem };
