# Deploying to Vercel

Complete guide to deploy your Experiment Tracker to production.

## Prerequisites

- GitHub account (to push your code)
- Vercel account (free at [vercel.com](https://vercel.com))
- Supabase project (already set up ✅)

---

## Step 1: Push to GitHub

```bash
cd "/Users/rahuladhinisatheeshbabu/Documents/PROJECTS/Experiment Tracker/experiment-tracker"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Experiment Tracker"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/experiment-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find and select your `experiment-tracker` repository
4. Click **"Import"**

### Configure Environment Variables

Before clicking Deploy, expand **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kfmuczqxrsacelwgbyuj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key) |

5. Click **"Deploy"**
6. Wait ~1 minute for build to complete

---

## Step 3: Your App is Live! 🎉

Vercel will give you a URL like:
- `https://experiment-tracker-xxx.vercel.app`

You can also add a custom domain in Vercel's project settings.

---

## Optional: Supabase Security (Recommended)

Since your app is public, update Supabase settings:

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL** and **Redirect URLs**
3. Go to **Database** → **Database Settings**
4. Consider enabling **Row Level Security (RLS)** for production

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check that all dependencies are in `package.json` |
| Can't connect to Supabase | Verify env vars are added in Vercel |
| CORS errors | Add your Vercel domain to Supabase allowed origins |

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Tested on live URL
