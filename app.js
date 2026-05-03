/**
 * Google Pay Maintenance App — Enhanced Logic
 * Realistic splash → app load → maintenance dialog → close
 */

(function () {
  'use strict';

  // ── Update status bar time ──
  function updateTime() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    h = h % 12 || 12;
    const el = document.getElementById('status-time');
    if (el) el.textContent = h + ':' + m;
  }
  updateTime();

  // ── DOM refs ──
  const splash       = document.getElementById('splash-screen');
  const appScreen    = document.getElementById('app-screen');
  const overlay      = document.getElementById('maintenance-overlay');
  const dialog       = document.getElementById('maintenance-dialog');
  const closeAnim    = document.getElementById('close-animation');
  const closedScreen = document.getElementById('closed-screen');

  // ── Phase 1: Splash → App ──
  // Show splash for 3 seconds (feels like real app loading)
  setTimeout(() => {
    splash.classList.add('fade-out');

    // After fade animation, reveal the main app
    setTimeout(() => {
      splash.classList.add('hidden');
      appScreen.classList.remove('hidden');

      // ── Phase 2: Show maintenance dialog after a brief "loading" feel ──
      setTimeout(() => {
        overlay.classList.remove('hidden');
      }, 600);
    }, 600); // match CSS transition duration

  }, 3000);

  // ── Material ripple effect on OK button ──
  const okBtn = document.getElementById('ok-button');
  const rippleEl = document.getElementById('btn-ripple');

  function createRipple(e) {
    const rect = okBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    rippleEl.style.width = rippleEl.style.height = size + 'px';
    rippleEl.style.left = x + 'px';
    rippleEl.style.top = y + 'px';
    rippleEl.classList.remove('active');

    // Force reflow to restart animation
    void rippleEl.offsetWidth;
    rippleEl.classList.add('active');
  }

  // ── Close app handler ──
  window.closeApp = function (e) {
    if (e) createRipple(e);

    // Small delay for ripple to play
    setTimeout(() => {
      // Animate dialog out
      dialog.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 1, 1), opacity 0.25s ease';
      dialog.style.transform = 'scale(0.85) translateY(20px)';
      dialog.style.opacity = '0';

      // Fade overlay
      overlay.style.transition = 'opacity 0.3s ease';
      overlay.style.opacity = '0';

      setTimeout(() => {
        overlay.classList.add('hidden');

        // ── Phase 3: Circle-close animation ──
        closeAnim.classList.remove('hidden');

        // After circle fills screen, show black
        setTimeout(() => {
          closeAnim.classList.add('hidden');
          appScreen.classList.add('hidden');
          closedScreen.classList.remove('hidden');
        }, 500);

      }, 300);
    }, 200);
  };

  // Attach click with event for ripple coordinates
  okBtn.addEventListener('click', function(e) {
    window.closeApp(e);
  });

  // Prevent the inline onclick from double-firing
  okBtn.removeAttribute('onclick');

})();
