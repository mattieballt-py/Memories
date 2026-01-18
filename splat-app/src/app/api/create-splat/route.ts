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

    // Return the PLY file as a blob to the frontend
    return new NextResponse(plyBlob, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="output.ply"',
      },
    });
  } catch (error) {
    console.error('Splat processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
