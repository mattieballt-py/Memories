import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    // Check usage limit before processing
    const usageCheck = await fetch(new URL('/api/usage', request.url), {
      method: 'POST',
    });

    if (!usageCheck.ok) {
      const errorData = await usageCheck.json();
      return NextResponse.json(
        { error: errorData.message || 'Usage limit reached' },
        { status: 429 }
      );
    }

    // Get uploaded image from frontend
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // Prepare formData for Modal backend
    const modalFormData = new FormData();
    modalFormData.append('file', file);
    // Optional: add focal length if needed
    // modalFormData.append('f_px', '1000');

    // Get Modal endpoint URL from environment variable (should include /predict/ply)
    const modalApiUrl =
      process.env.NEXT_PUBLIC_SPLAT_API_URL ||
      'https://mattieballt-py--sharp-api-fastapi-app.modal.run/predict/ply';

    console.log('Calling Modal API:', modalApiUrl);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Call Modal backend with the image file
    const modalResponse = await fetch(modalApiUrl, {
      method: 'POST',
      body: modalFormData,
    });

    if (!modalResponse.ok) {
      const errorText = await modalResponse.text();
      console.error('Modal API error:', errorText);
      return NextResponse.json(
        { error: `Backend processing failed: ${modalResponse.statusText}` },
        { status: modalResponse.status }
      );
    }

    // Modal returns binary PLY file data, not JSON
    const plyBlob = await modalResponse.blob();

    console.log('Received PLY file:', {
      size: plyBlob.size,
      type: plyBlob.type,
    });

    // Upload PLY to Vercel Blob for public access
    // This is necessary because the Gaussian splat viewer only accepts HTTP URLs
    const buffer = Buffer.from(await plyBlob.arrayBuffer());
    const blobResult = await put(`splats/splat-${Date.now()}.ply`, buffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log('Uploaded PLY to Vercel Blob:', blobResult.url);

    // Return the public URL as JSON
    return NextResponse.json({
      ply_url: blobResult.url,
      size: plyBlob.size,
    });
  } catch (error) {
    console.error('Splat processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
