# Deploying this Bingo site to a public web host (for beginners)

This document shows simple, step-by-step ways to publish the static site in this repository so it is publicly available on the web. It uses free services where possible and explains commands for beginners.

Important notes before you start
- This project is a static site (HTML/CSS/JS) — there is no server-side code.
- You must serve the files over HTTP(S) for features like fetching `words.txt` and `config.json` to work. Opening `index.html` directly with `file://` will not work in most browsers.
- If you want the PDF export to work completely offline, run `sh scripts/fetch_vendors.sh` and commit the `vendor/` folder before publishing (or host the vendor files yourself). See the README for details.

Quick local test (optional, for confirmation)
1. Open terminal and run:

```sh
cd /path/to/your/repo/bingo
python3 -m http.server 8000
```

2. Open your browser to `http://localhost:8000/` and verify the site loads.

If everything looks good locally, pick one of the hosting options below.

Option A — GitHub Pages (recommended for beginners)
-------------------------------------------------
Prerequisites:
- A GitHub account (free) — sign up at https://github.com if you don't have one.
- Git installed locally. On Linux: `sudo apt install git` (or your distro's package manager).

Steps:
1. Initialize a git repo (if you haven't already):

```sh
cd /path/to/your/repo/bingo
git init
git add .
git commit -m "Initial bingo site"
```

2. Create a new repository on GitHub:
- Go to https://github.com/new and create a repository (public is fine). Name it e.g. `bingo`.

3. Push your local repo to GitHub (replace `<your-user>` and `<repo>`):

```sh
git remote add origin https://github.com/<your-user>/<repo>.git
git branch -M main
git push -u origin main
```

4. Enable GitHub Pages:
- Go to your repository on GitHub → Settings → Pages.
- Under "Source", choose "Deploy from a branch" → select branch `main` and folder `/(root)` and click Save.
- After a minute or two, your site will be available at `https://<your-user>.github.io/<repo>/`.

Tips:
- If you want a custom domain, set it up in the Pages settings and follow GitHub's instructions for DNS.
- Make sure `config.json` and `words.txt` are present in the repo root before pushing.

Option B — Netlify (drag & drop, easiest for non-git users)
---------------------------------------------------------
Netlify has a drag-and-drop deploy for static sites and a free tier.

Steps (drag & drop):
1. Zip the project folder contents (not the parent folder). Example:

```sh
cd /path/to/your/repo/bingo
zip -r ../bingo-deploy.zip .
```

2. Go to https://app.netlify.com/drop, sign up, and drop the `bingo-deploy.zip` file.
3. Netlify will publish a random subdomain like `optimistic-bunny-123.netlify.app`. You can customize the site name from the Netlify dashboard.

Steps (git-backed deploy):
1. Sign up at Netlify and connect your GitHub account.
2. Create a new site and pick the repository you pushed earlier. There is no build step; set the build command empty and the publish directory `/`.

Option C — Vercel (git-backed; friendly defaults)
------------------------------------------------
1. Sign up at https://vercel.com and connect your GitHub account.
2. Import your repository and accept the defaults. Vercel will detect a static site and publish it. The published URL will be like `https://your-site.vercel.app`.

Option D — Surge.sh (super-simple CLI deploy)
---------------------------------------------
Surge is a quick static host. You will need Node.js + npm.

1. Install surge (you only need to do this once):

```sh
npm install -g surge
```

2. Deploy the site:

```sh
cd /path/to/your/repo/bingo
surge .
```

Follow prompts. Surge will publish to a free subdomain, or you can specify your own.

Option E — GitLab Pages (if you prefer GitLab)
----------------------------------------------
Follow GitLab's Pages guide. The core idea is the same: push your repo to GitLab and add a simple `.gitlab-ci.yml` for static pages. See: https://docs.gitlab.com/ee/user/project/pages/

Security and CORS notes
- Because the site fetches `config.json` and `words.txt` from the same origin, a passive static host (GitHub Pages, Netlify, Vercel, Surge) will work without extra configuration.
- If you host `config.json` or `words.txt` from a different domain, the host must send appropriate CORS headers.

Going fully offline
- If you want to commit the vendor libraries so PDF export works without external network access, run:

```sh
sh scripts/fetch_vendors.sh
git add vendor/html2canvas.min.js vendor/jspdf.umd.min.js
git commit -m "Add vendor libs for offline export"
git push
```

After deployment the export button will use the local files.

Verification checklist (after deploy)
- Open your published URL.
- The site should show your configured title (from `config.json`) and optional header image.
- Click squares to set marks — marks are saved to localStorage (so they persist per-browser).
- Click Export PDF — a PDF file should download (if vendor libs are available or CDN accessible).

Troubleshooting
- Blank board or missing words: verify `words.txt` was deployed in the site root and accessible.
- Config not applied: verify `config.json` is present and contains valid JSON.
- PDF export fails: open developer console for errors. If a library failed to load, either allow network access to the CDN or include the vendor files locally.

Help & support
- If you want, I can generate a step-by-step GitHub Pages walkthrough tailored to your GitHub username (including exact commands and a sample commit message).

Enjoy your public Bingo site!
