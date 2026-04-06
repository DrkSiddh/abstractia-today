# ABSTRACTIA — abstractia.today

Never-ending Interactive Art You Own & Control  
By Maxximillian · 365 Works · I–CCCLXV

## Stack

- **Site**: Static HTML/CSS/JS — hosted on Cloudflare Pages
- **Database**: Supabase (abstractia-today project) — works, machine items, claims, inquiries, installations
- **Assets**: This repo — HTML artwork files, images, title cards
- **Domain**: abstractia.today

## Repo Structure

```
abstractia-today/
├── index.html          — Main gallery + landing
├── install.html        — Installation inquiry form
├── about.html          — About Maxximillian + the series
├── exhibitions.html    — Exhibition archive
├── installations.html  — Installation portfolio
├── claim/
│   └── index.html      — QR code claim page (reads ?id= param)
├── works/
│   └── *.html          — Individual HTML artwork files
├── images/
│   ├── title-cards/    — Preview stills per work
│   └── installations/  — Installation photography
├── css/
│   ├── style.css       — Main stylesheet
│   └── install.css     — Installation page styles
└── js/
    ├── supabase.js     — Supabase client config
    ├── gallery.js      — Gallery grid + modal
    ├── hero.js         — Hero wave canvas + nav
    └── install.js      — Inquiry form logic
```

## Adding a New Work

1. Add the HTML artwork file to `/works/`
2. Add a title card image to `/images/title-cards/`
3. Insert a row into the `works` table in Supabase with `published = true`
4. The gallery updates automatically — no rebuild needed

## Deploying

Connected to Cloudflare Pages. Every push to `main` deploys automatically.

## QR Claim Flow

Each physical item (claw machine ball, etc.) has a UUID in the `machine_items` table.  
The QR code points to: `https://abstractia.today/claim/?id=[uuid]`  
The claim page reads the ID, shows the work, and records the claimer's wallet address.

---

© Maxximillian — ABSTRACTIA — abstractia.today
