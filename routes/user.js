import express from "express";
import passport from "passport";
import { myProfile, logout, getAdminUsers, getAdminStats } from "../controllers/user.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/auth.js";


const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.session.id);
  res.send("welcome");
})

// strategy "google" which we will create in utils folder
router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

router.get("/login", passport.authenticate("google", {
  scope: ["profile"],
  successRedirect: process.env.FRONTEND_URL
}),
  (req, res, next) => {
    res.send("Logged in");
  });

router.get("/me", isAuthenticated, myProfile);

router.get("/logout", logout);

// admin routes
router.get("/admin/users", isAuthenticated, authorizeAdmin, getAdminUsers);

router.get("/admin/stats", isAuthenticated, authorizeAdmin, getAdminStats);



export default router;