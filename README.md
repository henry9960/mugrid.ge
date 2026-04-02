# Harry Mugridge — Portfolio

A minimal personal portfolio website built with pure HTML, CSS, and vanilla JavaScript. No frameworks, no build step — just push and it works.

## File structure

```
/
├── index.html      ← main page
├── style.css       ← all styles (CSS custom properties, mobile-first)
├── script.js       ← nav scroll effect + scroll-reveal animations
├── resume.pdf      ← ADD YOUR OWN (not included — see note below)
└── README.md
```

## Adding your resume

Place your resume as `resume.pdf` in the root directory alongside `index.html`. The "My Resume" button and the nav link both point to `./resume.pdf`.

If you'd prefer to link to an external URL (e.g. Google Drive), update the two `href="./resume.pdf"` attributes in `index.html` to your URL.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `portfolio`).
2. Push all files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, set the source to **Deploy from a branch**.
5. Select branch: `main` · folder: `/ (root)` → click **Save**.
6. After ~60 seconds your site will be live at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

## Customisation tips

| What to change | Where |
|---|---|
| Name, tagline | `index.html` — hero section |
| Bio text & tags | `index.html` — about section |
| Social handles / URLs | `index.html` — card `href` attributes |
| Colours / spacing | `style.css` — `:root` custom properties |
| Resume file | Replace `resume.pdf` in the root |
