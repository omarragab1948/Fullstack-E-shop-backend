const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { requireAuth, isAdmin } = require("../middlewares/authMiddleware");

router.post(
  "/addcategory",
  requireAuth,
  isAdmin,
  categoryController.addCategory
);
router.get("/getcategories", requireAuth, categoryController.getAllCategories);
router.delete(
  "/deletecategory/:id",
  requireAuth,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;
