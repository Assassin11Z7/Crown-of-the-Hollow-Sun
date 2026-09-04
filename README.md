# Crown of the Hollow Sun

A dark-fantasy trilogy — **Ignition**, **Ascension**, and **Eclipse** — as a reading app and as Word books.

He isn’t chosen. He is the sun.

## The books

In Ashveil the sun died a thousand years ago, and magic is the leftover heat of a god’s corpse. A boy from the ash-slums of Vireth wakes with the sun’s core beating in his chest. Every kingdom that learned to live in the dark wants him dead, bottled, or crowned.

| Volume | Title | Word files |
| --- | --- | --- |
| Book I | Ignition — *The Boy Who Brought Noon* | `public/books/Crown-of-the-Hollow-Sun-1-Ignition.docx` |
| Book II | Ascension — *The Dream Becoming Lucid* | `public/books/Crown-of-the-Hollow-Sun-2-Ascension.docx` |
| Book III | Eclipse — *A Billion Small Flames* | `public/books/Crown-of-the-Hollow-Sun-3-Eclipse.docx` |

All three zipped: `public/books/Crown-of-the-Hollow-Sun-Trilogy.zip`

Open any `.docx` in Microsoft Word, Pages, or Google Docs.

Markdown sources live in `content/book1`, `content/book2`, and `content/book3`. Rebuild JSON + Word files with:

```bash
python3 scripts/build-books.py
```

## App

```bash
npm install
npm run dev
```

Then open the app and read, or download a volume for Word.

## License

Original fiction. All rights reserved unless otherwise noted.
