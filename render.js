// render.js — builds a song page from songs.js.
// Each song page is a shell: <body data-song="..."> with an empty <main id="song">.

(function () {
  var song = window.SONGS.find(function (s) { return s.id === document.body.dataset.song; });
  var root = document.getElementById("song");
  if (!song || !root) return;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    (children || []).forEach(function (c) {
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function lines(arr, strong) {
    return (arr || []).map(function (text, i) {
      var content = (strong || []).indexOf(i) > -1 ? el("strong", {}, [text]) : text;
      return el("span", { "class": "line", "data-line": i }, [content]);
    });
  }

  // Title and blurb
  root.appendChild(el("div", { "class": "content" }, [
    el("h1", {}, [song.number + ". " + song.title.roman])
  ]));
  root.appendChild(el("div", { "class": "grid-container" }, [
    el("h2", { "class": "text-1 deva", lang: "ur-Deva" }, [song.title.deva]),
    el("p", { "class": "text-1" }, [song.blurb])
  ]));

  // Couplets: one unit per couplet, original beside translation
  var list = el("section", { "class": "couplets", "aria-label": "Lyrics and translation" }, [
    el("div", { "class": "couplets-head", "aria-hidden": "true" }, [
      el("h2", {}, ["Lyrics"]),
      el("h2", { "class": "translation" }, ["Translation"])
    ])
  ]);
  list.dataset.view = "translation";

  // [literal] / [translation]: literal lays the gloss over the translation.
  // Hidden until at least one couplet in this song has a gloss.
  if (song.couplets.some(function (c) { return c.gloss; })) {
    var views = ["literal", "translation"].map(function (view) {
      var b = el("button", { type: "button", "data-view": view, "aria-pressed": view === "translation" }, ["[" + view + "]"]);
      b.addEventListener("click", function () {
        list.dataset.view = view;
        views.forEach(function (o) { o.setAttribute("aria-pressed", o === b); });
      });
      return b;
    });
    list.appendChild(el("div", { "class": "view-toggle", role: "group", "aria-label": "Show" }, views));
  }

  song.couplets.forEach(function (c, n) {
    // Lines pair one to one only when both sides have the same number of lines
    var paired = !!(c.deva && c.translation && c.deva.length === c.translation.length);
    list.appendChild(el("div", {
      "class": "couplet",
      "data-id": c.id,
      "data-paired": paired,
      tabindex: "0",
      role: "group",
      "aria-label": "Couplet " + (n + 1)
    }, [
      el("div", { "class": "original", lang: "ur-Deva" }, lines(c.deva)),
      el("div", { "class": "version", lang: "en" }, [
        el("div", { "class": "gloss" }, lines(c.gloss)),
        el("div", { "class": "translation" }, lines(c.translation, c.strong))
      ])
    ]));
  });
  root.appendChild(list);

  // Highlighting: hover (mouse), tap (touch), focus + arrow keys (keyboard)
  var active = null;
  var pointerType = "mouse";

  function setActive(couplet, line) {
    if (active && active.couplet === couplet && active.line === line) return;
    clear();
    active = { couplet: couplet, line: line };
    list.classList.add("is-active");
    couplet.classList.add("is-active");
    if (line !== null && couplet.dataset.paired === "true") {
      couplet.classList.add("has-line");
      couplet.querySelectorAll('[data-line="' + line + '"]').forEach(function (l) {
        l.classList.add("is-active");
      });
    }
  }

  function clear() {
    active = null;
    list.classList.remove("is-active");
    list.querySelectorAll(".is-active, .has-line").forEach(function (n) {
      n.classList.remove("is-active", "has-line");
    });
  }

  function target(e) {
    var couplet = e.target.closest(".couplet");
    var line = e.target.closest(".line");
    return couplet && { couplet: couplet, line: line ? Number(line.dataset.line) : null };
  }

  list.addEventListener("pointerdown", function (e) { pointerType = e.pointerType; });

  list.addEventListener("pointerover", function (e) {
    if (e.pointerType === "touch") return;
    var t = target(e);
    if (t) setActive(t.couplet, t.line);
  });

  list.addEventListener("pointerleave", function (e) {
    if (e.pointerType !== "touch" && !list.querySelector(".couplet:focus-visible")) clear();
  });

  // Tap toggles; tapping the same line again clears
  list.addEventListener("click", function (e) {
    if (pointerType === "mouse") return;
    var t = target(e);
    if (!t) return clear();
    if (active && active.couplet === t.couplet && active.line === t.line) clear();
    else setActive(t.couplet, t.line);
  });

  // Only keyboard focus; a mouse click also focuses, but hover already handles it
  list.addEventListener("focusin", function (e) {
    if (e.target.matches(".couplet:focus-visible")) setActive(e.target, null);
  });

  list.addEventListener("focusout", function (e) {
    if (!list.contains(e.relatedTarget)) clear();
  });

  // Arrow keys step through lines of a focused couplet; Escape clears
  list.addEventListener("keydown", function (e) {
    var couplet = e.target.closest(".couplet");
    if (!couplet) return;
    if (e.key === "Escape") return clear();
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    if (couplet.dataset.paired !== "true") return;
    e.preventDefault();
    var count = couplet.querySelectorAll(".original .line").length;
    var line = active && active.couplet === couplet ? active.line : null;
    line = line === null ? (e.key === "ArrowDown" ? 0 : count - 1)
                         : (line + (e.key === "ArrowDown" ? 1 : -1) + count) % count;
    setActive(couplet, line);
  });
})();
