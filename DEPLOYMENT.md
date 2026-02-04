# 🚀 Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account
- ✅ Vercel account (free)
- ✅ Railway account (free)
- ✅ All API keys (DeepL, Mistral, Supabase)
- ✅ Working local build

---

## Step 1: Push to GitHub

### Create Repository

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MediTranslate Healthcare Translation Platform"

# Create GitHub repo at https://github.com/new
# Then link and push:

git remote add origin https://github.com/yourusername/meditranslate.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `meditranslate` repository
5. Click **"Add variables"**

### 2.2 Configure Environment Variables

Add these in Railway dashboard:

```env
DEEPL_API_KEY=your_deepl_api_key
MISTRAL_API_KEY=your_mistral_api_key
SUPABASE_URL=https://wrgfphiimznqlelsofym.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**IMPORTANT**: Update `FRONTEND_URL` after deploying frontend!

### 2.3 Configure Build Settings

Railway should auto-detect, but verify:

- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.4 Deploy

Click **"Deploy"** - Railway will build and deploy automatically.

### 2.5 Get Backend URL

After deployment, Railway provides a URL like:
```
https://meditranslate-production.up.railway.app
```

**Save this URL** - you'll need it for frontend!

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Vite

### 3.2 Configure Build Settings

Verify these settings:

- **Framework Preset**: Vite
- **Root Directory**: `./` (project root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Environment Variables

Click **"Environment Variables"** and add:

```env
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_SUPABASE_URL=https://wrgfphiimznqlelsofym.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Replace `your-backend.up.railway.app`** with your actual Railway URL!

### 3.4 Deploy

Click **"Deploy"** - Vercel will build and deploy.

### 3.5 Get Frontend URL

Vercel provides a URL like:
```
https://meditranslate.vercel.app
```

---

## Step 4: Update Backend CORS

### 4.1 Update Railway Environment

Go back to Railway → Your project → Variables

Update:
```env
FRONTEND_URL=https://meditranslate.vercel.app
```

**Use your actual Vercel URL!**

### 4.2 Redeploy Backend

Railway will automatically redeploy with new environment variable.

---

## Step 5: Verify Deployment

### Test Checklist

1. ✅ **Frontend loads**: Visit your Vercel URL
2. ✅ **Select role**: Click Doctor or Patient
3. ✅ **Start conversation**: Creates new conversation
4. ✅ **Send message**: Type "Hello" and send
5. ✅ **Translation works**: Message gets translated
6. ✅ **Audio recording**: Record and play audio
7. ✅ **Search**: Search for keywords
8. ✅ **AI Summary**: Generate conversation summary

### Debug Common Issues

**Frontend can't connect to backend:**
- Check `VITE_API_URL` in Vercel env vars
- Verify Railway backend is running
- Check browser console for CORS errors

**Translation fails:**
- Verify `DEEPL_API_KEY` in Railway
- Check API key is valid and has quota

**Audio upload fails:**
- Confirm `audio-recordings` bucket exists in Supabase
- Verify bucket is PUBLIC
- Check `SUPABASE_SERVICE_KEY` is correct

**Database errors:**
- Verify SQL schema was run in Supabase
- Check `SUPABASE_URL` and keys are correct

---

## Step 6: Final URL Update

### Update README.md

Replace placeholders in README:

```markdown
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://meditranslate.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repository-blue)](https://github.com/yourusername/meditranslate)
```

Commit and push:
```bash
git add README.md
git commit -m "docs: Add deployment URLs"
git push
```

---

## 🎉 Deployment Complete!

Your application is now live at:

- **Frontend**: https://meditranslate.vercel.app
- **Backend**: https://meditranslate-production.up.railway.app
- **GitHub**: https://github.com/yourusername/meditranslate

---

## 📊 Monitoring

### Vercel Analytics
- View deployment logs in Vercel dashboard
- Monitor build times and errors

### Railway Logs
- Check backend logs in Railway
- Monitor API response times
- Track error rates

### Supabase Dashboard
- Monitor database queries
- Check storage usage
- View API usage

---

## 🔄 Future Deployments

### Auto-Deploy on Git Push

Both Vercel and Railway auto-deploy on git push to `main`:

```bash
# Make changes
git add .
git commit -m "feature: Add new functionality"
git push

# Vercel and Railway will auto-deploy!
```

### Manual Redeploy

**Vercel:**
- Go to Deployments tab
- Click "Redeploy" on latest deployment

**Railway:**
- Go to project
- Click "Redeploy"

---

## 🛡️ Production Best Practices

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use separate API keys for production
- ✅ Rotate keys periodically

### Monitoring
- Set up error tracking (Sentry)
- Monitor API quota usage
- Check Supabase database size

### Security
- Enable rate limiting on API
- Add HTTPS-only headers
- Implement API authentication (future)

---

## 💰 Cost Estimates (Free Tiers)

- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month after free trial
- **Supabase**: Free (up to 500MB DB, 1GB storage)
- **DeepL**: Free (500k characters/month)
- **Mistral AI**: Pay-as-you-go (very cheap)

**Total**: ~$5-10/month for production use

---

## 📞 Support

If deployment issues occur:

1. Check deployment logs
2. Verify environment variables
3. Test locally first
4. Review error messages
5. Check API quota limits

---

**Good luck with your deployment! 🚀**
