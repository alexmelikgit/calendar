# Handover — Տոնացույց (Armenian Apostolic Church calendar)

This document is for the next person or AI assistant picking up this project. Read it together with `README.md`, which covers day-to-day editing in more detail.

---

## 1. What the project is

A **monthly calendar website for the Armenian Apostolic Church**, built for Art-Group LLC.

- Each month has **one featured feast**, with its own **illustration** and a short text.
- The month's **calendar grid** highlights feasts and fasts, colored by **feast type**.
- Visitors can tap a day to see the feast. Each feast also has its own page with the full text.
- The site is **Armenian first**: it always opens in Armenian, and English is available from the Հայ / Eng switch.
- **Phones are the main audience.** Most visitors are expected to come from phones, many via **QR codes printed on a physical calendar**, one per month.

The project started as a multi-religion calendar and was narrowed to **the Armenian Apostolic Church only**. Some early decisions (feast types instead of religions, the colors) come from that pivot.

---

## 2. Tech stack

| Part | Choice | Notes |
| --- | --- | --- |
| Framework | **Next.js 16.3** (App Router) with React 19 | ⚠️ Newer than most training data; see §8 |
| Language | TypeScript | |
| Styling | **Tailwind CSS 4** | Design tokens live in `src/app/globals.css` (`@theme`) |
| Dates | **date-fns** | |
| Fonts | Noto Sans Armenian / Noto Serif Armenian | **Self-hosted** via `@fontsource-variable/*` npm packages, not Google Fonts |
| Content | Local TypeScript files in `src/content/` | Shaped like CMS documents; a headless CMS (Sanity / Strapi / Contentful) is planned later |
| Hosting | **Not decided yet** | Vercel was recommended (Pro plan needed for commercial use) |

Run it with `npm install`, then `npm run dev`, then open http://localhost:3000. Other commands: `npm run build`, `npm run lint`.

---

## 3. Where things are

```
src/
  proxy.ts                      Redirects any path without a language to /hy/… (always Armenian)
  app/
    globals.css                 Color palette + design tokens, day-flash animation, bottom-sheet styles
    [lang]/layout.tsx           Root layout (html lang, fonts)
    [lang]/page.tsx             /hy → redirects to the current month (Asia/Yerevan time)
    [lang]/[year]/[month]/page.tsx   The month page (main screen)
    [lang]/feasts/[slug]/page.tsx    A feast's own page (full text + dates)
    [lang]/not-found.tsx
  components/
    MonthView.tsx               Client component: layout, toolbar, filter state, swipe/keys, "Go to date", "Today"
    MonthGrid.tsx               The calendar grid (dots on phones, colored bars on desktop)
    MonthIllustration.tsx       The month's illustration, with a placeholder when the file is missing
    MonthPicker.tsx             "Գնալ ամսաթվին" dialog: year/month buttons + exact-date field + Today
    DaySheet.tsx                Bottom sheet (phones) / dialog (desktop) for a tapped day
    FeastList.tsx               "Տոները այս ամսին" list under the grid
    CategoryFilter.tsx          Feast-type chips (they act as the legend and the filter)
    SiteHeader.tsx, LanguageSwitcher.tsx, Icons.tsx
  content/                      ← ALL editable content
    types.ts                    Data model (see §4)
    feasts.ts                   Feast descriptions + their dates
    categories.ts               Feast types (names + colors)
    month-themes.ts             12 month themes (title, text, featured feast, accent color, illustration file)
  i18n/
    dictionary.ts               Interface text in hy + en (buttons, month names, etc.)
    format.ts                   Armenian/English date formatting ("3 հոկտեմբերի")
    config.ts                   Languages: hy (default), en
  lib/
    content.ts                  THE ONLY place that reads content; swap this for a CMS later
    calendar.ts                 Month grid building, month navigation, Yerevan "today"
    use-today.ts                Visitor's local "today" (client only, avoids hydration mismatch)
public/illustrations/
  README.txt                    List of the 12 expected illustration file names
```

---

## 4. Data model (src/content/types.ts)

- **FeastCategory**: `id`, `name {hy,en}`, `color`. There are currently 6:
  - `tabernacle`: Տաղավար տոներ
  - `lord`: Տերունական տոներ
  - `saints`: Սրբոց տոներ
  - `fasts`: Պահքեր
  - `memorial`: Մեռելոց
  - `folk`: Ժողովրդական տոներ
- **Feast**: written once and reused every year. Fields:
  - `slug`, `categoryId`
  - `name {hy,en}`
  - `short {hy,en}`: 1–2 sentences, shown in the day popup
  - `long {hy[],en[]}`: paragraphs, shown on the feast page
- **FeastDate**: one entry per year, with `feastSlug`, `start`, `end` (as `YYYY-MM-DD`; same date for one-day feasts) and optional `eveLiturgy` (shows the "Ճրագալույցը՝ նախորդ երեկոյան" note).
- **MonthTheme** (exactly 12):
  - `title`, `text` (short version shown under the illustration)
  - `featuredFeast` (slug, used for the "Read more" link)
  - `accent` color
  - `illustration { file, alt, focus }`

---

## 5. Current state (as of 13 Nov 2026)

### Done
- Month view with:
  - the grid and feast-type filter, kept in the URL as `?hide=fasts,memorial`
  - swipe left/right and ← → keys to change month
  - a bottom sheet for tapped days
  - the "Feasts this month" list
- **Desktop layout:**
  - the toolbar (month name, chips, arrows) spans the full width
  - below it, the **illustration sits beside the grid and is exactly as tall as the grid**
  - the month's title and text sit below the illustration, next to the feast list
- **Phone layout:** illustration banner, then month text (clamped to 4 lines, with "Read more"), then toolbar, grid and list.
- **"Go to date":** tapping the month name opens a picker with:
  - year arrows and 12 month buttons
  - an exact-date field (navigates via `?day=YYYY-MM-DD`, briefly highlights that day and opens its sheet if it has a feast)
  - a "Today" button
- **"Այսօր" (Today) button** is always visible and jumps to today with a highlight.
- **Always opens in Armenian** (`proxy.ts`); English only via the switcher.
- **Color scheme** taken from the team's illustrations:
  - dark wood-brown page (`#2a130f`)
  - linen cards (`#f6eee2`)
  - red and blue tablecloth stripe on cards
  - feast-type colors: pomegranate, apricot, plate blue, plum, olive, ochre
- **Content from the team's document "Տոներ կարճ"** (one featured feast per month):

  | Month | Featured feast |
  | --- | --- |
  | January | Սուրբ Ծնունդ |
  | February | Բուն Բարեկենդան |
  | March | Զատիկ |
  | April | Կանաչ կիրակի |
  | May | Համբարձում |
  | June | Սուրբ Կարապետի ուխտ |
  | July | Վարդավառ |
  | August | Խաղողօրհնեք |
  | September | Խաչվերաց |
  | October | Թարգմանչաց |
  | November | Նախրաթողի պահք |
  | December | Ամանոր |

  Where the document had a highlighted shorter version (Aug–Dec), that one is the month text, and the full text is on the feast page.
- **2027 dates provided by the team** (only these are in the data; earlier sample dates were removed at the team's request):

  | Date | Feast |
  | --- | --- |
  | Jan 6 | Սուրբ Ծնունդ (eve liturgy) |
  | Jan 23 | Սուրբ Սարգիս |
  | Feb 7 | Բուն Բարեկենդան |
  | Feb 14 | Տյառնընդառաջ |
  | Mar 21 | Ծաղկազարդ |
  | Mar 28 | Զատիկ (eve liturgy) |
  | May 6 | Համբարձում |
  | Jul 4 | Վարդավառ |
  | Aug 15 | Խաղողօրհնեք |
  | Sep 12 | Խաչվերաց |

### Open items / waiting on the team
1. **Final dates and extended texts.** The team said they'll send them. Add the dates to `feastDates` and the texts to `long` in `feasts.ts`.
2. **Undated feasts** (they're on the month pages but not on the grid): Կանաչ կիրակի, Սուրբ Կարապետի ուխտ, Թարգմանչաց տոն, Նախրաթողի պահք and Ամանոր.
3. **Placeholder texts still in use:**
   - Vardavar (both the July month text and the feast text)
   - Սուրբ Սարգիս, Տյառնընդառաջ, Ծաղկազարդ (feast texts)
4. **English texts were translated by the assistant** and need review by the team.
5. **Illustrations:** the team will add them themselves as `public/illustrations/month-01.jpg` … `month-12.jpg` (JPG, portrait, about 1414×2000). Until a file exists, a placeholder shows the expected name. Use `focus` in `month-themes.ts` to control cropping. Notes:
   - Earlier test images (gata baking, sharing gata, bread figures) may still exist in the team's local copy as month-01/02/12.jpg. Replace them.
   - The bread-figures picture fits December's ասիլ-բասիլ text.
6. **Empty feast type:** "Մեռելոց" has no feasts yet. Decide whether to hide empty types or wait for data.
7. **Hosting + domain** aren't decided. See §6.
8. **CMS:** planned for later. Rewrite `src/lib/content.ts` only; keep its return types.

---

## 6. Printed calendar + QR codes (decided approach)

- Each printed month page gets a QR code linking to that month.
- **Recommendation given:** buy the domain now (e.g. a `.am` domain), even before hosting, and print **static** QR codes pointing to `https://<domain>/2027/01` … `/2027/12`. The site already supports this format: `proxy.ts` adds `/hy`, so `/2027/01` opens January 2027 in Armenian.
- Dynamic QR services were explained as an alternative, but **not recommended for print**: they need a subscription, and the codes break if it lapses.
- **Next step:** once the domain is chosen, generate the 12 QR codes as SVG plus high-resolution PNG, named like `QR-01-January.svg`. Print each one at least 2×2 cm with a white margin, and test a printed proof with several phones.

---

## 7. How to work with this team

- The project owner writes in **English**. The site content is in **Armenian**, supplied by the team in Word documents.
- **Don't invent feast dates or content.** Use only what the team provides. If something has to be derived or translated, say so clearly. The team explicitly asked to keep only their own dates.
- They like **short explanations** and plain steps (Windows, Desktop folder `Desktop\religious-calendar`).
- They usually update by **replacing changed files** or **unzipping the full project over their folder**. Always list exactly which files changed.
- Check layouts on **both phone and desktop** before handing over.

---

## 8. Technical gotchas

- **Next.js 16 differs from older versions.** Read `AGENTS.md` and the docs in `node_modules/next/dist/docs/` before changing routing or config. Specifically:
  - Middleware is now **`proxy.ts`** (exporting a `proxy` function).
  - `params` and `searchParams` are **Promises** (`await params`). Use the `PageProps<'/route'>` / `LayoutProps` helpers.
  - The root layout is inside `app/[lang]/`. There's no `app/layout.tsx`.
- **Fonts are self-hosted** on purpose; `next/font/google` failed in a restricted network. Keep the `@fontsource-variable` imports in `[lang]/layout.tsx`.
- **"Today" is computed on the client** (`use-today.ts`) to avoid server/visitor timezone mismatch. The server redirect for `/hy` uses Asia/Yerevan time.
- Illustrations use `next/image` with `fill`. A missing file triggers `onError`, which shows the placeholder, so 400 errors in the console for missing images are expected until the files are added.
- `lint` and `build` currently pass cleanly. Keep it that way.
