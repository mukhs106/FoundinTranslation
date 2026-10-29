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
  let hoverId = null;
  let focusId = null;
  let pinnedId = null;

  function render() {
    const active = hoverId || focusId || pinnedId;
    couplets.forEach((c) => c.classList.toggle("is-active", c.id === active));
  }

  couplets.forEach((c) => {
    c.tabIndex = 0;
    c.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hoverId = c.id; render(); } });
    c.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hoverId = null; render(); } });
    c.addEventListener("focus", () => { focusId = c.id; render(); });
    c.addEventListener("blur", () => { focusId = null; render(); });
    c.addEventListener("click", () => {
      if (pinnedId === c.id) {
        pinnedId = null;
        c.blur();
      } else {
        pinnedId = c.id;
      }
      render();
    });
  });

  const fromHash = decodeURIComponent(location.hash.slice(1));
  if (couplets.some((c) => c.id === fromHash)) { pinnedId = fromHash; render(); }

  // ---- Recordings ----
  const dataEl = document.getElementById("performance-data");
  if (!dataEl) return;

  const renditions = JSON.parse(dataEl.textContent);
  const now = document.querySelector(".now");
  const player = document.querySelector(".player");

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
    // r.label already names the performer, e.g. "Farida Khanum, 2015".
    const label = r.label;
    if (p && p.type === "youtube") {
      player.append(el("iframe", {
        class: "yt",
        src: "https://www.youtube-nocookie.com/embed/" + p.id + "?rel=0",
        title: "Recording: " + label + " (YouTube player)",
        allow: "encrypted-media; picture-in-picture",
        allowfullscreen: "",
      }));
    } else if (p && p.type === "bandcamp") {
      player.append(el("iframe", {
        class: "bc",
        src: "https://bandcamp.com/EmbeddedPlayer/track=" + p.track + "/size=large/bgcol=ffffff/linkcol=850000/artwork=none/tracklist=false/transparent=true/",
        title: "Recording: " + label + " (Bandcamp player)",
        seamless: "",
      }));
    } else if (p && p.type === "audio") {
      player.append(audioPlayer(p.src, label));
    }
    if (r.link) {
      const line = el("p", { class: "elsewhere" });
      line.append(el("a", { href: r.link.href, target: "_blank", rel: "noopener" }, r.link.label));
      player.append(line);
    }
  }

  function select(r) {
    now.replaceChildren();
    now.append(el("p", { class: "ctx" }, r.context + "."));
    if (r.about) now.append(el("p", { class: "about" }, r.about));
    mountPlayer(r);
  }

  document.querySelectorAll('input[name="rendition"]').forEach((input) => {
    const r = renditions.find((x) => x.id === input.value);
    input.addEventListener("change", () => select(r));
    if (input.checked) select(r);
  });
})();
