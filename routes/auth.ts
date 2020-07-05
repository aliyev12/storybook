import express, { Router } from "express";
import passport from "passport";

const router: Router = express.Router();

/**
 * @desc Auth with Google
 * @desc GET /auth/google
 */
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

/**
 * @desc Google auth callback
 * @desc GET /auth/google/callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

/**
 * @desc Logout userGoogle auth callback
 * @route GET /auth/logout
 */
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default router;
