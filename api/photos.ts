import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list({ prefix: 'photos/' });
    const photos = blobs.map((b) => ({
      url: b.url,
      pathname: b.pathname,
      uploadedAt: b.uploadedAt,
      size: b.size,
    }));
    photos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return res.status(200).json({ photos });
  } catch (e: any) {
    console.error('List failed:', e);
    return res.status(500).json({ error: `Failed to list photos: ${e.message || 'Unknown error'}` });
  }
}
