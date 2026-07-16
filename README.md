# Beauty Lodge by Anna — Website

Lashes, permanent makeup, and permanent jewelry. Two pages:
`index.html` (home) and `jewelry.html`.

## Preview locally
Double-click `index.html`.

## Common edits
- **Booking link** — in `script.js`, near the top:
  ```js
  const BOOKING_URL = "https://your-link.glossgenius.com/";
  ```
  Every "Book" button on both pages updates automatically.
- **Footer details** — in `index.html` and `jewelry.html`, replace the
  `[bracketed]` city / hours / email / phone with your real info.
- **Photos** — replace a file inside `assets/` using the **same filename**.

## Host on GitHub Pages
1. Create a new **public** repository.
2. Upload the **contents** of this folder (so `index.html` sits at the top
   level — not inside a subfolder).
3. **Settings → Pages →** Branch: `main`, Folder: `/ (root)` → **Save**.
4. Your site: `https://YOUR-USERNAME.github.io/REPO-NAME/`

`.nojekyll` is included so GitHub serves all files as-is.

## Host on Netlify (drag & drop)
Go to https://app.netlify.com/drop and drag this whole folder in.
To update later: your site → **Deploys** → drag the folder on again.
