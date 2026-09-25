# Pioneer portraits

Every pioneer shows a circular portrait with ring arcs around it. Until a
photo is added, the frame shows the person's initials.

## Adding a portrait by hand

1. Save the image as `portraits/<id>.jpg`, where `<id>` is the person's `id`
   in `pioneers-data.js` (for example `hassabis.jpg`).
   Square, about 320×320 px, with the face in the upper third.
2. Add an entry to `portraits/credits.js`:

   ```js
   hassabis: {
     file: "portraits/hassabis.jpg",
     artist: "Photographer's name, as the source asks",
     license: "CC BY-SA 4.0",
     licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
     source: "https://commons.wikimedia.org/wiki/File:..."
   },
   ```

The credit is shown under the portrait in the biography panel.

## Adding them all automatically

`tools/fetch_portraits.py` looks up each pioneer's lead image on Wikipedia,
keeps it only if it lives on Wikimedia Commons under a free licence
(public domain, CC0, CC BY, CC BY-SA), crops it square, and writes the
credits file for you:

```sh
pip install pillow
python3 tools/fetch_portraits.py            # everyone missing a portrait
python3 tools/fetch_portraits.py turing     # just one person
```

It needs internet access to `en.wikipedia.org`, `commons.wikimedia.org`
and `upload.wikimedia.org`. Check the results by eye before committing:
the lead image is usually, but not always, a good portrait.

## Why the rainbow look?

Every photo is shown in black and white under a rainbow tint (the
`#woc-gray` filter and `woc-spec-*` gradients in `pioneers.js`), inside
ring arcs in the person's domain colour. Photos from different decades and
cameras then read as one set. The effect is applied in the browser; the
files stay unmodified. Hover a portrait in the biography panel or gallery to
see the original.

## Licences to avoid

Press, agency and magazine photos (for example TIME portraits or Nobel
ceremony photos) are copyrighted. Don't commit them, even with a credit.
