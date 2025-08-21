import { NextApiRequest, NextApiResponse } from 'next';
import { clearAllCache, clearExpiredCache } from '../../utils/ai-blog-cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  try {
    switch (action) {
      case 'clear-all':
        clearAllCache();
        return res.status(200).json({ message: 'All cache cleared successfully' });
      
      case 'clear-expired':
        clearExpiredCache();
        return res.status(200).json({ message: 'Expired cache cleared successfully' });
      
      default:
        return res.status(400).json({ error: 'Invalid action. Use "clear-all" or "clear-expired"' });
    }
  } catch (error) {
    console.error('Error managing cache:', error);
    return res.status(500).json({ 
      error: 'Failed to manage cache',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
