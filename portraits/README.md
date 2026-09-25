# Pioneer portraits

Every pioneer shows a circular portrait in a thin gold ring. Until a photo
is added, a dark medallion shows the person's initials.

**The quickest way:** save a photo as `portraits/<id>.jpg` (the `id` from
`pioneers-data.js`, e.g. `hassabis.jpg`). The site finds it on its own.
`python3 tools/add_portrait.py hassabis photo.jpg --artist "…" --license "…" --source "…"`
crops it square, saves it in the right place and records the credit.

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

## How photos are shown

Photos are shown as they are, in natural colour, cropped to a circle from
the top-centre of the image (keep the face in the upper part of the frame).

## Licences to avoid

Press, agency and magazine photos (for example TIME portraits or Nobel
ceremony photos) are copyrighted. Don't commit them, even with a credit.
