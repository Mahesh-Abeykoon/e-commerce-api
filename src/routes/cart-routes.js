const express = require("express");
const cartController = require("../controllers/cart-controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, cartController.getCart);
router.post("/add", auth, cartController.addItemToCart);
router.put("/update", auth, cartController.updateItemQuantity);
router.delete("/remove/:productId", auth, cartController.removeItemFromCart);
router.delete("/clear", auth, cartController.clearCart);

module.exports = router;
