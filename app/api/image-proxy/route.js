export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new Response('Image URL is required', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new Response('Failed to fetch image', { status: 500 });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Optional caching
      },
    });
  } catch (error) {
    return new Response('Error fetching image', { status: 500 });
  }
}
