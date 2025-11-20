require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const likesRoute = require('./routes/likes');
const commentsRoute = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
const path = require('path');

// Serve frontend static files from project root so frontend and API share the same origin.
// This makes relative fetch('/api/...') calls from the static pages work without further config.
const publicRoot = path.join(__dirname, '..', '..');
app.use(express.static(publicRoot));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  // Ensure indexes for models (helpful for unique/index creation in production)
  try {
    // require models here so their schemas are registered
    const Like = require('./models/Like');
    const Comment = require('./models/Comment');
    await Like.init();
    await Comment.init();
    console.log('Model indexes ensured');
  } catch (err) {
    console.warn('Error ensuring indexes:', err && err.message ? err.message : err);
  }
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// API routes
app.use('/api/likes', likesRoute);
app.use('/api/comments', commentsRoute);

app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'goarborpro-backend running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});