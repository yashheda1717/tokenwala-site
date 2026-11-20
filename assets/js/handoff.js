// Tokenwala /e/CODE and /s/CODE handoff.
// 1. Read the code from the path (/e/CODE, /s/CODE) or ?c=CODE.
// 2. Try the app: tokenwala://e/CODE or tokenwala://s/CODE
//    (Android: intent:// URL with a fallback back to this page; iOS: only on tap,
//    because Safari shows an error alert for an unknown scheme).
// 3. Always offer the web wallet: /w/#/e/CODE or /w/#/s/CODE.
(function () {
  var k0 = document.documentElement.getAttribute('data-kind');
  var kind = k0 === 's' || k0 === 't' ? k0 : 'e';
  var ANDROID_PACKAGE = 'in.tokenwala.tokenwala';
  var $ = function (id) { return document.getElementById(id); };

  function readCode() {
    var parts = location.pathname.split('/').filter(Boolean);
    var i = parts.indexOf(kind);
    var fromPath = i >= 0 && parts[i + 1] && parts[i + 1] !== 'index.html' ? parts[i + 1] : '';
    var fromQuery = new URLSearchParams(location.search).get('c') || '';
    var raw = fromPath || fromQuery;
    try { raw = decodeURIComponent(raw); } catch (e) { /* keep raw */ }
    return raw.replace(/\s+/g, '');
  }
  function valid(c) { return /^[A-Za-z0-9_-]{3,64}$/.test(c); }
  function pretty(c) { return c.length === 8 && /^[A-Z0-9]+$/.test(c) ? c.slice(0, 4) + ' ' + c.slice(4) : c; }

  var code = readCode();
  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var noApp = location.hash === '#noapp';

  if (!valid(code)) {
    $('ok').hidden = true;
    $('bad').hidden = false;
    if (code) $('bad-msg').hidden = false;
    var form = $('code-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('code-input').value.replace(/\s+/g, '').toUpperCase();
      if (valid(v)) location.href = '/' + kind + '/' + encodeURIComponent(v);
      else { $('code-input').setAttribute('aria-invalid', 'true'); $('code-hint').textContent = $('code-hint').getAttribute('data-err'); $('code-input').focus(); }
    });
    return;
  }

  var enc = encodeURIComponent(code);
  var appUrl = 'tokenwala://' + kind + '/' + enc;
  var webUrl = '/w/#/' + kind + '/' + enc;
  var here = location.origin + location.pathname + location.search + '#noapp';
  var intentUrl = 'intent://' + kind + '/' + enc + '#Intent;scheme=tokenwala;package=' + ANDROID_PACKAGE +
    ';S.browser_fallback_url=' + encodeURIComponent(here) + ';end';

  $('code').textContent = pretty(code);
  document.title = document.title.replace(' · ', ' ' + pretty(code) + ' · ');
  $('open-app').href = isAndroid ? intentUrl : appUrl;
  if (!isAndroid && !isIOS) $('open-app').hidden = true; // no app on desktop
  $('open-web').href = webUrl;

  var status = $('status');
  function say(text, spin) {
    status.innerHTML = '';
    if (spin) { var s = document.createElement('span'); s.className = 'spinner'; s.setAttribute('aria-hidden', 'true'); status.appendChild(s); }
    status.appendChild(document.createTextNode(text));
  }

  if (noApp) {
    say(status.getAttribute('data-noapp'));
  } else if (isAndroid) {
    say(status.getAttribute('data-opening'), true);
    setTimeout(function () { location.href = intentUrl; }, 250);
    setTimeout(function () { if (!document.hidden) say(status.getAttribute('data-fallback')); }, 2200);
  } else if (isIOS) {
    say(status.getAttribute('data-ios'));
  } else {
    say(status.getAttribute('data-desktop'));
  }
})();
