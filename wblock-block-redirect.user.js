// ==UserScript==
// @name         Chặn redirect / mở tab mới – xem phim cùng site bình thường
// @description  Chặn redirect sang domain khác và mở tab mới; chuyển tập (cùng site) mở trong cùng tab
// @version      1.2.0
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const currentOrigin = location.origin;

  function getOrigin(url) {
    try {
      return new URL(url, location.origin).origin;
    } catch {
      return '';
    }
  }

  /** true = URL sang domain khác (cần chặn). Cùng domain (chuyển tập, cùng site) = false. */
  function isExternalUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const t = url.trim();
    if (t === '' || t === '#') return false;
    if (t.startsWith('#')) return false;
    if (t.toLowerCase().startsWith('javascript:')) return false;
    try {
      return getOrigin(t) !== currentOrigin;
    } catch {
      return true;
    }
  }

  function getHref(el) {
    const a = el.closest('a') || (el.tagName === 'A' ? el : null);
    return a ? (a.getAttribute('href') || a.href || '') : '';
  }

  function isNewTabLink(el) {
    const a = el.closest('a') || (el.tagName === 'A' ? el : null);
    if (!a) return false;
    const target = (a.getAttribute && a.getAttribute('target')) || a.target || '';
    return /_blank|_new|_window/i.test(target);
  }

  // Click: chặn link sang domain khác; link cùng site nhưng target="_blank" → chuyển trong cùng tab
  document.addEventListener(
    'click',
    function (e) {
      const href = getHref(e.target);
      if (!href) return;

      if (isExternalUrl(href)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }

      // Cùng site nhưng link mở tab mới (target="_blank") → mở trong cùng tab thay vì tab mới
      if (isNewTabLink(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        try {
          const fullUrl = new URL(href, location.origin).href;
          location.href = fullUrl;
        } catch (_) {}
        return false;
      }
    },
    true
  );

  // window.open: không cho mở tab mới; nếu URL cùng site thì chuyển trong cùng tab
  const rawOpen = window.open;
  window.open = function (url, target, features) {
    if (!url) return rawOpen.apply(this, arguments);
    if (isExternalUrl(url)) return null;
    // Cùng site: chuyển trong cùng tab thay vì mở tab mới
    try {
      location.href = new URL(url, location.origin).href;
    } catch (_) {}
    return null;
  };

  // Chặn gán location sang domain khác
  const desc = Object.getOwnPropertyDescriptor(window, 'location');
  if (desc && desc.set) {
    const rawSet = desc.set;
    Object.defineProperty(window, 'location', {
      get: desc.get,
      set: function (v) {
        if (v && isExternalUrl(v)) return;
        rawSet.call(window, v);
      },
      configurable: true,
      enumerable: true,
    });
  }

  try {
    const loc = window.location;
    const hrefDesc = Object.getOwnPropertyDescriptor(loc, 'href');
    if (hrefDesc && hrefDesc.set) {
      const rawHrefSet = hrefDesc.set;
      Object.defineProperty(loc, 'href', {
        get: hrefDesc.get,
        set: function (v) {
          if (v && isExternalUrl(v)) return;
          rawHrefSet.call(loc, v);
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch (_) {}

  // Form submit sang domain khác → chặn
  document.addEventListener(
    'submit',
    function (e) {
      const form = e.target;
      if (!form) return;
      const action = (form.getAttribute && form.getAttribute('action')) || form.action;
      if (action && isExternalUrl(action)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    true
  );

  console.log('[Block Redirect] Đã bật – chặn redirect sang domain khác và mở tab mới; chuyển tập cùng site trong cùng tab.');
})();
