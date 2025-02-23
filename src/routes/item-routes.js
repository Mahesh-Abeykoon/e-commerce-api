const express = require("express");
const itemController  = require("../controllers/item-controller");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, itemController.createItem);
router.get("/", auth, itemController.getAllItems);
router.get("/:id", auth,itemController.getItemById);
router.put("/:id", auth, itemController.updateItem);
router.delete("/:id", auth, itemController.deleteItem);

module.exports = router;
