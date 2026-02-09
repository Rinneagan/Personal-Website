# Deployment Environment Variables Guide

## 🚀 Production Environment Setup

The contact form works locally because `.env.local` is loaded, but deployment platforms need environment variables configured differently.

### **📧 Vercel (Recommended)**
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add these variables:
   ```
   GMAIL_USER=ebenezerkessel99@gmail.com
   GMAIL_PASS=mtxg qvvv lmxk ajci
   GITHUB_TOKEN=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
   ```

### **🐳 Netlify**
1. Go to Site settings → Build & deploy → Environment
2. Add environment variables:
   ```
   GMAIL_USER=ebenezerkessel99@gmail.com
   GMAIL_PASS=mtxg qvvv lmxk ajci
   GITHUB_TOKEN=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
   ```

### **🔧 Other Platforms**
Check your hosting provider's documentation for "environment variables" or "secrets management"

### **⚠️ Important Notes**
- **Never commit** `.env.local` to git (already in .gitignore)
- **Use exact values** - no extra spaces or quotes
- **GMAIL_PASS** is your 16-character app password, not regular password
- **Restart deployment** after adding variables

### **🔄 Deployment Commands**
After setting environment variables:
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages (uses GitHub Actions)
git push origin main
```

### **🧪 Testing in Production**
1. Deploy after setting environment variables
2. Test contact form on live site
3. Check if email arrives in Gmail
4. Check Vercel/Netlify logs for errors

### **🐛 Troubleshooting**
If emails still don't work:
1. **Check logs** in your deployment platform
2. **Verify Gmail app password** is correct
3. **Ensure 2-step verification** is enabled
4. **Check Gmail security** settings for blocked apps
5. **Test API endpoint** directly: `https://your-domain.com/api/contact`
