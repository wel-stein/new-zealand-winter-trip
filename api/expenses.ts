import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  }
  return createClient(url, key);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ expenses: data });
  }

  if (req.method === 'POST') {
    const { amount, category, description, expense_date } = req.body;
    if (!amount || !category) {
      return res.status(400).json({ error: 'amount and category are required' });
    }
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        amount: parseFloat(amount),
        category,
        description: description || '',
        expense_date: expense_date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ expense: data });
  }

  if (req.method === 'DELETE') {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: 'Missing id parameter' });
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
