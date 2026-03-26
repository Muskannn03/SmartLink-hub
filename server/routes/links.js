const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Link = require("../models/link");
// Temporary in-memory storage (we'll replace with MongoDB later)
let links = [];

router.post("/", auth, async (req, res) => {
  const { title, url, priority, device, time } = req.body;

  const link = await Link.create({
    userId: req.user.id,
    title,
    url,
    priority,
    device,
    time,
    active: true
  });

  res.json(link);
});

// Create a link
router.post("/", (req, res) => {
  const { title, url, priority } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: "Title and URL required" });
  }

  const newLink = {
    id: Date.now(),
    title,
    url,
    priority: priority || 1,
    clicks: 0
  };

  links.push(newLink);
  links.sort((a, b) => a.priority - b.priority);

  res.json(newLink);
});
router.get("/:userId", async (req, res) => {
  try {
    const links = await Link.find({
      userId: req.params.userId,
      active: true
    }).sort({ priority: 1 });

    res.json({ links });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// CLICK TRACKING
router.post("/click/:id", async (req, res) => {
  await Link.findByIdAndUpdate(req.params.id, {
    $inc: { clicks: 1 }
  });

  res.json({ success: true });
});

module.exports = router;
