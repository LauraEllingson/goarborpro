const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET /api/comments/:articleId -> [ { name, body, createdAt, _id } ]
router.get('/:articleId', async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ articleId }).sort({ createdAt: -1 }).limit(200);
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// POST /api/comments/:articleId -> creates a comment
// body: { name, body }
router.post('/:articleId', async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { name, body } = req.body;
    if (!name || !body) {
      return res.status(400).json({ error: 'name and body are required' });
    }
    const comment = new Comment({ articleId, name, body });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/comments/:commentId -> deletes a comment (requires ADMIN token)
router.delete('/:commentId', async (req, res, next) => {
  try {
    const adminToken = process.env.ADMIN_TOKEN;
    // Accept token in `x-admin-token` header or Authorization: Bearer <token>
    const headerToken = req.get('x-admin-token') || (req.get('authorization') || '').replace(/^Bearer\s+/, '');
    if (!adminToken || headerToken !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { commentId } = req.params;
    const deleted = await Comment.findByIdAndDelete(commentId);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, deletedId: commentId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
