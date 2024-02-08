import express from "express";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  forgotPasswordController,
  loginController,
  registerController,
  updateProfileController,
} from "../controllers/authController.js";



const router = express.Router();


//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);
//forgot password || post
router.post("/forgot-password", forgotPasswordController);

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);





export default router;
