# Phase 1 audit — Found in Translation

Read-only audit of the site as uploaded (commit `895546f`). No site files were changed.
O = couplet in the Lyrics column, T = couplet in the Translation column. Quotes are truncated.

## 1. Couplet correspondence

### song1 — Ranjish Hi Sahi (6 original → 8 translated)

| T | Translation starts | Matches | Issue |
|---|---|---|---|
| T1 | "Let it be anguish…" | O1 रंजिश ही सही | ✓ |
| T2 | "If not for past affections…" | O3 पहले से मरासिम | out of order |
| T3 | "How many people will I explain…" | O4 किस किस को बताएँगे | out of order |
| T4 | "Respect, if only a little, the pride…" | O2 कुछ तो मिरे पिंदार | out of order |
| T5 | "For ages, I have been deprived…" | O5 इक उम्र से | ✓ |
| T6 | "Till now, my naive heart…" | O6 अब तक दिल-ए-ख़ुश-फ़ह्म | ✓ |
| T7 | "Agreed, concealing love…" | no original on page | TODO: original |
| T8 | "Just as you have excuses…" | no original on page | TODO: original |

Translation order: O1, O3, O4, O2, O5, O6, then two couplets with no original (possibly from a sung version).

### song2 — Aaj Jaane Ki Zidd Na Karo (geet; 7 stanzas → 7)

| Stanza | Original lines | Translation lines | Issue |
|---|---|---|---|
| 1 | 4 (refrain ×2, यूँ ही पहलु…, refrain) | 3 | refrain collapsed; lines don't pair 1:1 |
| 2–5 | 4 / 4 / 3 / 4 | 4 / 4 / 3 / 4 | ✓ |
| 6 | 4 | 4 | ✓, but "जानेजाँ" is line 3 in the original, "my love" is line 4 in the translation |
| 7 | 2 (refrain ×2) | 1 | collapsed |

Order is fine; line-level pairing is not. The refrain is bold in stanzas 1 and 7 but not in 2 and 4.

### song3 — Baat Karni Mujhe Mushkil (9 original → 6 translated)

| T | Translation starts | Matches |
|---|---|---|
| T1 | "It was never this difficult…" | O1 ✓ |
| T2 | "Who has stolen away your peace…" | O2 ✓ |
| T3 | "Your deadly eyes…" | O8 चश्म-ए-क़ातिल (out of order) |
| T4 | "God knows what sorcery…" | O3 |
| T5 | "O moon, what secret light…" | O4 |
| T6 | "Why do you turn against me, Zafar…" | O9 (maqta) |
| — | untranslated | O5 राह-ए-मोहब्बत, O6 आवाज़-ए-सलासिल, O7 निगह-ए-यार |

The blurb mentions "chains echoing in solitude" (O6), which has no translation.

### song4 — Mohobbat Karne Wale (9 → 9)

All nine couplets correspond 1:1, in order.

### Rendering bug (song3, song4)

Neither page has any `<br>`, so each column collapses into one run-on paragraph (`song3.html:29-54`, `song4.html:29-87`).

## 2. Title and transliteration inconsistencies

| Song | Ghazals list (`song.html`) | Page `<h1>` | Elsewhere |
|---|---|---|---|
| 1 | "Ranjishi Sahi" | "Ranjish hi sahi" (lowercase) | blurb: "Ranjish Hi Sahi" |
| 2 | "Aaj Jaane Ki Zidd Na Karo" | "Zidd" | blurb: "Zid" |
| 3 | "Baat Karni Thi" | "Baat Karni Mujhe Mushkil" | `template.html`: "Baat Karni Thi" |
| 4 | "Mohobbat Karne Wale" | same | Devanagari मोहब्बत… कम न होंगे (Roman title cut short); poet "Hafeez" in blurb, "Hafiz" in last translated couplet |

Queries only — spellings are the author's call:

- song2 refrain written both ना and न (`song2.html:37`).
- song2 "बैराज" (`song2.html:59`) and "पहलु" (`:36`) — check against source.

## 3. Code issues

| Issue | Where | Notes |
|---|---|---|
| Lyrics grid clips | `style.css:122` | Two `minmax(500px)` tracks need 1020px but `max-width` is 900px, so the grid always overflows; `body{overflow-x:hidden}` hides it, so text can't be scrolled to. Measured hidden translation: 20px at 1100px, 120px at 900px, 645px at 375px. `.text-9`'s `-55px` margin pushes the original off-screen too. |
| Unused script | `script.js` | Not loaded anywhere; needs GSAP (not loaded); targets `#title span` (none exist); letter arrays differ in length (18 vs 20). |
| Duplicate home page | `index.html` / `entry1.html` | Identical apart from one comment. |
| Orphaned template | `template.html` | Nothing links to it; stale copy of `song.html` with placeholder blurbs. |
| Invalid font name | `style.css:8,32,39,44`, `entry1.css:7,32` | `"instrument-serif"` should be `"Instrument Serif"`. |
| `<button>` inside `<a>` | `song1:97`, `song2:125`, `song3:103` | Invalid HTML; `info.html` uses `<h3>` inside `<a>` instead. |
| CSS split across two files | `style.css` + `entry1.css` | ~12 rules duplicated, some disagree (`h1` 150px red vs 130px black; `!important` hover in one file only). |
| A third red | hover rules in both files | `#a60000` is outside the two palette reds. |
| Navigation gaps | `song4.html`, `info.html:46` | song4 has no [next]; no [prev] anywhere; info [next] skips song1. |
| Header covers title on mobile | `style.css:230` | At 375px the header stacks to 186px but content starts at 100px; 150px `h1` breaks words off-screen. |
| Ghazals list breaks on mobile | `style.css:238` | 2-column grid only resets `.text-1`/`.text-7`; `.text-2`/`.text-3` create implicit columns. |
| Language / structure | all pages | No `lang` on Devanagari; every title "Project 1"; no favicon; fixed header last in DOM; no `<nav>`/`<main>`. |
| Landing animation | `entry1.css` | Six infinite scale+blur animations, no `prefers-reduced-motion`; `backface-visibility: show` (`:149`) is invalid. |
| Inline styles | song pages | Sumana set inline with a `sans-serif` fallback. |

## 4. Proposed schema — `songs.js`

Plain `<script>` assignment (no `fetch`), so it works on GitHub Pages and from local files.

```js
window.SONGS = [
  {
    id: "ranjish-hi-sahi",
    number: 1,
    title: { roman: "TODO", deva: "रंजिश ही सही", urdu: null },
    poet: "Ahmed Faraz",
    form: "ghazal",                 // "geet" for song2
    blurb: "…existing text, moved verbatim…",

    couplets: [
      {
        id: "c1",                   // stable id; versions point to this
        deva:  ["…", "…"],          // one string per line
        urdu:  null,                // optional Nastaliq lines
        roman: null,                // optional transliteration lines
        gloss: null,                // TODO: literal gloss, per line
        translation: ["…", "…"],    // null = untranslated
        words: ["पिंदार-ए-मोहब्बत"]  // glossary terms in this couplet (exact substrings)
      }
    ],

    glossary: {
      "पिंदार-ए-मोहब्बत": { roman: null, meaning: "TODO" }
    },

    versions: [
      { singer: "Mehdi Hassan", year: null, url: "TODO", note: null,
        sung: ["c1", "c3", "c2"] }   // order sung; repeat an id for a reprise
    ]
  }
];
```

- Lines as arrays handle 2-line couplets and song2's 3–4 line stanzas alike.
- Glossary words are listed per couplet and matched at render time, so lyric strings never get markup inserted.
- Each song keeps a small HTML shell with its own `<title>`/og tags (crawlers don't run JS); shells load one shared `render.js`, and `song1.html`–`song4.html` keep their URLs.

## Open decisions (before Phase 2)

1. Versions reference couplet ids (`"c3"`) or indexes?
2. Store couplets in the original's order and pair translations to them, or keep the translation's order?
3. Highlight the whole couplet, plus line-to-line where line counts match?
4. Delete `entry1.html`, `template.html`, `script.js`?
