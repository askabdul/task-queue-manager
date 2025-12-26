# 🚀 Task Queue Manager - Hosting Guide

This guide explains how to host the Task Queue Manager using the generated `out` folder for static hosting.

## 📁 Generated Files

The `out` folder contains a complete static build of the Task Queue Manager that can be hosted on any static hosting service or web server.

### 📂 Folder Structure
```
out/
├── index.html              # Main application entry point
├── 404.html               # Custom 404 error page
├── _next/                 # Next.js generated assets
│   ├── static/
│   │   ├── chunks/        # JavaScript bundles
│   │   └── css/           # Stylesheet files
│   └── 4Hq5Emv3APAGajhh0r8sc/ # Build-specific assets
├── _not-found/            # Not found page assets
└── 404/                   # 404 page assets
```

## 🌐 Hosting Options

### 1. **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the out folder
cd out
vercel --prod
```

### 2. **Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy the out folder
netlify deploy --prod --dir=out
```

### 3. **GitHub Pages**
1. Push the `out` folder contents to a `gh-pages` branch
2. Enable GitHub Pages in repository settings
3. Set source to `gh-pages` branch

### 4. **Surge.sh**
```bash
# Install Surge
npm install -g surge

# Deploy from out folder
cd out
surge . your-domain.surge.sh
```

### 5. **AWS S3 + CloudFront**
1. Create an S3 bucket with static website hosting
2. Upload all files from `out` folder to the bucket
3. Configure CloudFront distribution for CDN

### 6. **Firebase Hosting**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase in your project
firebase init hosting

# Set public directory to 'out' in firebase.json
# Deploy
firebase deploy
```

### 7. **Apache/Nginx Server**
Simply copy all files from the `out` folder to your web server's document root.

#### Apache Configuration (.htaccess)
```apache
RewriteEngine On
RewriteRule ^$ index.html [L]
RewriteRule ^([^.]+)$ $1.html [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . index.html [L]
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/out/folder;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    # Cache static assets
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## ⚙️ Configuration Notes

### Environment Variables
The application is configured with default values:
- `REDIS_URL`: redis://localhost:6379 (for demo purposes)
- `API_BASE_URL`: http://localhost:3001 (for demo purposes)
- `WEBSOCKET_URL`: ws://localhost:3001 (for demo purposes)

**Note**: This is a frontend-only demo application that uses mock data. No backend services are required for hosting.

### Security Headers (Recommended)
Add these headers to your hosting configuration:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
```

## 🔧 Build Information

- **Framework**: Next.js 16.1.1 with static export
- **Build Mode**: Production optimized
- **Bundle Size**: Optimized for performance
- **Browser Support**: Modern browsers (ES2017+)

## 🎯 Features Included

✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Dark/Light Theme** - Theme persistence with localStorage  
✅ **Real-time Mock Data** - Simulated live dashboard updates  
✅ **Professional UI** - Enterprise-grade design and UX  
✅ **Interactive Components** - Fully functional queue management interface  
✅ **SEO Optimized** - Proper meta tags and structured markup  

## 🚀 Quick Deploy Commands

### One-line deployment options:

**Vercel:**
```bash
cd out && npx vercel --prod
```

**Netlify:**
```bash
npx netlify-cli deploy --prod --dir=out
```

**Surge:**
```bash
cd out && npx surge . task-queue-manager-demo.surge.sh
```

## 📊 Performance Optimization

The build includes:
- **Code Splitting**: Automatic chunk splitting for optimal loading
- **CSS Optimization**: Minified and purged unused styles
- **Asset Compression**: Optimized JavaScript bundles
- **Image Optimization**: Configured for static hosting
- **Cache Headers**: Proper caching for static assets

## 🔍 Troubleshooting

### Common Issues:

1. **404 Errors on Refresh**
   - Ensure your server redirects all routes to `index.html`
   - Check the server configuration examples above

2. **Assets Not Loading**
   - Verify all files from `out` folder are uploaded
   - Check file permissions (755 for directories, 644 for files)

3. **Styling Issues**
   - Ensure CSS files in `_next/static/` are accessible
   - Check for CORS issues if hosting assets separately

### Performance Tips:

1. **Enable Gzip/Brotli compression** on your server
2. **Set proper cache headers** for static assets
3. **Use a CDN** for global distribution
4. **Enable HTTP/2** for better performance

## 📝 Custom Domain Setup

After deploying, you can configure a custom domain:

1. **DNS Configuration**: Point your domain to the hosting service
2. **SSL Certificate**: Most hosting services provide free SSL
3. **Domain Verification**: Follow your hosting provider's domain setup guide

## 🎉 Demo URL

Once deployed, your Task Queue Manager will be accessible at your chosen domain and will showcase:

- **System Overview Dashboard**
- **Queue Management Interface**  
- **Job Monitoring & Creation**
- **Worker Management**
- **System Alerts & Monitoring**
- **Real-time Mock Data Updates**

Perfect for portfolio demonstrations and technical interviews!

---

**Built with ⚡ Next.js | Deployed with 🚀 Static Export | Ready for 🌐 Production**