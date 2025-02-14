const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  price: { 
    type: Number, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, 
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
