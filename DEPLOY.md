# Deploy HABITAT to Vercel

The fastest path from `localhost:5173` to a public URL is **Vercel** — it's free, takes 2 minutes, and handles the SPA rewrites for HashRouter automatically.

## One-time setup

1. **Push to GitHub**
   ```bash
   git init && git add -A && git commit -m "habitat v1"
   git branch -M main
   git remote add origin https://github.com/YOU/habitat.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import" next to your `habitat` repo
   - Framework preset: **Vite** (auto-detected)
   - Root directory: `./` (default)
   - Build command: `npm run build` (default)
   - Output directory: `dist` (default)
   - Click **Deploy**

3. **(Optional) Add a custom domain**
   - In Vercel: Project → Settings → Domains
   - Add `habitat.app` or your own; Vercel auto-issues HTTPS and a free `*.vercel.app` subdomain in the meantime.

4. **(Optional) Enable Supabase cloud sync**
   - Create a free project at https://supabase.com
   - Run the contents of [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor
   - In Vercel: Project → Settings → Environment Variables, add:
     - `VITE_SUPABASE_URL` = your project URL
     - `VITE_SUPABASE_ANON_KEY` = your anon public key
   - Redeploy. The Profile page will now show the sign-in panel.

## How to redeploy

Just `git push`. Vercel rebuilds and rolls out automatically. No downtime.

## What this build does for you

- `vercel.json` rewrites every URL to `/index.html` so deep links (`/habits`, `/leaderboard`, etc.) work.
- Service worker is served with `Cache-Control: no-cache` so updates ship instantly.
- Vite asset chunks are cached for one year (immutable).
- The OG image, manifest, robots.txt, and sitemap are served from `public/`.

## Continuous deployment

Vercel watches `main`. For staging branches, every push gets its own preview URL automatically. Use them to test on real phones.

## Monitoring

Vercel shows deploy logs, build duration, and bandwidth. The free tier includes 100GB/month — way more than you'll need at launch.
