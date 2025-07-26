export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new Response('Image URL is required', { status: 400 });
  }

  try {
    let fullUrl;
    
    // Handle Google Drive URLs
    if (imageUrl.includes('drive.google.com')) {
      fullUrl = imageUrl;
    }
    // Handle local file paths
    else if (imageUrl.startsWith('/uploads/')) {
      fullUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${imageUrl}`;
    }
    // Handle external URLs (Google OAuth profile pics, etc.)
    else if (imageUrl.startsWith('http')) {
      fullUrl = imageUrl;
    }
    else {
      return new Response('Invalid image URL format', { status: 400 });
    }

    const response = await fetch(fullUrl);

    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      return new Response('Failed to fetch image', { status: 500 });
    }

    const contentType = response.headers.get('content-type');
    
    // Validate that it's actually an image
    if (!contentType || !contentType.startsWith('image/')) {
      console.error('Invalid content type:', contentType);
      return new Response('Invalid image content type', { status: 400 });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new Response('Error fetching image', { status: 500 });
  }
}
