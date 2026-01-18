# QUICK FIX - Your Modal URL is Wrong

## The Problem

Your `.env.local` has:
```
NEXT_PUBLIC_SPLAT_API_URL=https://modal.com/apps/mattieballt-py/main
```

This is **NOT** a valid API endpoint. This is just the dashboard URL.

---

## The Fix

You need to get the **actual web endpoint URL** from Modal.

### Option 1: Find it in Modal Dashboard

1. Go to https://modal.com/apps/mattieballt-py/main
2. Find your deployed function (the one that processes images)
3. Click on it
4. Look for "Web endpoint" or "URL" - it will look like:
   ```
   https://mattieballt-py--sharp-api.modal.run
   ```

### Option 2: Check Your Modal Code

Look at your Modal Python code for the function name:

```python
@app.function()
@modal.web_endpoint(method="POST")
def sharp_api(request):  # ← This is the function name
    ...
```

The URL format is:
```
https://{workspace}--{function-name}.modal.run
```

So if:
- Workspace = `mattieballt-py`
- Function name = `sharp-api` (or whatever you named it)

Then the URL is:
```
https://mattieballt-py--sharp-api.modal.run
```

### Option 3: Try Common Patterns

Based on your setup, try these URLs:

```bash
# Try 1: sharp-api
https://mattieballt-py--sharp-api.modal.run

# Try 2: process-image or similar
https://mattieballt-py--process-image.modal.run

# Try 3: splat or create-splat
https://mattieballt-py--create-splat.modal.run
```

---

## Update Your .env.local

Once you find the correct URL, edit `.env.local`:

```bash
# Replace with your ACTUAL Modal web endpoint
NEXT_PUBLIC_SPLAT_API_URL=https://mattieballt-py--sharp-api.modal.run
```

---

## Then Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## How to Test if URL is Correct

Try this curl command with your URL:

```bash
curl -X POST \
  -F "file=@/path/to/test-image.jpg" \
  https://mattieballt-py--sharp-api.modal.run
```

If it works, you'll get:
```json
{
  "ply_url": "https://..."
}
```

If it fails, you'll see the error message that tells you what's wrong.

---

## Still Not Working?

Share your Modal Python code (the `@modal.web_endpoint` function) and I can tell you the exact URL format you need.
