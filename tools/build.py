"""Build the static site from content/*.json.

    python3 tools/build.py

Writes the HTML pages at the repository root (served as-is by GitHub Pages).
Edit the JSON in content/, not the generated HTML.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"

SITE = json.loads((CONTENT / "site.json").read_text())
GHAZALS = [json.loads((CONTENT / f"{slug}.json").read_text()) for slug in SITE["order"]]

FONTS = {
    "base": "family=Atkinson+Hyperlegible+Next:wght@400;600&family=Instrument+Serif:ital@0;1&family=Sumana:wght@400;700",
    "urdu": "&family=Noto+Nastaliq+Urdu:wght@400;600",
}

# How each script of a poem is marked up. Urdu poetry stays Urdu (ur) whatever
# script it is written in; only the script subtag changes.
SCRIPTS = {
    "deva": {"name": "Devanagari", "native": "देवनागरी", "lang": "ur-Deva", "dir": "ltr"},
    "arab": {"name": "Urdu", "native": "اردو", "lang": "ur", "dir": "rtl"},
    "latn": {"name": "Roman", "native": None, "lang": "ur-Latn", "dir": "ltr"},
}
TRANSLATIONS = {
    "en": {"name": "English", "lang": "en"},
    "hi": {"name": "Hindi", "lang": "hi"},
}

NAV = [("ghazals.html", "ghazals"), ("index.html", "found in translation"), ("info.html", "info")]

e = html.escape


def head(title, description, urdu=False, html_attrs=""):
    fonts = FONTS["base"] + (FONTS["urdu"] if urdu else "")
    return f"""<!DOCTYPE html>
<html lang="en"{html_attrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{e(title)}</title>
  <meta name="description" content="{e(description)}">
  <script>document.documentElement.classList.add("js");</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?{fonts}&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>"""


def nav(current):
    current_attr = ' aria-current="page"'
    links = "\n".join(
        f'    <a href="{href}"{current_attr if href == current else ""}>[{label}]</a>'
        for href, label in NAV
    )
    return f'<body>\n  <a class="skip" href="#main">Skip to content</a>\n  <header class="site-nav">\n{links}\n  </header>'


def pager(prev=None, nxt=None):
    out = ['  <nav class="pager" aria-label="Previous and next">']
    if prev:
        out.append(f'    <a class="prev" href="{prev[0]}" rel="prev"><span class="dir">[previous]</span><span class="to">{prev[1]}</span></a>')
    if nxt:
        out.append(f'    <a class="next" href="{nxt[0]}" rel="next"><span class="dir">[next]</span><span class="to">{nxt[1]}</span></a>')
    out.append("  </nav>")
    return "\n".join(out)


def script_span(script, text, cls="sv"):
    s = SCRIPTS[script]
    return f'<span class="{cls}" data-s="{script}" lang="{s["lang"]}" dir="{s["dir"]}">{text}</span>'


def lines(ls):
    # A leading "~" marks a refrain line.
    return "".join(
        f'<span class="l refrain">{l[1:]}</span>' if l.startswith("~") else f'<span class="l">{l}</span>'
        for l in ls
    )


def couplet(c, scripts, translations, unit):
    variants = "".join(
        f'\n          <p class="sv" data-s="{s}" lang="{SCRIPTS[s]["lang"]}" dir="{SCRIPTS[s]["dir"]}">{lines(c["text"][s])}</p>'
        for s in scripts if s in c["text"]
    )
    if not c["text"]:
        variants = f'\n          <p class="text-note">{c["textNote"]}</p>'
    trs = "".join(
        f'\n          <p class="tv" data-t="{t}" lang="{TRANSLATIONS[t]["lang"]}">{lines(c["translation"][t])}</p>'
        if t in c.get("translation", {}) else
        f'\n          <p class="tv tr-missing" data-t="{t}">Not translated on this page.</p>'
        for t in translations
    )
    gloss = ""
    if c.get("gloss"):
        items = []
        for g in c["gloss"]:
            terms = "".join(
                script_span(s, g["term"][s] if s != "latn" else g["translit"], "sv term")
                for s in scripts if s == "latn" or s in g["term"]
            )
            items.append(f'<div><dt>{terms}<span class="tl" lang="ur-Latn">{g["translit"]}</span></dt><dd>{g["meaning"]}</dd></div>')
        gloss = f'\n        <div class="gloss"><dl aria-label="Glossary">{"".join(items)}</dl></div>'
    return f"""      <li class="couplet" id="{c['id']}" aria-label="{unit} {c['num']}">
        <span class="c-num" aria-hidden="true">{c['num']}</span>
        <div class="src">{variants}
        </div>
        <div class="tr">{trs}
        </div>{gloss}
      </li>"""


def options(name, legend, items, checked):
    if len(items) < 2:
        return ""
    radios = "".join(
        f'<label><input type="radio" name="{name}" value="{v}"{" checked" if v == checked else ""}><span>{label}</span></label>'
        for v, label in items
    )
    return f'<fieldset class="choice" data-choice="{name}"><legend>{legend}</legend><div class="choice-options">{radios}</div></fieldset>'


def script_option_label(s):
    sc = SCRIPTS[s]
    native = f' <bdi class="native" lang="{sc["lang"]}" dir="{sc["dir"]}">{sc["native"]}</bdi>' if sc["native"] and s != "deva" else ""
    if s == "deva":
        native = f' <bdi class="native" lang="hi">{sc["native"]}</bdi>'
    return f'{sc["name"]}{native}'


def recordings_list(renditions):
    rows = []
    for r in renditions:
        if r["id"] == "source":
            continue
        p = r.get("player") or {}
        if p.get("type") == "youtube":
            link = f'<a href="https://www.youtube.com/watch?v={p["id"]}">YouTube</a>'
        elif p.get("type") == "bandcamp":
            link = f'<a href="{p["href"]}">Bandcamp</a>'
        elif p.get("type") == "audio":
            link = f'<a href="{p["src"]}">Audio file</a>'
        else:
            link = '<span class="missing">Recording not yet available</span>'
        extra = f' · <a href="{r["link"]["href"]}">{r["link"]["label"]}</a>' if r.get("link") else ""
        rows.append(f'<li><span class="who">{r["performer"]}</span> <span class="ctx">{r["context"]}</span> {link}{extra}</li>')
    return "\n          ".join(rows)


def ghazal_page(i, g):
    scripts = [s for s in SCRIPTS if s in g["scripts"]]
    translations = [t for t in TRANSLATIONS if t in g["translations"]]
    unit = g.get("unit", "couplet")
    urdu = "arab" in scripts
    title_latn = g["title"]["latn"]

    script_titles = "".join(
        script_span(s, g["title"][s]) for s in scripts if s != "latn" and s in g["title"]
    )
    credits = "\n".join(
        f'        <div><dt>{c["label"]}</dt><dd>{c["value"]}{"<small>" + c["note"] + "</small>" if c.get("note") else ""}</dd></div>'
        for c in g["credits"]
    )
    controls = options("script", "Read the poem in", [(s, script_option_label(s)) for s in scripts], scripts[0]) + \
        options("translation", "Beside it", [(t, TRANSLATIONS[t]["name"]) for t in translations], translations[0])
    poem_word = "Lyric" if unit == "stanza" else "Poem"
    col_src = "".join(f'<span data-s="{s}">{poem_word}, in {SCRIPTS[s]["name"] if s != "arab" else "Urdu script"}</span>' for s in scripts)
    col_tr = "".join(f'<span data-t="{t}">{TRANSLATIONS[t]["name"]} {g["translations"][t]["kind"]}</span>' for t in translations)
    core = "\n".join(couplet(c, scripts, translations, unit) for c in g["couplets"])

    added = ""
    if g.get("added"):
        added = f"""
    <section class="section" aria-labelledby="added-h">
      <h2 class="label" id="added-h">Sung, not written</h2>
      <p class="aside">{g['addedIntro']}</p>
      <ol class="couplets added">
{chr(10).join(couplet(c, scripts, translations, unit) for c in g['added'])}
      </ol>
    </section>"""

    text_sources = "; ".join(
        f'{SCRIPTS[s]["name"] if s != "arab" else "Urdu script"}: {g["scripts"][s]["source"]}' for s in scripts
    )
    refs = "\n          ".join(
        f'<li><span class="what">{s["label"]}</span> <a href="{s["href"]}">{s["title"]}</a></li>' for s in g["sources"]
    )
    perf = json.dumps({"unit": unit, "renditions": g["renditions"]}, ensure_ascii=False)
    flags = "\n".join(f"    - {f}" for f in g.get("flags", []))

    prev = (f'{GHAZALS[i-1]["slug"]}.html', GHAZALS[i-1]["title"]["latn"]) if i > 0 else ("ghazals.html", "all ghazals")
    nxt = (f'{GHAZALS[i+1]["slug"]}.html', GHAZALS[i+1]["title"]["latn"]) if i + 1 < len(GHAZALS) else ("ghazals.html", "all ghazals")
    has_tl = "latn" in scripts
    reading_key = [
        "<b>Translation</b>: an English rendering of each couplet, set beside the couplet it carries, by meaning rather than by line.",
    ]
    if has_tl:
        reading_key.append("<b>Transliteration</b>: the same Urdu written in Roman letters. It is a way to read the original, not a translation.")
    reading_key.append("<b>Glossary notes</b>: short explanations of single words, shown when a couplet is selected. They are not translations.")

    return f"""{head(f"{title_latn} | Found in Translation", re.sub('<[^>]+>', '', g['listing']['summary']), urdu, f' data-script="{scripts[0]}" data-trans="{translations[0]}"')}
<!--
  Generated from content/{g['slug']}.json by tools/build.py. Edit the JSON, then rebuild.
  Internal notes (not displayed):
{flags}
-->
{nav(None)}

  <main id="main">
    <header class="work-head">
      <p class="work-num">Ghazal {g['num']} of {len(GHAZALS)}</p>
      <h1 class="work-title">{title_latn}</h1>
      <p class="work-title-script">{script_titles}</p>
      <dl class="credits">
{credits}
      </dl>
      <div class="intro"><p>{g['intro']}</p></div>
    </header>

    <section class="section listen" aria-labelledby="listen-h">
      <h2 class="label" id="listen-h">Listen</h2>
      <fieldset class="choice renditions"><legend>Choose a recording</legend><div class="choice-options"></div></fieldset>
      <div class="now" aria-live="polite"></div>
      <div class="player"></div>
      <div class="vmap-block">
        <h3 class="label-sm" id="vmap-h">Verses</h3>
        <p class="vmap-caption"></p>
        <ol class="vmap" aria-labelledby="vmap-h"></ol>
        <p class="vmap-legend"><span class="lg-source">in the text</span><span class="lg-unknown">not documented for this recording</span><span class="lg-added">added in performance</span></p>
      </div>
      <script type="application/json" id="performance-data">{perf}</script>
    </section>

    <section class="section read" aria-labelledby="read-h">
      <h2 class="label" id="read-h">{poem_word} and translation</h2>
      <div class="controls">{controls}</div>
      <div class="columns-label" aria-hidden="true"><span>{col_src}</span><span class="tr-label">{col_tr}</span></div>
      <ol class="couplets">
{core}
      </ol>
    </section>
{added}

    <section class="section notes" aria-labelledby="notes-h">
      <h2 class="label" id="notes-h">Notes and sources</h2>
      <dl class="notes-list">
        <div><dt>Text</dt><dd>{text_sources}. {"Stanzas follow the order of the lyric as transcribed here" if unit == "stanza" else "Couplets follow the poet’s order"}.</dd></div>
        <div><dt>Reading this page</dt><dd><ul>{"".join(f"<li>{k}</li>" for k in reading_key)}</ul></dd></div>
        <div><dt>Recordings</dt><dd><ul class="links">
          {recordings_list(g['renditions'])}
        </ul></dd></div>
        <div><dt>References</dt><dd><ul class="links">
          {refs}
        </ul></dd></div>
      </dl>
    </section>
  </main>

{pager(prev, nxt)}

  <script src="ghazal.js" defer></script>
</body>
</html>
"""


def list_page():
    entries = "\n".join(
        f"""      <li class="entry">
        <span class="n">{g['num']}.</span>
        <div>
          <h2><a href="{g['slug']}.html">{g['title']['latn']}</a></h2>
          <p class="meta">{g['listing']['meta']}</p>
          <p class="summary">{g['listing']['summary']}</p>
        </div>
      </li>"""
        for g in GHAZALS
    )
    first = GHAZALS[0]
    return f"""{head("Ghazals | Found in Translation", "Four ghazals in their original scripts, with English translations and recordings.")}
{nav("ghazals.html")}

  <main id="main">
    <h1 class="page-title">[ghazals]</h1>
    <ol class="entries">
{entries}
    </ol>
  </main>

{pager(None, (first['slug'] + '.html', first['title']['latn']))}
</body>
</html>
"""


def info_page():
    sections = "\n".join(
        f"      <h2>{s['heading']}</h2>\n      <p>{s['body']}</p>" for s in SITE["info"]
    )
    return f"""{head("Info | Found in Translation", "What a ghazal is, and how this site reads, translates and listens to them.")}
{nav("info.html")}

  <main id="main">
    <h1 class="page-title">[info]</h1>
    <div class="prose">
{sections}
    </div>
  </main>

{pager(None, ("ghazals.html", "the ghazals"))}
</body>
</html>
"""


def home_page():
    drift = "\n".join(
        f'      <div>{script_span(d["script"], d["text"], "drift-text")}</div>' for d in SITE["home"]["drift"]
    )
    return f"""{head("Found in Translation", "A collection of ghazals in their original scripts, with translations and recordings.", True)}
{nav("index.html")}

  <main id="main" class="home">
    <h1 id="title"><em>found</em> in translation</h1>
  </main>

  <div class="drift" aria-hidden="true">
{drift}
  </div>
</body>
</html>
"""


def redirect(target):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Found in Translation</title>
  <script>location.replace("{target}" + location.hash);</script>
  <meta http-equiv="refresh" content="0; url={target}">
  <link rel="canonical" href="{target}">
  <meta name="robots" content="noindex">
</head>
<body>
  <p>This page has moved to <a href="{target}">{target}</a>.</p>
</body>
</html>
"""


def visible_text(page):
    page = re.sub(r"<!--.*?-->", "", page, flags=re.S)
    page = re.sub(r"<script.*?</script>", "", page, flags=re.S)
    return page


def main():
    pages = {"index.html": home_page(), "ghazals.html": list_page(), "info.html": info_page()}
    for i, g in enumerate(GHAZALS):
        pages[f"{g['slug']}.html"] = ghazal_page(i, g)
        pages[g["legacy"]] = redirect(f"{g['slug']}.html")
    for old, new in SITE["redirects"].items():
        pages[old] = redirect(new)
    for name, page in pages.items():
        assert "—" not in visible_text(page), f"em dash in visible copy of {name}"
        (ROOT / name).write_text(page)
    print(f"built {len(pages)} pages")


if __name__ == "__main__":
    main()
