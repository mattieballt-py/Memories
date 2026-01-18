# Visibility Fix - "Can't See Anything" Issue

## Problem
Point cloud appears black or invisible - "no light in the viewer and can't see anything"

## Root Cause
Points were still too small (0.03 was better than 0.01, but still not enough for some Gaussian splats)

## Solution Applied

### 1. Increased Default Point Size
**File:** `src/app/components/PlyViewer.tsx` (Line 16)

```typescript
// Changed from:
pointSize = 0.03

// To:
pointSize = 0.05  // 67% larger
```

### 2. Removed Unnecessary Lighting
Points don't use lights - they're self-illuminated. Removed ambientLight to clarify this.

```typescript
// Note: Point clouds don't need lighting - they're self-illuminated
// Removed ambient light as it doesn't affect PointsMaterial
```

### 3. Added Interactive Debug Toggle
New "Show/Hide Helpers" button to toggle axes and grid without reloading.

**Features:**
- Top-left button: "🔍 Show Helpers" / "🔍 Hide Helpers"
- Toggles red/green/blue axes (X/Y/Z)
- Toggles ground grid
- Doesn't reload the entire scene (uses separate useEffect)

### 4. Enhanced Console Logging
Added material setup logging:

```typescript
console.log('Material setup:', {
  pointSize,
  hasVertexColors: !!geometry.attributes.color,
  color: material.color.getHexString(),
  sizeAttenuation: material.sizeAttenuation,
});
```

### 5. Better Debug Overlay
Bottom-left now shows point size:

```
Points: 523,441 | Size: 3.00×4.20×1.60 | Scaled: 2.00 units | Point size: 0.05
```

---

## How to Test

### 1. Check Console Logs (F12)

You should see:
```
PLY loaded successfully
Vertex count: [number]
Has colors: true/false
Bounding box: {...}
Material setup: {
  pointSize: 0.05,
  hasVertexColors: true,
  color: "ffffff",  // or vertex colors
  sizeAttenuation: true
}
Camera setup: {...}
```

### 2. Use Debug Helpers

Click "🔍 Show Helpers" button (top-left) to see:
- **Red line:** X axis
- **Green line:** Y axis
- **Blue line:** Z axis
- **Gray grid:** Ground plane

If you can see the helpers but not your point cloud, the issue is:
- Point size still too small (increase more)
- PLY file has very few points
- Points are outside the camera view (check console for bounding box)

### 3. Check Bottom-Left Debug Info

```
Points: 523,441 | Size: 3.00×4.20×1.60 | Scaled: 2.00 units | Point size: 0.05
```

- **Low point count** (<10,000): PLY quality issue, increase point size significantly
- **Very small size** (<0.1 units): Scaling issue, model might be too small
- **Point size shown:** If 0.05 isn't enough, pass larger value

---

## If Still Can't See Anything

### Try Larger Point Sizes

Edit `src/app/page.tsx` line 107:

```tsx
{/* Try progressively larger sizes */}
<PlyViewer plyUrl={plyUrl} pointSize={0.08} />
<PlyViewer plyUrl={plyUrl} pointSize={0.1} />
<PlyViewer plyUrl={plyUrl} pointSize={0.15} />
```

### Try Different Background

```tsx
<PlyViewer
  plyUrl={plyUrl}
  pointSize={0.1}
  backgroundColor={0x000000}  // Pure black
/>
```

Or:

```tsx
<PlyViewer
  plyUrl={plyUrl}
  pointSize={0.1}
  backgroundColor={0xffffff}  // White (if points are dark)
/>
```

### Enable Helpers by Default

```tsx
<PlyViewer
  plyUrl={plyUrl}
  pointSize={0.1}
  showHelpers={true}  // Helpers visible on load
/>
```

---

## Quick Diagnostic Checklist

Open browser console (F12) after loading PLY:

1. **Check vertex count:**
   - ✅ >100,000: Good dense point cloud
   - ⚠️ 10,000-100,000: Sparse, needs larger points
   - ❌ <10,000: Very sparse, may look noisy even with large points

2. **Check "Has colors":**
   - ✅ `true`: Using vertex colors from PLY
   - ⚠️ `false`: Using white (#ffffff)

3. **Check camera position:**
   - Should be non-zero (e.g., `[3, 1.5, 3]`)
   - If `[0, 0, 0]`, camera is inside the model

4. **Check point size:**
   - Current: 0.05
   - If too small, increase to 0.08-0.15

5. **Check scaled size:**
   - Should be around 2.0 units
   - If < 0.1, scaling issue

---

## What Changed

| Issue | Before | After |
|-------|--------|-------|
| Default point size | 0.03 | 0.05 |
| Unnecessary lighting | Had ambientLight | Removed (not needed) |
| Debug helpers | Static (reload to toggle) | Interactive toggle button |
| Debug info | No point size shown | Shows current point size |
| Console logging | Basic | Added material setup details |

---

## Component Props Reference

```typescript
<PlyViewer
  plyUrl={plyUrl}              // Required: blob URL
  pointSize={0.05}             // Optional: default 0.05
  showHelpers={false}          // Optional: show axes/grid on load
  backgroundColor={0x1a1a1a}   // Optional: hex color
/>
```

**Point Size Guidelines:**
- Dense clouds (>100k points): 0.03-0.06
- Normal clouds (50k-100k): 0.05-0.08
- Sparse clouds (<50k): 0.08-0.15
- Very sparse/noisy: 0.15-0.3

---

## Still Having Issues?

### Check These:

1. **PLY file quality:** Download the .ply and open in MeshLab/CloudCompare to verify it has visible points

2. **Browser console errors:** Look for WebGL errors or loading failures

3. **Camera clipping:** Points might be clipped - check near/far planes in console

4. **Color mismatch:** If PLY points are very dark and background is dark, try white background

5. **File size:** If PLY is very large (>200MB), it might take time to load and render

---

## Next Steps

1. Upload an image and let it process
2. Check console logs for all the debug output
3. Click "Show Helpers" to see if model is there
4. Check bottom-left for point count and size
5. If still too small, pass `pointSize={0.1}` or higher
6. Try different background colors if contrast is poor

The default 0.05 point size should work for most Gaussian splats. If not, the issue is likely:
- Very sparse PLY file (low point count)
- Extreme color/background contrast
- Camera positioning issue (check console logs)
