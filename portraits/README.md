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

## Using photos you are allowed to publish

A credit or caption tells readers where a photo came from, but it does not
give you the right to publish it. Press, agency and magazine photos (TIME,
Getty, Reuters, news sites, event photos) belong to their photographers or
publishers. On a public GitHub Pages site the owner can send a DMCA notice
and GitHub will take the file, or the repository, down. The legitimate ways
to get portraits:

1. **Freely licensed photos (easiest).** Most pioneers have a photo on
   Wikimedia Commons under CC BY, CC BY-SA or public domain. You may use
   them if you credit them as the licence asks, which `credits.js` does.
   `tools/fetch_portraits.py` fetches them all automatically.
2. **Public-domain photos.** Photos published in the US before 1930, and
   photos taken by US federal employees on duty (for example US Navy photos
   of Grace Hopper) are public domain.
3. **Official press photos.** Universities, labs and companies often offer
   headshots in a press or media kit. Read the terms: many allow editorial
   use with a credit.
4. **Ask for permission.** Researchers and their press offices often say yes
   to an educational site. Write to the person, their office, or the
   photographer (template below). Keep the reply, and record it in
   `credits.js` as `license: "Used with permission"`.
5. **Buy a licence.** Agency photos (Getty, TIME) can be licensed for web use.
6. **Your own photos.** A photo you took yourself, say at a public talk, is
   yours to publish.

### Permission request template

> Subject: Permission to use a portrait on an educational website
>
> Dear …,
>
> I am building *The Web of Computation*, a free, non-commercial
> interactive history of computer science and AI
> ([link to the site]). I would
> like to include a small portrait of … beside a short biography of their
> work.
>
> May I use the photo at [link], shown about 150 pixels wide with the
> credit "Photo: [photographer]"? If you prefer a different photo or
> credit, I will use that instead.
>
> Thank you,
> …

## Licences to avoid

Press, agency and magazine photos (for example TIME portraits or Nobel
ceremony photos) are copyrighted. Don't commit them, even with a credit.
