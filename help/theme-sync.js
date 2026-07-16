/* Sincroniza el día/noche de la ayuda (MkDocs Material) con el resto del sitio, que guarda la
   preferencia en localStorage['cc-theme'] (mismo origen). portal→ayuda al cargar; el toggle de
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
})();
