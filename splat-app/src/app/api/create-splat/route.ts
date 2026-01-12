import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Get uploaded image from frontend
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // 2. Upload image to temporary storage (Vercel Blob)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Vercel Blob (free tier works)
    const blob = await put(`splat-${Date.now()}.jpg`, buffer, {
      access: 'public',
    });
    
    const imageUrl = `https://blob.vercel-storage.com/${blob.path}`;

    // 3. Call Modal GPU function (replace with YOUR Modal function name)
    const modalResponse = await fetch('https://your-modal-app--create-splat-modal.modal.run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    const { splat_url } = await modalResponse.json();
    
    return NextResponse.json({ splatUrl: splat_url });
    
  } catch (error) {
    console.error('Splat error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
