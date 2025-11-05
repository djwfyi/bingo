# GitHub setup & Pages walkthrough (tailored for djwfyi)

Below are step-by-step commands to create a GitHub repository for this site under the user `djwfyi`, push the existing code, and publish it with GitHub Pages. There are two main options: using the GitHub website (web UI) or using the GitHub CLI (`gh`). Use whichever is easiest.

Quick checklist before starting
- Make sure you have an account at https://github.com (username: djwfyi). If you don't, sign up and verify your email.
- Install Git locally. On many Linux systems:

```sh
sudo apt update
sudo apt install git -y
```

- (Optional but handy) Install the GitHub CLI `gh` for easy repository creation and authentication. Install instructions: https://cli.github.com/manual/installation

Option 1 — Web UI (beginner-friendly)

1. Create the repo on GitHub:
   - Open https://github.com/new while signed in as `djwfyi`.
   - Repository name: `bingo` (or choose another name).
   - Description: "Simple Bingo site"
   - Keep it Public (so Pages will be available on the free plan).
   - Do NOT check "Initialize this repository with a README" (we already have files locally).
   - Click "Create repository".

2. Copy the repository URL displayed on the page, then run these commands locally (replace <your-email> with your Git email if not set):

```sh
cd /path/to/your/repo/bingo
git init
git add .
git commit -m "Initial site commit"
git branch -M main
git remote add origin https://github.com/djwfyi/bingo.git
git push -u origin main
```

3. After the push completes, the GitHub Actions workflow we added (`.github/workflows/deploy-pages.yml`) will run automatically. Wait a minute or two.

4. Verify Pages:
   - Go to https://github.com/djwfyi/bingo/actions to check the workflow run logs (the Deploy to GitHub Pages job).
   - Once the deployment succeeds, open: https://djwfyi.github.io/bingo/

Notes: If the site doesn't appear after a few minutes, open the repository → Settings → Pages to check status and any error messages.

Option 2 — GitHub CLI (faster if you like the command line)

1. Authenticate `gh` (if not already):

```sh
gh auth login
```

Follow the prompts to authenticate with GitHub in your browser.

2. Create the repository and push:

```sh
cd /path/to/your/repo/bingo
git init
git add .
git commit -m "Initial site commit"
git branch -M main
gh repo create djwfyi/bingo --public --source=. --remote=origin --push
```

The `gh repo create` command above will create the repo and push the current branch up.

3. The Actions workflow will trigger automatically on push and deploy to Pages. Check the actions page for progress: https://github.com/djwfyi/bingo/actions

4. Visit your published site at: https://djwfyi.github.io/bingo/

If GitHub requires Pages to be enabled manually (rare with the deploy action):
- Open repository → Settings → Pages → Under "Build and deployment" choose "GitHub Actions" (or "Deploy from a branch" → main / /(root)). Save.

Custom domain (optional)
- If you have a custom domain, you can add a `CNAME` file at the repo root with the domain name, push it, and then configure DNS to point at GitHub Pages per GitHub's docs.

Common issues & fixes
- Permission/push errors: make sure your Git credentials or `gh` authentication are set up. Use `gh auth login` or `git remote set-url origin ...` with HTTPS and run `git push`.
- Pages shows 404: wait a couple minutes and refresh — GitHub Pages may take a short time to publish.
- Workflow failed: open the Actions tab to inspect logs and errors; copy the error text and I can help diagnose.

Want me to do this for you?
- I cannot create repositories or push on your behalf from here. If you run the commands above and paste any errors you see into this chat, I will help you fix them immediately.
