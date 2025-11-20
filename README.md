# Go Arbor Pro — Local Development

This project contains a static frontend and a Node.js + Express backend that serves API endpoints (likes, comments) and the frontend static files.

Quick start (macOS / zsh):

1. Install dependencies

```bash
# root project
npm install

# backend dependencies
cd backend
npm install
cd ..
```

2. Start development (Tailwind watcher + backend)

```bash
npm run dev
```

This runs:
- Tailwind watcher to rebuild `dist/styles.css` from `styles.css`.
- Backend (nodemon) which serves the frontend and API at http://localhost:4000

3. Open the site

Visit http://localhost:4000/index.html

API endpoints

- GET /api/likes/:articleId
- POST /api/likes/:articleId
- GET /api/comments/:articleId
- POST /api/comments/:articleId

Notes

- Configure backend `.env` in `/backend/.env` with `MONGODB_URI` and `PORT` if needed.
- The Tailwind build writes to `/dist/styles.css`. The HTML files reference `/dist/styles.css`.

If you want me to further polish the header (mobile animation, icons, visual tweaks) or finish the UX for likes/comments, tell me which page to prioritize.