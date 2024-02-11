const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { requireAuth, isAdmin } = require("../middlewares/authMiddleware");

router.get("/userinfo", requireAuth, userController.getUserInfo);
router.put("/edituserinfo", requireAuth, userController.editUserInfo);
router.get("/getusers", requireAuth, isAdmin, userController.getUsers);
router.post("/acceptuser", requireAuth, isAdmin, userController.acceptUser);
router.post("/rejectuser", requireAuth, isAdmin, userController.rejectUser);
router.get("/userinfoforadmin", requireAuth, userController.getUserInfoForAdmin);

module.exports = router;
