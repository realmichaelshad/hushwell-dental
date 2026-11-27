/**
 * Inline in <head>: adds html.motion-ok before first paint unless the visitor prefers reduced motion,
 * and takes it away again if the motion engine (MotionRoot) hasn't started within 4 seconds, so content can
 * never stay hidden. Also flags ?showcase= captures, which settle every animation instantly.
 */
export const MOTION_BOOT = `(function(){var d=document.documentElement;if(window.matchMedia&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion-ok");setTimeout(function(){if(!d.classList.contains("motion-ready"))d.classList.remove("motion-ok")},4000)}if(location.search.indexOf("showcase=")>-1)d.dataset.showcase="1"})();`;
