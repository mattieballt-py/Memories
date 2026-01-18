# Setup Guide - Image to PLY Point Cloud

## Problem: Getting "Forbidden" Error?

This means your Modal endpoint is rejecting the request. Here's how to fix it:

---

## Step 1: Get Your ACTUAL Modal URL

The URL `https://modal.com/apps/mattieballt-py/main/deployed/sharp-api` is NOT the correct format.

### Find Your Real Modal Deployment URL

1. Go to your Modal dashboard: https://modal.com/apps
2. Find your deployed function
3. Look for the **actual web endpoint URL** - it should look like:
   ```
   https://mattieballt-py--sharp-api-web.modal.run
   ```
   OR
   ```
   https://mattieballt-py--function-name.modal.run
   ```

The correct format is typically: `https://{workspace}--{function-name}.modal.run`

---

## Step 2: Check What Your Modal Function Expects

### Your Modal function should:
1. Accept `POST` requests
2. Accept `multipart/form-data` with a file field
3. Return JSON: `{ "ply_url": "https://..." }`

### Example Modal Function (Python)
```python
import modal

app = modal.App("sharp-api")

@app.function()
@modal.web_endpoint(method="POST")
def process_image(request):
    # Get uploaded file
    file_data = request.files.get("file")  # ← Must match form field name

    # Process image to PLY
    ply_url = process_to_ply(file_data)

    # Return JSON response
    return {"ply_url": ply_url}
```

**IMPORTANT:** The form field name in your Next.js app is `"file"`. Make sure your Modal function expects `request.files.get("file")`.

---

## Step 3: Update Environment Variables

Edit your `.env.local` file:

```bash
# Your ACTUAL Modal deployment URL (find this in Modal dashboard)
NEXT_PUBLIC_SPLAT_API_URL=https://mattieballt-py--sharp-api-web.modal.run

# If your Modal function requires authentication (optional)
# MODAL_API_KEY=your_api_key_here
```

**Note:** If your Modal function is public (no auth required), you only need the URL.

---

## Step 4: Enable CORS on Your Modal Function (if needed)

If you get CORS errors, add CORS headers to your Modal function:

```python
@app.function()
@modal.web_endpoint(method="POST")
def process_image(request):
    # Process image
    ply_url = process_to_ply(request.files.get("file"))

    # Return with CORS headers
    return modal.Response(
        {"ply_url": ply_url},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )
```

---

## Step 5: Check Form Field Name

The Next.js app sends the file with field name `"file"`:
```typescript
formData.append('file', file);  // ← field name is "file"
```

Your Modal function must expect the same:
```python
file_data = request.files.get("file")  # ← must match
```

If your Modal function expects a different field name (e.g., `"image"`), you have two options:

### Option A: Change Modal function to expect "file"
```python
file_data = request.files.get("file")  # Change this
```

### Option B: Change Next.js to send different field name
Edit `src/app/api/create-splat/route.ts`:
```typescript
modalFormData.append('image', file);  // Change 'file' to 'image'
```

---

## Step 6: Add Authentication (if required)

If your Modal function requires an API key:

### 1. Add to `.env.local`:
```bash
MODAL_API_KEY=your_modal_api_key_here
```

### 2. Uncomment auth headers in `src/app/api/create-splat/route.ts`:
```typescript
const modalResponse = await fetch(modalApiUrl, {
  method: 'POST',
  body: modalFormData,
  headers: {
    'Authorization': `Bearer ${process.env.MODAL_API_KEY}`,
  },
});
```

---

## Step 7: Restart Your Dev Server

After changing `.env.local`, you MUST restart:
```bash
# Stop the dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Debugging Checklist

Run through these checks:

### ✅ Environment Variables
- [ ] `.env.local` file exists in project root
- [ ] `NEXT_PUBLIC_SPLAT_API_URL` is set to your ACTUAL Modal URL
- [ ] URL format is `https://{workspace}--{function}.modal.run`
- [ ] Dev server was restarted after changing `.env.local`

### ✅ Modal Function
- [ ] Modal function is deployed and running
- [ ] Function accepts POST requests
- [ ] Function accepts `multipart/form-data`
- [ ] Function expects field name `"file"` (or you changed Next.js code to match)
- [ ] Function returns JSON with `ply_url` field
- [ ] Function has CORS enabled (if calling from browser)

### ✅ Authentication
- [ ] If Modal requires auth, API key is in `.env.local`
- [ ] If Modal requires auth, headers are uncommented in route.ts
- [ ] If Modal is public, no auth headers are needed

### ✅ Test Modal Directly
Try calling your Modal endpoint with curl:
```bash
curl -X POST \
  -F "file=@/path/to/test-image.jpg" \
  https://your-modal-url.modal.run
```

Expected response:
```json
{
  "ply_url": "https://public-bucket.example.com/output.ply"
}
```

---

## Common Issues & Solutions

### Issue: "Forbidden" (403)
**Cause:** Wrong URL, missing auth, or Modal function rejecting request
**Fix:**
1. Verify Modal URL is correct
2. Add authentication if required
3. Check Modal logs for error details

### Issue: "Not Found" (404)
**Cause:** Wrong URL or Modal function not deployed
**Fix:**
1. Double-check Modal URL
2. Verify function is deployed in Modal dashboard

### Issue: CORS Error
**Cause:** Modal function not allowing cross-origin requests
**Fix:** Add CORS headers to Modal function response

### Issue: "Invalid response from backend"
**Cause:** Modal not returning expected JSON format
**Fix:** Ensure Modal returns `{ "ply_url": "..." }`

---

## Full Variable Reference

### Required Environment Variables

| Variable | Location | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SPLAT_API_URL` | `.env.local` | Your Modal deployment URL | `https://workspace--function.modal.run` |

### Optional Environment Variables

| Variable | Location | Description | Example |
|----------|----------|-------------|---------|
| `MODAL_API_KEY` | `.env.local` | Modal API key (if auth required) | `sk_live_xxx...` |

---

## Test Commands

### 1. Check environment variables are loaded:
```bash
cd splat-app
npm run dev
# Check console output for the Modal URL being used
```

### 2. Test file upload:
1. Open http://localhost:3000
2. Upload an image
3. Check browser console (F12) for errors
4. Check terminal for API logs

### 3. Check server logs:
The API route now logs:
- Modal URL being called
- File details (name, size, type)
- Modal error responses

Look in your terminal where `npm run dev` is running.

---

## Need More Help?

1. **Check Modal logs:** Go to Modal dashboard → your function → Logs
2. **Check browser console:** Press F12, go to Console tab
3. **Check Next.js logs:** Look at terminal where `npm run dev` is running
4. **Test Modal directly:** Use curl command above to verify Modal works

The error message in Modal or browser console will tell you exactly what's wrong.
