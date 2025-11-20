// Article widgets: likes, comments, share — reusable for all article pages.
(function () {
  const API_BASE = window.API_BASE || 'http://localhost:4000/api';

  function $(sel, ctx = document) { return ctx.querySelector(sel); }
  function $all(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

  function getArticleId() {
    const articleEl = document.querySelector('article[data-article-id]');
    return articleEl ? articleEl.getAttribute('data-article-id') : (window.ARTICLE_ID || 'unknown');
  }

  // Lightweight toast helper — creates a container and shows a transient message.
  function showToast(message, opts = {}) {
    const timeout = opts.timeout || 3000;
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'tw-fixed tw-top-4 tw-right-4 tw-flex tw-flex-col tw-gap-2 tw-z-[9999]';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = 'tw-bg-black/80 tw-text-white tw-px-4 tw-py-2 tw-rounded tw-shadow';
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => {
      t.classList.add('tw-opacity-0');
      setTimeout(() => t.remove(), 300);
    }, timeout);
    return t;
  }

  async function fetchLikes(articleId, els) {
    try {
      const res = await fetch(`${API_BASE}/likes/${articleId}`);
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();
      if (els.count) els.count.textContent = (data.count || 0) + ' likes';
    } catch (err) {
      if (els.count) els.count.textContent = '—';
      console.error('fetchLikes', err);
    }
  }

  async function postLike(articleId, els) {
    try {
      // local duplicate prevention
      const key = `liked:${articleId}`;
      if (localStorage.getItem(key)) {
        if (els.msg) els.msg.textContent = 'You already liked this.';
        return;
      }

      const res = await fetch(`${API_BASE}/likes/${articleId}`, { method: 'POST' });
      if (!res.ok) throw new Error('like failed');
      const data = await res.json();
      if (els.count) els.count.textContent = (data.count || 0) + ' likes';
  if (els.btn) { els.btn.disabled = true; els.btn.textContent = '❤️ Liked'; }
  if (els.msg) els.msg.textContent = 'Thanks for liking!';
  try { showToast('Liked — thanks!'); } catch (e) {}
      localStorage.setItem(key, '1');
    } catch (err) {
      console.error('postLike', err);
      if (els.msg) els.msg.textContent = 'Could not submit like.';
    }
  }

  async function fetchComments(articleId, els) {
    try {
      const res = await fetch(`${API_BASE}/comments/${articleId}`);
      if (!res.ok) throw new Error('comments fetch failed');
      const comments = await res.json();
      if (!Array.isArray(comments)) return;
      if (els.container) {
        els.container.innerHTML = comments.map(c => {
          const when = c.createdAt ? new Date(c.createdAt).toLocaleString() : '';
          return `\n  <div class="comment" style="border-bottom:1px solid #eee; padding:0.5em 0;">\n    <strong>${escapeHtml(c.name)}</strong> <small style="color:#666">${when}</small>\n    <div>${escapeHtml(c.body)}</div>\n  </div>`;
        }).join('');
      }
    } catch (err) {
      console.error('fetchComments', err);
      if (els.container) els.container.textContent = 'Could not load comments.';
    }
  }

  async function postComment(articleId, els, name, body) {
    try {
      const res = await fetch(`${API_BASE}/comments/${articleId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, body })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || res.statusText);
      }
      if (els.form) els.form.reset();
      fetchComments(articleId, els);
      try { showToast('Comment posted'); } catch (e) {}
    } catch (err) {
      console.error('postComment', err);
      alert('Could not post comment: ' + err.message);
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  function wireShare(els, articleUrl, title) {
    const encodedUrl = encodeURIComponent(articleUrl);
    const encodedTitle = encodeURIComponent(title || document.title);
    if (els.facebook) els.facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    if (els.twitter) els.twitter.href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    if (els.copy) els.copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(articleUrl); if (els.msg) els.msg.textContent = 'Link copied.'; }
      catch (e) { if (els.msg) els.msg.textContent = 'Copy failed.'; }
    });

    // Web Share API fallback
    if (els.instagram) els.instagram.addEventListener('click', async () => {
      if (navigator.share) {
        try { await navigator.share({ title, url: articleUrl }); if (els.msg) els.msg.textContent = 'Shared.'; }
        catch (e) { if (els.msg) els.msg.textContent = 'Share cancelled.'; }
      } else { alert('Sharing not supported on this device.'); }
    });

    if (els.threads) els.threads.addEventListener('click', () => {
      // Threads doesn't have a simple share URL; copy to clipboard as fallback
      navigator.clipboard?.writeText(articleUrl).then(() => { if (els.msg) els.msg.textContent = 'Link copied for Threads.'; });
    });
  }

  function init() {
    const articleId = getArticleId();
    const root = document;
    const els = {
      btn: $('#likeBtn', root),
      count: $('#likeCount', root),
      msg: $('#likeMsg', root),
      commentsContainer: $('#comments', root),
      form: $('#commentForm', root),
      shareFacebook: $('#shareFacebook', root),
      shareTwitter: $('#shareTwitter', root),
      shareInstagram: $('#shareInstagram', root),
      shareThreads: $('#shareThreads', root),
      shareCopy: $('#shareCopy', root),
      shareMsg: $('#shareMsg', root)
    };

    // likes
    if (els.btn) {
      els.btn.addEventListener('click', () => postLike(articleId, { btn: els.btn, count: els.count, msg: els.msg }));
    }
    fetchLikes(articleId, { count: els.count });

    // comments
    if (els.form) {
      els.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = els.form.name?.value?.trim();
        const body = els.form.body?.value?.trim();
        if (!name || !body) return alert('Please enter name and comment');
        postComment(articleId, { form: els.form, container: els.commentsContainer }, name, body);
      });
    }
    fetchComments(articleId, { container: els.commentsContainer });

    // share
    const articleUrl = window.location.href;
    const title = document.querySelector('h1')?.textContent || document.title;
    wireShare({ facebook: els.shareFacebook, twitter: els.shareTwitter, instagram: els.shareInstagram, threads: els.shareThreads, copy: els.shareCopy, msg: els.shareMsg }, articleUrl, title);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
