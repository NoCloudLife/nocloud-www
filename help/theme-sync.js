/* Sincroniza el día/noche de la ayuda (MkDocs Material) con el resto del sitio, que guarda la
   preferencia en localStorage['nc_theme'] (mismo source, ver apps/shared/theme.js). portal→ayuda
   al cargar; el toggle de Material (ayuda→portal) se refleja de vuelta. Experiencia uniforme.
   nc_theme es la clave actual desde que theme.js migró de cc-theme (que ya no se escribe ni se
   lee en ningún sitio, incluido aquí -- usarla dejaba este sync leyendo/escribiendo una clave
   muerta, dos estados de tema completamente independientes). */
(function () {
  var KEY = "nc_theme";
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

  function enhanceNavigation() {
    document.querySelectorAll(".md-nav__item--nested > input.md-nav__toggle").forEach(function (toggle) {
      if (toggle.dataset.nocloudReady) return;
      var label = document.querySelector('label[for="' + toggle.id + '"]');
      if (!label) return;
      var panel = toggle.parentElement.querySelector(":scope > .md-nav");
      if (panel) {
        panel.id = toggle.id + "-panel";
        label.setAttribute("aria-controls", panel.id);
      }
      var title = label.textContent.replace(/\s+/g, " ").trim();
      function state() {
        label.setAttribute("aria-expanded", String(toggle.checked));
        label.setAttribute("aria-label", (toggle.checked ? "Collapse " : "Expand ") + title);
      }
      toggle.dataset.nocloudReady = "true";
      label.classList.add("ncm-nav-toggle");
      label.tabIndex = 0;
      label.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggle.checked = !toggle.checked;
        toggle.dispatchEvent(new Event("change", { bubbles: true }));
      });
      toggle.addEventListener("change", state);
      state();
    });
  }
  enhanceNavigation();
  document.addEventListener("DOMContentLoaded", enhanceNavigation);
  if (window.document$) document$.subscribe(enhanceNavigation);
})();
