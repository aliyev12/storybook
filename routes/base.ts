import express, { Router, Request, Response } from "express";
import { ensureAuth, ensureGuest } from "../middleware/auth";
import { Story } from "../models/Story";

const router: Router = express.Router();

/**
 * @desc Login/Landing Page
 * @desc GET /
 */
router.get("/", ensureGuest, (req, res) => {
  res.render("login", { layout: "login" });
});

/**
 * @desc Dashboard
 * @desc GET /dashboard
 */
router.get("/dashboard", ensureAuth, async (req: any, res: any) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

export default router;
