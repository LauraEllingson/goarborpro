// Listing widgets: fetch and post likes for posts shown on listing pages.
(function () {
  const API_BASE = window.API_BASE || 'http://localhost:4000/api';

  function escapeHtml(s) { return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  async function fetchLikeCount(articleId, el) {
    try {
      const res = await fetch(`${API_BASE}/likes/${articleId}`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      el.textContent = (data.count || 0) + ' likes';
    } catch (err) {
      el.textContent = '—';
      console.error('fetchLikeCount', err);
    }
  }

  async function postLike(articleId, countEl, btn) {
    try {
      const key = `liked:${articleId}`;
      if (localStorage.getItem(key)) return;
      const res = await fetch(`${API_BASE}/likes/${articleId}`, { method: 'POST' });
      if (!res.ok) throw new Error('like failed');
      const data = await res.json();
      countEl.textContent = (data.count || 0) + ' likes';
      localStorage.setItem(key, '1');
      if (btn) { btn.disabled = true; btn.textContent = '❤️ Liked'; }
      // lightweight toast
      try {
        let container = document.getElementById('toast-container');
        if (!container) { container = document.createElement('div'); container.id = 'toast-container'; container.className = 'tw-fixed tw-top-4 tw-right-4 tw-flex tw-flex-col tw-gap-2 tw-z-[9999]'; document.body.appendChild(container); }
        const t = document.createElement('div'); t.className = 'tw-bg-black/80 tw-text-white tw-px-4 tw-py-2 tw-rounded tw-shadow'; t.textContent = 'Liked — thanks!'; container.appendChild(t); setTimeout(() => { t.remove(); }, 2500);
      } catch (e) {}
    } catch (err) {
      console.error('postLike', err);
    }
  }

  function init() {
    const cards = Array.from(document.querySelectorAll('.post-card[data-article-id]'));
    cards.forEach(card => {
      const id = card.getAttribute('data-article-id');
      const countEl = card.querySelector('.like-count');
      const btn = card.querySelector('.like-btn');
      if (countEl) fetchLikeCount(id, countEl);
      if (btn) btn.addEventListener('click', () => postLike(id, countEl, btn));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
