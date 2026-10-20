// Linked couplet highlighting, rendition selector and verse map.
// Pages work without this script: couplets, translations and glosses are plain HTML.
(function () {
  const couplets = Array.from(document.querySelectorAll(".couplet[id]"));
  if (!couplets.length) return;

  const byId = new Map(couplets.map((el) => [el.id, el]));
  const coreIds = couplets.filter((el) => !el.closest(".couplets.added")).map((el) => el.id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let hoverId = null;
  let focusId = null;
  let pinnedId = null;
  let mapButtons = [];

  function render() {
    const active = hoverId || focusId || pinnedId;
    couplets.forEach((el) => el.classList.toggle("is-active", el.id === active));
    mapButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.target === active));
  }

  couplets.forEach((el) => {
    el.tabIndex = 0;
    el.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") { hoverId = el.id; render(); }
    });
    el.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse") { hoverId = null; render(); }
    });
    el.addEventListener("focus", () => { focusId = el.id; render(); });
    el.addEventListener("blur", () => { focusId = null; render(); });
    el.addEventListener("click", () => {
      if (pinnedId === el.id) {
        pinnedId = null;
        el.blur();
      } else {
        pinnedId = el.id;
      }
      render();
    });
  });

  // ---- Rendition selector + verse map ----
  const dataEl = document.getElementById("performance-data");
  const options = document.querySelector(".rendition-options");
  const detail = document.querySelector(".rendition-detail");
  const vmap = document.querySelector(".vmap");
  const caption = document.querySelector(".vmap-caption");

  if (dataEl && options && detail && vmap) {
    const data = JSON.parse(dataEl.textContent);
    const unit = data.unit || "couplet";

    data.renditions.forEach((r, i) => {
      const label = document.createElement("label");
      label.innerHTML = '<input type="radio" name="rendition"><span>[' + r.label + "]</span>";
      const input = label.querySelector("input");
      input.value = r.id;
      if (i === 0) input.checked = true;
      input.addEventListener("change", () => select(r));
      options.appendChild(label);
    });

    function cellLabel(id) {
      const el = byId.get(id);
      return el ? el.querySelector(".c-num").textContent.trim() : id;
    }

    function select(r) {
      const m = r.map || { core: "unknown" };
      let html = r.detail;
      if (r.url) {
        html += ' <a href="' + r.url + '" target="_blank" rel="noopener">[' + (r.linkLabel || "listen") + " ↗]</a>";
      }
      detail.innerHTML = html;

      const omitted = new Set(m.omitted || []);
      const repeated = m.repeated || {};
      const added = m.added || [];
      const order = m.order || coreIds.concat(added);

      vmap.innerHTML = "";
      mapButtons = order.map((id) => {
        let state = "source";
        if (added.includes(id)) state = "added";
        else if (m.core === "unknown") state = "unknown";
        else if (omitted.has(id)) state = "omitted";

        const li = document.createElement("li");
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.target = id;
        b.dataset.state = state;
        b.textContent = cellLabel(id);
        if (repeated[id]) {
          const sup = document.createElement("sup");
          sup.textContent = "×" + repeated[id];
          b.appendChild(sup);
        }
        const stateText = {
          source: "in the source text",
          unknown: "not documented for this rendition",
          omitted: "omitted in this rendition",
          added: "added in performance",
        }[state];
        b.setAttribute("aria-label", unit + " " + b.textContent + ", " + stateText);

        b.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hoverId = id; render(); } });
        b.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hoverId = null; render(); } });
        b.addEventListener("focus", () => { hoverId = id; render(); });
        b.addEventListener("blur", () => { hoverId = null; render(); });
        b.addEventListener("click", () => {
          pinnedId = id;
          render();
          byId.get(id).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        });

        li.appendChild(b);
        vmap.appendChild(li);
        return b;
      });

      caption.textContent = m.order
        ? "Performance order, as documented"
        : r.id === "source"
          ? "Source order"
          : "Source order — performance order not documented";
      render();
    }

    select(data.renditions[0]);
  }

  // A #c03-style link pins that couplet.
  const fromHash = decodeURIComponent(location.hash.slice(1));
  if (byId.has(fromHash)) { pinnedId = fromHash; render(); }
})();
