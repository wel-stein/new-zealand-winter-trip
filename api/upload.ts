import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false },
};

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('image/')) {
    return res.status(400).json({ error: 'Only image uploads are allowed' });
  }

  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > MAX_SIZE) {
    return res.status(413).json({ error: 'File too large (max 10 MB)' });
  }

  const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  const filename = `photos/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const blob = await put(filename, req, {
      access: 'public',
      contentType,
    });
    return res.status(200).json(blob);
  } catch (e: any) {
    console.error('Upload failed:', e);
    return res.status(500).json({ error: 'Upload failed. Is BLOB_READ_WRITE_TOKEN configured?' });
  }
}
