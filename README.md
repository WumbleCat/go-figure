# go-figure

## Live site

Play it in your browser: **https://go-figure-9727qaulm-komeths-projects.vercel.app/**

## Run locally

```sh
cd figura
npm install
npx expo start
```

Then open the project on your device by scanning the QR code with the Expo Go app (iOS / Android), or press `w` to open in the browser.

## Deploy the web app to Vercel

The app builds to a static web bundle that any static host (including Vercel) can serve. A `figura/vercel.json` is already committed with the right install/build/output settings and a SPA rewrite so all expo-router routes fall back to `index.html`.

### Option A — Vercel dashboard (GitHub integration)

1. Push the repo to GitHub.
2. In the Vercel dashboard, click **Add New → Project** and import the repo.
3. In the project settings, set:
   - **Root Directory**: `figura`
   - **Framework Preset**: Other
   - The Install Command, Build Command, and Output Directory will be picked up from `vercel.json` automatically — leave the dashboard fields blank.
4. Click **Deploy**. Subsequent pushes to the default branch redeploy automatically.

### Option B — Vercel CLI

```sh
npm install -g vercel
cd figura
vercel            # first run: link to a project, accept the detected settings
vercel --prod     # promote to production
```

### Verifying the build locally

```sh
cd figura
npx expo export -p web
npx serve dist
```

Open `http://localhost:3000` and confirm all routes (`/`, `/play`, `/stats`) load and the layout is centered at the 480px phone width.

### Notes

- Node 22 LTS or 24 both work; the `postinstall` hook in `figura/package.json` patches a Metro-on-Windows ESM issue and is a no-op elsewhere.
- The dataset (`figura/assets/data/figures_2.csv`) is bundled into the export, so no runtime fetch from a remote origin is required.
