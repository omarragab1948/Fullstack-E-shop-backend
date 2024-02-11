const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { requireAuth } = require("../middlewares/authMiddleware");
const isSeller = require("../middlewares/isSeller");

router.post(
  "/sellproduct",
  requireAuth,
  isSeller,
  productController.sellProduct
);
router.get("/getproducts", requireAuth, productController.getProducts);
module.exports = router;
