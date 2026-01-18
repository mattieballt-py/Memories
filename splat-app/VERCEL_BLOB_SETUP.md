# Vercel Blob Storage Setup

## Why This Is Needed

The Gaussian splat viewer library (`@mkkellogg/gaussian-splats-3d`) ONLY accepts HTTP/HTTPS URLs for loading PLY files. It cannot use:
- ❌ blob: URLs (e.g., `blob:http://localhost:3000/...`)
- ❌ ArrayBuffer or raw binary data
- ✅ Only HTTP/HTTPS URLs work

**Solution**: Upload PLY files to Vercel Blob storage and use the public HTTPS URL.

---

## How to Get Your BLOB_READ_WRITE_TOKEN

### Step 1: Go to Vercel Dashboard
Visit: https://vercel.com/dashboard/stores

### Step 2: Create a Blob Store (if you don't have one)
1. Click "Create Database" or "Create Store"
2. Select "Blob" as the store type
3. Give it a name (e.g., "splat-storage")
4. Click "Create"

### Step 3: Get Your Token
1. Once the store is created, you'll see a connection string
2. Look for `BLOB_READ_WRITE_TOKEN` in the environment variables section
3. Copy the full token value (it will look like: `vercel_blob_rw_XXXXXXXXXXXXXXXX`)

### Step 4: Add to .env.local
1. Open `.env.local` in your project root
2. Replace `your_token_here` with your actual token:
   ```bash
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXX
   ```
3. Save the file

### Step 5: Restart Your Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## Testing the Setup

After adding the token and restarting:

1. Go to http://localhost:3000 (or your dev server URL)
2. Upload an image
3. Watch the console for:
   ```
   Calling Modal API: https://...
   Received PLY file: { size: XXXXX, type: '...' }
   Uploaded PLY to Vercel Blob: https://...vercel-storage.com/...
   ```
4. The viewer should load the Gaussian splat from the Vercel Blob URL

---

## Troubleshooting

### "No token found" error persists
- Make sure you restarted the dev server after adding the token
- Check that the token starts with `vercel_blob_rw_`
- Verify there are no extra spaces or quotes around the token in `.env.local`

### "Access denied" or "Unauthorized"
- Make sure you're using the READ_WRITE token, not a read-only token
- Check that your Vercel account has access to the blob store
- Try regenerating the token from the Vercel dashboard

### Files not uploading
- Check the Vercel dashboard to see if files are appearing in your blob store
- Look at the API route console logs for detailed error messages
- Verify your blob store has sufficient storage quota

---

## Alternative: Local Development Without Vercel Blob

If you want to test locally without Vercel Blob, you can temporarily serve PLY files from the Next.js API route, but this has limitations:

**Option A: Return blob URL (won't work with Gaussian splat viewer)**
- Already tried, viewer doesn't support blob URLs

**Option B: Serve from public static URL**
- Save PLY to `public/temp/` directory
- Return URL like `http://localhost:3000/temp/splat-xxx.ply`
- Works for local dev, but won't work in production (files aren't persisted)

**Recommended**: Just use Vercel Blob - it's free tier is generous and works in both dev and production.

---

## Production Deployment

When deploying to Vercel:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add `BLOB_READ_WRITE_TOKEN` with your token value
4. Redeploy your application

The same token works for both development and production.

---

## Cost

Vercel Blob free tier includes:
- 500MB storage
- 5GB bandwidth per month

For this app (PLY files are typically 5-50MB each), this should be sufficient for testing and moderate use.
