// ==UserScript==
// @name         Chặn redirect quảng cáo (Shopee, TikTok, affiliate...)
// @description  Chặn khi click button/link bị redirect sang Shopee, TikTok hoặc trang quảng cáo
// @version      1.0.0
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  // Danh sách domain cần chặn (redirect không mong muốn)
  const BLOCKED_DOMAINS = [
    'shopee.',
    'tiktok.com',
    'lazada.',
    'affiliate',
    'redirect',
    'tracking',
    'click.doubleclick',
    'ad.doubleclick',
    'go.redirectingat',
    'linksynergy',
    'shareasale',
    'amazon.com/gp/redirect',
    'ebay.com/rtn',
    'bit.ly',
    't.co',
    'adf.ly',
    'ouo.io',
    'shink.in',
    'bc.vc',
    'adfly',
    'shortest.link',
    'shope.ee',
    's.shopee',
    'vt.tiktok',
  ];

  function getDomain(url) {
    try {
      return new URL(url, location.origin).hostname.toLowerCase();
    } catch {
      return '';
    }
  }

  function getHref(el) {
    const a = el.closest('a') || (el.tagName === 'A' ? el : null);
    return a ? (a.getAttribute('href') || a.href || '') : '';
  }

  function isBlockedUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();
    return BLOCKED_DOMAINS.some((d) => lower.includes(d));
  }

  function isBlockedHost(host) {
    if (!host) return false;
    const lower = host.toLowerCase();
    return BLOCKED_DOMAINS.some((d) => lower.includes(d));
  }

  // Chặn click vào link dẫn tới domain bị chặn
  document.addEventListener(
    'click',
    function (e) {
      const href = getHref(e.target);
      if (!href) return;
      if (isBlockedUrl(href)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      try {
        const fullUrl = new URL(href, location.origin).href;
        const host = getDomain(fullUrl);
        if (isBlockedHost(host)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      } catch (_) {}
    },
    true
  );

  // Chặn gán window.location / window.open tới domain bị chặn
  const rawOpen = window.open;
  window.open = function (url, target, features) {
    if (url && isBlockedUrl(url)) return null;
    try {
      const host = getDomain(url);
      if (isBlockedHost(host)) return null;
    } catch (_) {}
    return rawOpen.apply(this, arguments);
  };

  const desc = Object.getOwnPropertyDescriptor(window, 'location');
  if (desc && desc.set) {
    const rawSet = desc.set;
    Object.defineProperty(window, 'location', {
      get: desc.get,
      set: function (v) {
        if (v && (isBlockedUrl(v) || isBlockedHost(getDomain(v)))) return;
        rawSet.call(window, v);
      },
      configurable: true,
      enumerable: true,
    });
  }

  // Chặn thay đổi location.href
  try {
    const loc = window.location;
    const hrefDesc = Object.getOwnPropertyDescriptor(loc, 'href');
    if (hrefDesc && hrefDesc.set) {
      const rawHrefSet = hrefDesc.set;
      Object.defineProperty(loc, 'href', {
        get: hrefDesc.get,
        set: function (v) {
          if (v && (isBlockedUrl(v) || isBlockedHost(getDomain(v)))) return;
          rawHrefSet.call(loc, v);
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch (_) {}

  // Chặn form submit redirect tới domain bị chặn
  document.addEventListener(
    'submit',
    function (e) {
      const form = e.target;
      if (form && form.action && isBlockedUrl(form.action)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    true
  );

  console.log('[Block Redirect] Script đã bật – chặn redirect tới Shopee, TikTok, affiliate...');
})();
