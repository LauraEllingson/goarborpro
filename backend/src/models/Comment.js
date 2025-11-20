const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  articleId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
