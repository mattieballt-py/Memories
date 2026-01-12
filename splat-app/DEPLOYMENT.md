# Deployment Guide

## Deploying to Vercel

This application is ready to be deployed to Vercel. Follow these steps:

### Prerequisites
- Install Vercel CLI: `npm i -g vercel`
- Make sure you have a Vercel account

### Deployment Steps

1. **Navigate to the app directory:**
   ```bash
   cd splat-app
   ```

2. **Deploy to production:**
   ```bash
   vercel --prod
   ```

3. **Follow the prompts:**
   - Link to existing project or create new one
   - Configure build settings (Next.js should be auto-detected)
   - Wait for deployment to complete

### Environment Variables (if needed)
If you need to add environment variables:
- Create a `.env.local` file for local development
- Add variables through Vercel Dashboard or CLI for production

### Build Command
The default build command is:
```bash
npm run build
```

### Output Directory
Next.js will output to `.next` directory automatically.

### Post-Deployment
After deployment, your app will be available at:
- Production: `https://your-project.vercel.app`
- Preview deployments for each push to branches

## Alternative: Manual Deployment

You can also deploy through the Vercel Dashboard:
1. Visit https://vercel.com
2. Import your GitHub repository
3. Configure project settings
4. Deploy

## Notes
- The application uses Next.js 14 with App Router
- All dependencies are production-ready
- 3D rendering works in modern browsers with WebGL support
