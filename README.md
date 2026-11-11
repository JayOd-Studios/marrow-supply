# Marrow Supply — sample e-commerce storefront

A self-contained sample shop: six products, sale and new badges, ratings, a
working cart drawer with quantities and a free-shipping threshold, plus
material filters and a newsletter form. It is a **portfolio template** — the
shop is fictional and no payment is taken.

- Sector: E-commerce / small-batch goods
- Stack: static HTML, CSS and vanilla JS. No build step, no webfonts, no CDN; local WebP product photography.
- Run: `python3 -m http.server 3000` in this folder.
- Files: `index.html`, `styles.css`, `main.js`.

## The brand, as written

| Item | Value |
| --- | --- |
| Name | Marrow Supply |
| One-liner | Small-batch goods for the everyday table. |
| Audience | Homeware buyers aged 28–50 who care where things are made; 12 UK stockists, 3 in Europe. |
| Tone | Plain, warm, specific about materials. No "curated" or "elevated". |
| Palette | Paper `#F7F2E8`, ink `#221D18`, clay `#A8502F`, moss `#5B6B4F` |
| Type | Iowan Old Style / Palatino display; system sans for UI, monospace for prices |
| Shape | 2px radii — nearly square, like print |

### Screen inventory

1. **Announcement bar** — offer and code, dismissible-by-scroll, not a popup.
2. **Header** — wordmark, shop nav, search, cart with live count.
3. **Hero** — collection statement, one photographic still life, three service promises.
4. **Collection** — six products, filters (All / Table / Textiles / Glass), add to bag.
5. **Workshop** — the making story, facts list: six workshops, FSC oak, paper packaging, free repairs.
6. **Reviews** — three verified-buyer quotes.
7. **Journal** — three making notes with read times.
8. **Signup / stockists** — letter signup with validation.
9. **Cart drawer** — quantities, remove, subtotal, free-shipping nudge, focus trapped while open.

### Sample data

| Product | Material | Price | Note |
| --- | --- | --- | --- |
| Cedar Tray | Table | $48 | was $60 |
| Linen Throw | Textiles | $129 | New |
| Stone Carafe | Glass | $36 | was $45 |
| Oak Serving Board | Table | $64 | New |
| Wool Cushion | Textiles | $58 | was $72 |
| Smoked Tumblers (set of two) | Glass | $44 | — |

Free shipping threshold: $60. Founding year 2018, Somerset (Bruton).

## What to show it for

Pitch this at independent retailers: it demonstrates a real cart interaction
(state, quantities, totals, focus management), honest pricing with sale values,
product cards built around real photography, filters, and a checkout flow that
stops exactly where a sample should.

## Make it yours

- Products: duplicate an `<article class="product">`, set `data-cat`, `data-name`, the price in `data-price`, and the visible price. The filter and cart read those attributes.
- Cart: `FREE_SHIPPING` in `main.js`; `money()` controls currency formatting — swap `$` for `£` and adjust decimals.
- Art: photography lives in `assets/`. Keep the `4 / 5` product crop and replace the files when your own shoot arrives. Credits are in `ASSETS.md`.
- Real checkout: replace the checkout handler with a POST to Stripe Checkout or Shopify's cart API, then re-test the drawer focus trap and empty state.

## Photography

The site uses eight locally hosted Pexels photographs, all free under the Pexels
license. Source pages, photographers and crops are listed in
[`ASSETS.md`](ASSETS.md). The shop is fictional; the images are reference
product photography.

## Limits

The cart lives in memory, so a reload empties it. There are no product pages,
variants, stock checks, tax rules or payment. That is deliberate: it is a
storefront sample, not a shop you can take money on.
