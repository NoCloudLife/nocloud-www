/* Sincroniza el día/noche de la ayuda (MkDocs Material) con el resto del sitio, que guarda la
   preferencia en localStorage['cc-theme'] (mismo source). portal→ayuda al cargar; el toggle de
   Material (ayuda→portal) se refleja de vuelta. Experiencia uniforme. */
(function () {
  var KEY = "cc-theme";
  var scheme = function (t) { return t === "dark" ? "slate" : "default"; };
  var theme = function (s) { return s === "slate" ? "dark" : "light"; };
  function apply(t) {
    var s = scheme(t);
    document.body.setAttribute("data-md-color-scheme", s);
    try { localStorage.setItem("__palette", JSON.stringify({ index: s === "slate" ? 0 : 1, color: { scheme: s, primary: "indigo", accent: "indigo" } })); } catch (e) {}
  }
  var t = localStorage.getItem(KEY) || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  apply(t);
  // el toggle de Material cambia data-md-color-scheme → reflejarlo en cc-theme para el resto del sitio
  new MutationObserver(function () {
    var nt = theme(document.body.getAttribute("data-md-color-scheme"));
    if (nt !== localStorage.getItem(KEY)) localStorage.setItem(KEY, nt);
  }).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });

  // Material only auto-expands the ACTIVE top-level section's toggle; the rest render collapsed
  // (grid-template-rows:0fr) unless the reader clicks each one open. Since css/extra.css already
  // widens Material's own >=76.25em "always-expanded, non-accordion sections" treatment down to
  // 60em (a normal, un-maximized desktop window), force every section open here too — same
  // :checked selector Material's CSS already keys off, just not left to per-section clicking.
  // ONLY below 60em this must stay untouched: the mobile drawer reuses these same checkboxes to
  // pick which single drilldown panel slides into view, so forcing them all on there breaks it
  // (lands on whichever section is last in the DOM instead of the top-level list).
  var wide = matchMedia("(min-width: 60em)");
  function expandAllSections() {
    if (!wide.matches) return;
    document.querySelectorAll(
      ".md-nav--primary > .md-nav__list > .md-nav__item--section > input.md-nav__toggle"
    ).forEach(function (t) { t.checked = true; });
  }
  expandAllSections();
  document.addEventListener("DOMContentLoaded", expandAllSections);
  // navigation.instant swaps page content via fetch; re-apply after each such swap.
  if (window.document$) document$.subscribe(expandAllSections);
  // Crossing the breakpoint via window resize (not just a fresh load) should also (un)apply it —
  // including reverting on the way back down, so the drawer's drilldown isn't left stuck on
  // whichever section happened to be last checked.
  wide.addEventListener("change", function (e) {
    if (e.matches) { expandAllSections(); return; }
    document.querySelectorAll(
      ".md-nav--primary > .md-nav__list > .md-nav__item--section:not(.md-nav__item--active) > input.md-nav__toggle"
    ).forEach(function (t) { t.checked = false; });
  });
})();
