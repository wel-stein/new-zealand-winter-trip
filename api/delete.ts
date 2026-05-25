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
    await del(url);
    return res.status(200).json({ success: true });
  } catch (e: any) {
    console.error('Delete failed:', e);
    return res.status(500).json({ error: 'Delete failed' });
  }
}
