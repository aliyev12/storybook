import express, { Router, Response } from "express";
import { Req } from "../models/interfaces";
import { ensureAuth } from "../middleware/auth";
import { Story, IStory } from "../models/Story";

const router: Router = express.Router();

/**
 * @desc Show add page
 * @desc GET /stories/add
 */
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

/**
 * @desc Process add form
 * @desc POST /stories
 */
router.post("/", ensureAuth, async (req: Req, res: Response) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

/**
 * @desc Show all stories
 * @desc GET /stories
 */
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", { stories });
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

/**
 * @desc Show single story
 * @desc GET /stories/:id
 */
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const story: IStory = await Story.findById(req.params.id)
      .populate("User")
      .lean();

    if (!story) {
      return res.render("error/404");
    }

    res.render("stories/show", { story });
  } catch (error) {
    console.error(error);
    return res.render("error/404");
  }
});

/**
 * @desc Show edit page
 * @desc GET /stories/edit/:id
 */
router.get("/edit/:id", ensureAuth, async (req: Req, res) => {
  try {
    const story: IStory = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user.toString() !== req.user.id.toString()) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { story });
    }
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

/**
 * @desc Update story
 * @desc PUT /stories/:id
 */
router.put("/:id", ensureAuth, async (req: Req, res) => {
  try {
    let story: IStory = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user.toString() !== req.user.id.toString()) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      }).lean();

      res.redirect("/dashboard");
    }
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

/**
 * @desc Show add page
 * @desc DELETE /stories/:id
 */
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

/**
 * @desc User stories
 * @route GET /stories/user/:userId
 */
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("User")
      .lean();

    res.render("stories/index", { stories });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

export default router;
