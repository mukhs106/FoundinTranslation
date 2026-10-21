// Reading choices, linked couplet highlighting, and the recording player.
// Pages work without this script: the default script, translation and every
// recording link are plain HTML.
(function () {
  const root = document.documentElement;

  // ---- Script and translation choices (remembered across pages) ----
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } },
  };

  document.querySelectorAll(".controls .choice").forEach((fieldset) => {
    const name = fieldset.dataset.choice;
    const attr = name === "script" ? "script" : "trans";
    const inputs = Array.from(fieldset.querySelectorAll("input"));
    const saved = store.get("fit." + name);
    const match = inputs.find((i) => i.value === saved);
    if (match) {
      match.checked = true;
      root.dataset[attr] = saved;
    }
    inputs.forEach((input) => input.addEventListener("change", () => {
      root.dataset[attr] = input.value;
      store.set("fit." + name, input.value);
    }));
  });

  // ---- Linked highlighting ----
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

  function hoverable(el, id) {
    el.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hoverId = id; render(); } });
    el.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hoverId = null; render(); } });
  }

  couplets.forEach((el) => {
    el.tabIndex = 0;
    hoverable(el, el.id);
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

  const fromHash = decodeURIComponent(location.hash.slice(1));
  if (byId.has(fromHash)) pinnedId = fromHash;

  // ---- Recordings ----
  const dataEl = document.getElementById("performance-data");
  if (!dataEl) { render(); return; }

  const data = JSON.parse(dataEl.textContent);
  const options = document.querySelector(".renditions .choice-options");
  const now = document.querySelector(".now");
  const player = document.querySelector(".player");
  const vmap = document.querySelector(".vmap");
  const caption = document.querySelector(".vmap-caption");

  function el(tag, attrs, text) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    if (text) node.textContent = text;
    return node;
  }

  function time(s) {
    if (!isFinite(s)) return "0:00";
    s = Math.floor(s);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  // A native player for audio files hosted with the site.
  function audioPlayer(src, label) {
    const wrap = el("div", { class: "audio", role: "group", "aria-label": "Audio player: " + label });
    const audio = el("audio", { preload: "metadata", src: src });
    const button = el("button", { type: "button" }, "Play");
    const seek = el("input", { type: "range", min: "0", max: "0", step: "1", value: "0", "aria-label": "Seek" });
    const clock = el("span", { class: "time" }, "0:00 / 0:00");
    const update = () => {
      seek.max = Math.floor(audio.duration) || 0;
      seek.value = Math.floor(audio.currentTime);
      clock.textContent = time(audio.currentTime) + " / " + time(audio.duration);
      seek.setAttribute("aria-valuetext", time(audio.currentTime) + " of " + time(audio.duration));
    };
    button.addEventListener("click", () => (audio.paused ? audio.play() : audio.pause()));
    audio.addEventListener("play", () => { button.textContent = "Pause"; });
    audio.addEventListener("pause", () => { button.textContent = "Play"; });
    audio.addEventListener("loadedmetadata", update);
    audio.addEventListener("timeupdate", update);
    seek.addEventListener("input", () => { audio.currentTime = Number(seek.value); });
    wrap.append(button, seek, clock, audio);
    return wrap;
  }

  // Only one player exists at a time: replacing it stops whatever was playing.
  function mountPlayer(r) {
    player.replaceChildren();
    const p = r.player;
    if (r.id === "source") return;
    if (!p) {
      player.append(el("p", { class: "missing" }, r.missing || "No playable recording is available for this rendition yet."));
      return;
    }
    const label = r.performer + ", " + r.label;
    if (p.type === "youtube") {
      player.append(el("iframe", {
        class: "yt",
        src: "https://www.youtube-nocookie.com/embed/" + p.id + "?rel=0",
        title: "Recording: " + label + " (YouTube player)",
        allow: "encrypted-media; picture-in-picture",
        allowfullscreen: "",
      }));
      player.append(el("p", { class: "provider" }, "Plays in YouTube’s player."));
    } else if (p.type === "bandcamp") {
      player.append(el("iframe", {
        class: "bc",
        src: "https://bandcamp.com/EmbeddedPlayer/track=" + p.track + "/size=large/bgcol=ffffff/linkcol=850000/artwork=none/tracklist=false/transparent=true/",
        title: "Recording: " + label + " (Bandcamp player)",
        seamless: "",
      }));
      player.append(el("p", { class: "provider" }, "Plays in Bandcamp’s audio player, from the artist’s own page."));
    } else if (p.type === "audio") {
      player.append(audioPlayer(p.src, label));
    }
    if (r.link) {
      const line = el("p", { class: "provider" });
      line.append(el("a", { href: r.link.href, target: "_blank", rel: "noopener" }, r.link.label));
      player.append(line);
    }
  }

  function renderNow(r) {
    now.replaceChildren();
    if (r.performer) now.append(el("p", { class: "who" }, r.performer));
    if (r.context) now.append(el("p", { class: "ctx" }, r.context));
    if (r.about) now.append(el("p", { class: "about" }, r.about));
  }

  function renderMap(r) {
    const m = r.map || { core: "unknown" };
    const added = m.added || [];
    const omitted = new Set(m.omitted || []);
    const repeated = m.repeated || {};
    const order = m.order || coreIds.concat(added);
    const stateText = {
      source: "in the text",
      unknown: "not documented for this recording",
      omitted: "omitted in this recording",
      added: "added in performance",
    };

    vmap.replaceChildren();
    mapButtons = order.map((id) => {
      let state = "source";
      if (added.includes(id)) state = "added";
      else if (m.core === "unknown") state = "unknown";
      else if (omitted.has(id)) state = "omitted";

      const num = byId.get(id).querySelector(".c-num").textContent.trim();
      const b = el("button", { type: "button", "data-target": id, "data-state": state }, num);
      if (repeated[id]) b.append(el("sup", {}, "×" + repeated[id]));
      b.setAttribute("aria-label", data.unit + " " + num + ", " + stateText[state]);
      hoverable(b, id);
      b.addEventListener("focus", () => { hoverId = id; render(); });
      b.addEventListener("blur", () => { hoverId = null; render(); });
      b.addEventListener("click", () => {
        pinnedId = id;
        render();
        byId.get(id).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      });
      const li = el("li");
      li.append(b);
      vmap.append(li);
      return b;
    });

    caption.textContent = m.order
      ? "In the order sung in this recording."
      : r.id === "source"
        ? "In the order of the text."
        : "In the order of the text. The order sung in this recording is not documented.";
    render();
  }

  function select(r) {
    renderNow(r);
    mountPlayer(r);
    renderMap(r);
  }

  data.renditions.forEach((r, i) => {
    const label = el("label");
    const input = el("input", { type: "radio", name: "rendition", value: r.id });
    input.checked = i === 0;
    input.addEventListener("change", () => select(r));
    label.append(input, el("span", {}, r.label));
    options.append(label);
  });

  select(data.renditions[0]);
})();
