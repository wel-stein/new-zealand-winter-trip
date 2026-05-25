import type { VercelRequest, VercelResponse } from '@vercel/node';
import { del } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = req.query.url as string;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith('/photos/') && !parsed.pathname.startsWith('/thumbs/')) {
      return res.status(403).json({ error: 'Cannot delete files outside photos/thumbs' });
    }

    const thumbUrl = url.replace('/photos/', '/thumbs/');
    await Promise.all([del(url), del(thumbUrl).catch(() => {})]);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    console.error('Delete failed:', e);
    return res.status(500).json({ error: 'Delete failed' });
  }
}
