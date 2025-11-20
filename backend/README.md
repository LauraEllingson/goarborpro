# goarborpro-backend

A minimal Node.js + Express backend to provide global likes and comments for the Arborpro static site.

Features
- MongoDB (via mongoose) to persist global like counts and comments
- Routes:
  - GET /api/likes/:articleId - get the like count for an article
  - POST /api/likes/:articleId - increment the like count (returns new count)
  - GET /api/comments/:articleId - list comments for an article
  - POST /api/comments/:articleId - add a comment (body: { name, body })

Quick start
1. Open the `backend` folder in a terminal.
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI`.
3. Install dependencies:

```bash
npm install
```

4. Start the server (development):

Explanation: Replace README with full setup, usage, security notes, and frontend examples for likes/comments.

# goarborpro-backend

A minimal Node.js + Express backend to provide global likes and comments for the Arborpro static site.

Features
- MongoDB (via mongoose) to persist global like counts and comments
- Simple REST API for likes and comments

API routes
- GET /api/likes/:articleId - get the like count for an article
- POST /api/likes/:articleId - increment the like count (returns new count)
- GET /api/comments/:articleId - list comments for an article
- POST /api/comments/:articleId - add a comment (body: { name, body })

Prerequisites
- Node.js 16+ (or compatible LTS)
- A MongoDB database (Atlas or self-hosted)

Quick start
1. Open the `backend` folder in a terminal.
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and optionally `PORT`:

```bash
cp .env.example .env
# edit .env and paste your MongoDB URI
```

3. Install dependencies:

```bash
npm install
```

4. Start the server (development):

```bash
npm run dev
```

The default port is 4000 (set `PORT` in `.env`). After starting, the API base is `http://localhost:4000/api`.

Endpoints & examples

- GET likes

```bash
curl http://localhost:4000/api/likes/post1
# -> { "count": 3 }
```

- POST like (increment)

```bash
curl -X POST http://localhost:4000/api/likes/post1
# -> { "count": 4 }
```

- GET comments

```bash
curl http://localhost:4000/api/comments/post1
# -> [ { "_id": "...", "name": "Sam", "body": "Nice", "createdAt": "..." } ]
```

- POST comment

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Sam","body":"Great article!"}' http://localhost:4000/api/comments/post1
```

Moderation (delete comments)
----------------------------

The backend includes a simple moderation endpoint to delete comments. This uses a shared admin token stored in an environment variable.

- DELETE /api/comments/:commentId
  - Requires header `x-admin-token: <ADMIN_TOKEN>` or `Authorization: Bearer <ADMIN_TOKEN>`
  - Returns 200 with { success: true, deletedId } on success, 401 when token is missing/invalid, or 404 when the comment isn't found.

Add `ADMIN_TOKEN` to your `.env` (see `.env.example`) and keep it secret. Example:

```bash
ADMIN_TOKEN=replace_this_with_a_strong_value
```

Use the delete endpoint with curl (example):

```bash
curl -X DELETE -H "x-admin-token: $ADMIN_TOKEN" http://localhost:4000/api/comments/<COMMENT_ID>
```

Example frontend integration (copy into your article page)

1) Show and increment likes

```html
<!-- markup on your article page -->
<button id="likeBtn">❤️ Like</button>
<span id="likeCount"></span>

<script>
  const API_BASE = 'http://localhost:4000/api';
  const ARTICLE_ID = 'post1';

  async function fetchLikes() {
    const res = await fetch(`${API_BASE}/likes/${ARTICLE_ID}`);
    const data = await res.json();
    document.getElementById('likeCount').textContent = data.count + ' likes';
  }

  document.getElementById('likeBtn').addEventListener('click', async () => {
    const res = await fetch(`${API_BASE}/likes/${ARTICLE_ID}`, { method: 'POST' });
    const data = await res.json();
    document.getElementById('likeCount').textContent = data.count + ' likes';
    document.getElementById('likeBtn').disabled = true;
  });

  fetchLikes();
</script>
```

2) Show and post comments

```html
<div id="comments"></div>
<form id="commentForm">
  <input name="name" placeholder="Your name" required />
  <textarea name="body" placeholder="Write a comment" required></textarea>
  <button type="submit">Post comment</button>
</form>

<script>
  async function fetchComments() {
    const res = await fetch(`${API_BASE}/comments/${ARTICLE_ID}`);
    const comments = await res.json();
    const container = document.getElementById('comments');
    container.innerHTML = comments.map(c => `<p><strong>${escapeHtml(c.name)}</strong><br>${escapeHtml(c.body)}</p>`).join('\n');
  }

  document.getElementById('commentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = { name: form.name.value, body: form.body.value };
    await fetch(`${API_BASE}/comments/${ARTICLE_ID}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    form.reset();
    fetchComments();
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>\"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[s]));
  }

  fetchComments();
</script>
```

Security & production notes
- Use environment variables (`.env`) for database URIs and secrets. The example file is `.env.example`.
- For production, consider:
  - Enabling CORS origin restrictions (only allow your frontend origin)
  - Adding rate-limiting to avoid spam
  - Validating and sanitizing comment input server-side (the example does basic checks)
  - Adding moderation or a simple CAPTCHA for comments

Deployment tips
- This backend will run on any Node.js hosting (Heroku, Render, Vercel Serverless functions with adaptation, Fly.io, etc.)
- Ensure your `MONGODB_URI` is set in the host's environment configuration, not checked into source.

Troubleshooting
- "MONGODB_URI not set": copy `.env.example` to `.env` and fill values.
- Connection errors: verify the Atlas IP whitelist or your DB credentials.

Next steps I can take for you
- Add the example frontend snippets directly into `posts/post1.html` and wire up the UI (I'll do that next if you want).
- Add server-side input validation and rate-limiting.
