# PLY Viewer Improvements - Complete Guide

## What Was Fixed

### Original Problems
1. **Tiny noisy blob** - Point size was 0.01, way too small for Gaussian splats
2. **Poor camera positioning** - Fixed at (0,0,5) regardless of model size
3. **Bad scaling logic** - Scaling before centering caused issues
4. **No sphere-based positioning** - Used box dimensions instead of radius
5. **Poor orbit controls** - Limited rotation and zoom ranges

### Solutions Implemented

#### 1. Improved Point Size (Lines 116-123)
```typescript
const material = new THREE.PointsMaterial({
  size: pointSize,  // Default 0.03 (3x larger than before)
  vertexColors: !!geometry.attributes.color,
  sizeAttenuation: true,
  transparent: false,
  opacity: 1.0,
  fog: false,
});
```

#### 2. Proper Geometry Processing (Lines 78-107)
```typescript
// CORRECT ORDER:
// 1. Compute bounding box FIRST
geometry.computeBoundingBox();

// 2. Calculate center and size
const center = boundingBox.getCenter();
const size = boundingBox.getSize();

// 3. Calculate bounding sphere radius
const boundingSphereRadius = Math.max(size.x, size.y, size.z) / 2;

// 4. Center at origin
geometry.translate(-center.x, -center.y, -center.z);

// 5. Scale uniformly
const scaleFactor = targetSize / maxDim;
geometry.scale(scaleFactor, scaleFactor, scaleFactor);
```

#### 3. Smart Camera Positioning (Lines 137-156)
```typescript
// Camera distance based on bounding sphere
const scaledRadius = boundingSphereRadius * scaleFactor;
const cameraDistance = scaledRadius * 3;  // 3x for good view

camera.position.set(
  cameraDistance,
  cameraDistance * 0.5,  // Slightly elevated
  cameraDistance
);

// Dynamic clipping planes
camera.near = scaledRadius * 0.01;
camera.far = scaledRadius * 100;
```

#### 4. Better Orbit Controls (Lines 47-53)
```typescript
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true;  // Allow screen-space pan
controls.minDistance = 0.1;  // Get very close
controls.maxDistance = 500;  // Zoom far out
controls.maxPolarAngle = Math.PI;  // Full rotation
```

#### 5. Debug Information (Lines 165-170, 258-260)
- Console logs: bounding box, transformations, camera setup
- On-screen debug overlay: point count, original size, scaled size
- Optional axes/grid helpers for debugging

---

## New Features & Props

### PlyViewer Component Props

```typescript
<PlyViewer
  plyUrl={plyUrl}              // Required: blob URL or HTTP URL
  pointSize={0.03}             // Optional: point size (default 0.03)
  showHelpers={false}          // Optional: show axes/grid (default false)
  backgroundColor={0x1a1a1a}   // Optional: hex color (default dark gray)
/>
```

### Example Usage

#### Basic (current default)
```tsx
<PlyViewer plyUrl={plyUrl} />
```

#### With custom point size
```tsx
<PlyViewer plyUrl={plyUrl} pointSize={0.05} />
```

#### Debug mode with helpers
```tsx
<PlyViewer
  plyUrl={plyUrl}
  pointSize={0.04}
  showHelpers={true}
  backgroundColor={0x000000}
/>
```

---

## Tweaking Guide

If your model still doesn't look right, adjust these values:

### 1. Point Size Too Small/Large

**File:** `src/app/components/PlyViewer.tsx` (Line 16)

```typescript
pointSize = 0.03,  // ← Adjust this default
```

Or pass as prop:
```tsx
<PlyViewer plyUrl={plyUrl} pointSize={0.05} />
```

**Values to try:**
- Dense point clouds: 0.01 - 0.02
- Normal splats: 0.03 - 0.05 ⭐ (default)
- Sparse/noisy: 0.05 - 0.1

### 2. Camera Too Close/Far

**File:** `src/app/components/PlyViewer.tsx` (Line 140)

```typescript
const cameraDistance = scaledRadius * 3;  // ← Change multiplier
```

**Values to try:**
- Closer view: `* 2` or `* 2.5`
- Default view: `* 3` ⭐
- Wider view: `* 4` or `* 5`

### 3. Model Appears Clipped

**File:** `src/app/components/PlyViewer.tsx` (Lines 154-155)

```typescript
camera.near = scaledRadius * 0.01;  // ← Make smaller if clipping near
camera.far = scaledRadius * 100;    // ← Make larger if clipping far
```

### 4. Background Color

**File:** `src/app/components/PlyViewer.tsx` (Line 18)

```typescript
backgroundColor = 0x1a1a1a,  // Dark gray (default)
```

**Common values:**
- Black: `0x000000`
- Dark gray: `0x1a1a1a` ⭐ (default)
- Light gray: `0x808080`
- White: `0xffffff`

Or pass as prop:
```tsx
<PlyViewer plyUrl={plyUrl} backgroundColor={0x000000} />
```

### 5. Target Scale Size

**File:** `src/app/components/PlyViewer.tsx` (Line 105)

```typescript
const targetSize = 2.0;  // ← Final size in world units
```

**Values to try:**
- Smaller model: `1.0` or `1.5`
- Default: `2.0` ⭐
- Larger model: `3.0` or `4.0`

---

## Debugging Tools

### Console Logs

Open browser console (F12) to see:

```
PLY loaded successfully
Vertex count: 523,441
Has colors: true
Bounding box: {
  min: [-1.5, -2.1, -0.8],
  max: [1.5, 2.1, 0.8],
  center: [0, 0, 0],
  size: [3.0, 4.2, 1.6],
  boundingSphereRadius: 2.1
}
Applied transformations: {
  translation: [0, 0, 0],
  scale: 0.476,
  finalSize: 2.0
}
Camera setup: {
  position: [3.0, 1.5, 3.0],
  distance: 3.0,
  near: 0.01,
  far: 100
}
```

### On-Screen Debug Info

Bottom-left overlay shows:
```
Points: 523,441 | Size: 3.00×4.20×1.60 | Scaled: 2.00 units
```

### Enable Axes & Grid Helpers

```tsx
<PlyViewer plyUrl={plyUrl} showHelpers={true} />
```

This adds:
- **Red/Green/Blue axes** at origin (X/Y/Z)
- **Grid** on ground plane
- Helps visualize model orientation

---

## Testing Instructions

### 1. Start Dev Server
```bash
cd splat-app
npm run dev
```

### 2. Open App
Navigate to: http://localhost:3000

### 3. Upload Test Image
- Click "Choose File"
- Select any image
- Wait 30-60 seconds for processing

### 4. Test Controls

**Rotation:**
- Left-click and drag → Orbit around model
- Should rotate smoothly in all directions

**Pan:**
- Right-click and drag → Pan camera
- Or Middle-mouse drag

**Zoom:**
- Scroll wheel → Zoom in/out
- Should zoom smoothly without clipping

### 5. Expected Behavior

✅ **Good signs:**
- Model is clearly visible and recognizable
- Point cloud is dense (not sparse/noisy)
- Can orbit 360° around model
- Zooming in/out works smoothly
- Debug info shows point count at bottom

❌ **Bad signs (and fixes):**
- **Still too small:** Increase `pointSize` prop
- **Too sparse/noisy:** Check PLY file quality, try larger `pointSize`
- **Clipped when zooming:** Adjust `camera.near`/`camera.far` ratios
- **Can't see anything:** Enable `showHelpers={true}` to check if model is there

### 6. Check Console

Press F12 and look for:
- Bounding box info
- Vertex count (should be 100k+)
- Camera position

If vertex count is low (<10k), your PLY file might be the issue, not the viewer.

---

## Advanced Customization

### Example: Dense Point Cloud with Black Background

```tsx
<PlyViewer
  plyUrl={plyUrl}
  pointSize={0.02}
  backgroundColor={0x000000}
/>
```

### Example: Sparse Splat with Debug Mode

```tsx
<PlyViewer
  plyUrl={plyUrl}
  pointSize={0.08}
  showHelpers={true}
  backgroundColor={0x1a1a1a}
/>
```

### Example: Custom Styling

Edit `src/app/components/PlyViewer.tsx` (Line 233):
```tsx
<div className="relative w-full h-[800px] ...">  {/* ← Change height */}
```

---

## Quick Reference: What Changed

| Issue | Old Value | New Value | Line |
|-------|-----------|-----------|------|
| Point size | 0.01 | 0.03 (default, customizable) | 16 |
| Camera FOV | 75 | 60 | 34 |
| Camera position | Fixed (0,0,5) | Dynamic (based on model) | 142-146 |
| Near plane | 0.1 | Dynamic (radius * 0.01) | 154 |
| Far plane | 1000 | Dynamic (radius * 100) | 155 |
| Min zoom | 1 | 0.1 | 51 |
| Max zoom | 100 | 500 | 52 |
| Pan mode | false | true (screen-space) | 50 |
| Default color | 0x00aaff | 0xffffff (white) | 127 |

---

## Files Modified

1. **`src/app/components/PlyViewer.tsx`** - Complete rewrite with:
   - Proper bounding box/sphere calculations
   - Dynamic camera positioning
   - Larger default point size
   - Optional debugging props
   - Console logging
   - On-screen debug overlay

2. **No changes needed to:**
   - `src/app/page.tsx` - Already using PlyViewer correctly
   - `src/app/api/create-splat/route.ts` - API working correctly

---

## Troubleshooting

### Problem: Model still looks like a tiny blob

**Diagnosis:** Point size too small for your camera distance

**Fix:** Increase point size:
```tsx
<PlyViewer plyUrl={plyUrl} pointSize={0.05} />
```

### Problem: Model disappears when zooming

**Diagnosis:** Camera clipping planes too tight

**Fix:** Edit lines 154-155 to use larger multipliers:
```typescript
camera.near = scaledRadius * 0.001;  // Even smaller near
camera.far = scaledRadius * 200;     // Larger far
```

### Problem: Colors look wrong

**Diagnosis:** PLY file might not have color attributes, or colors are incorrectly formatted

**Fix:** Check console for "Has colors: true/false". If false, the PLY has no vertex colors.

### Problem: Can't orbit properly

**Diagnosis:** Controls might be broken

**Fix:** Already fixed with better OrbitControls setup. If still issues, check console for errors.

---

## Next Steps

1. **Test with your actual PLY file** - Upload an image and verify results
2. **Adjust point size** if needed - Start with default (0.03)
3. **Enable debug mode** if troubleshooting - Set `showHelpers={true}`
4. **Check console logs** - Verify bounding box and camera position are reasonable
5. **Tweak values** - Use this guide to adjust settings

The viewer now properly handles Gaussian splats with automatic scaling, good camera positioning, and smooth controls!
