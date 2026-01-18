import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get uploaded image from frontend
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // Prepare formData for Modal backend
    const modalFormData = new FormData();
    modalFormData.append('file', file);

    // Get Modal endpoint URL from environment variable
    const modalApiUrl =
      process.env.NEXT_PUBLIC_SPLAT_API_URL ||
      'https://modal.com/apps/mattieballt-py/main/deployed/sharp-api';

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

    const data = await modalResponse.json();

    // Modal returns { "ply_url": "https://..." }
    if (!data.ply_url) {
      console.error('Invalid response from Modal:', data);
      return NextResponse.json(
        { error: 'Invalid response from backend' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ply_url: data.ply_url });
  } catch (error) {
    console.error('Splat processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
