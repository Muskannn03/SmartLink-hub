const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Link = require("../models/link");

// USER ANALYTICS
router.get("/", auth, async (req, res) => {
  const links = await Link.find({ userId: req.user.id });

  const analytics = links.map(link => ({
    title: link.title,
    clicks: link.clicks
  }));

  res.json(analytics);
});

module.exports = router;
