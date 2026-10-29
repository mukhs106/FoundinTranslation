# Found in Translation

Ghazals in their original scripts, with English translations and recordings.

## Editing

The pages are generated. Edit the files in `content/`, then rebuild:

```
python3 tools/build.py
```

- `content/site.json`: page order, home-page text, Info page, and redirects from old URLs.
- `content/<ghazal>.json`: one file per ghazal.
  - `couplets[].text` holds the poem by script: `deva` (Devanagari), `arab` (Urdu, Nastaliq), `latn` (Roman). Only scripts listed in `scripts` are offered to readers.
  - `couplets[].translation` holds translations by language (`en`, `hi`). Only languages listed in `translations` are offered.
  - A line starting with `~` is a refrain.
  - `renditions[].player` is one of `{"type": "youtube", "id": ...}`, `{"type": "bandcamp", "track": ..., "href": ...}` or `{"type": "audio", "src": "audio/file.mp3"}` for a file you are allowed to host. Leave it out and add `missing` when no playable recording exists.
  - `flags` are internal notes. They appear only as an HTML comment.

`style.css` is shared by every page; `ghazal.js` runs on the four ghazal pages. The build stops if visible copy contains an em dash or a page links to an `.html` file that does not exist.
