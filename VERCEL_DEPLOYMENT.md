# Vercel Deployment Guide

## Environment Variables

Set these in your Vercel dashboard under Project Settings → Environment Variables:

### Required Variables
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_GITHUB_TOKEN=ghp_your_github_token_here
```

### Optional Variables
```
GITHUB_TOKEN=ghp_your_github_token_here
```

## Deployment Steps

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Add the variables listed above
   - Make sure to select the correct environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your site

## Post-Deployment Checklist

- [ ] Site loads correctly at your Vercel URL
- [ ] All pages are accessible
- [ ] Dark/light mode toggle works
- [ ] Contact form (if present) functions
- [ ] Deployment Helper tool works with your API tokens
- [ ] Real-time visitor map displays correctly

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

## Troubleshooting

### Build Failures
- Check the Build Logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Verify `package.json` has correct scripts

### Runtime Errors
- Check browser console for errors
- Verify API endpoints are accessible
- Check environment variable names (NEXT_PUBLIC_ prefix for client-side access)

### Performance Issues
- Enable Vercel Analytics
- Check Core Web Vitals
- Optimize images and assets
