const express = require("express");
const cartController = require("../controllers/cart-controller");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, authorize('customer'), cartController.getCart);
router.post("/add", auth, authorize('customer'), cartController.addItemToCart);
router.put("/update", auth, authorize('customer'), cartController.updateItemQuantity);
router.delete("/remove/:productId", auth, authorize('customer'), cartController.removeItemFromCart);
router.delete("/clear", auth, authorize('customer'), cartController.clearCart);

module.exports = router;
