/* Nonessential moving backdrop: static poster is always available. */
(function () {
  const video = document.getElementById('background-video');
  if (!video) return;
  const desktop = window.matchMedia('(min-width: 981px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let initialized = false;
  function allowed() {
    if (!desktop.matches || reduced.matches || (connection && (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType)))) return false;
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
    return true;
  }
  function update() {
    if (!allowed()) {
      video.pause();
      return;
    }
    if (!initialized) {
      initialized = true;
      video.src = '/background.mp4';
      video.load();
    }
    if (!document.hidden) {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    }
  }
  video.addEventListener('playing', () => document.documentElement.classList.add('background-video-playing'));
  video.addEventListener('pause', () => document.documentElement.classList.remove('background-video-playing'));
  video.addEventListener('error', () => document.documentElement.classList.remove('background-video-playing'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else update();
  });
  desktop.addEventListener('change', update);
  reduced.addEventListener('change', update);
  // Download video after useful content has had a chance to paint.
  if ('requestIdleCallback' in window) window.requestIdleCallback(update, { timeout: 2200 });
  else window.setTimeout(update, 650);
})();
