const express = require('express');
const router = express.Router();
const Like = require('../models/Like');

// GET /api/likes/:articleId -> { count: number }
router.get('/:articleId', async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const doc = await Like.findOne({ articleId });
    res.json({ count: doc ? doc.count : 0 });
  } catch (err) {
    next(err);
  }
});

// POST /api/likes/:articleId -> increments and returns new count
router.post('/:articleId', async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const doc = await Like.findOneAndUpdate(
      { articleId },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ count: doc.count });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
