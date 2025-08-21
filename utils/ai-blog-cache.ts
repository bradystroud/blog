import fs from 'fs';
import path from 'path';
import { AIBlogResponse } from '../types/ai-blog';

const CACHE_DIR = path.join(process.cwd(), '.ai-blog-cache');
const CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours

interface CacheEntry {
  content: string;
  generated: boolean;
  fallback: boolean;
  timestamp: string;
  expiresAt: number;
}

// Ensure cache directory exists
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// Generate cache key from title
function getCacheKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Get cache file path
function getCacheFilePath(title: string): string {
  const key = getCacheKey(title);
  return path.join(CACHE_DIR, `${key}.json`);
}

// Check if cache entry is expired
function isExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}

// Get cached content
export function getCachedContent(title: string): AIBlogResponse | null {
  try {
    ensureCacheDir();
    const filePath = getCacheFilePath(title);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const cacheEntry: CacheEntry = JSON.parse(fileContent);
    
    // Check if cache is expired
    if (isExpired(cacheEntry.expiresAt)) {
      // Delete expired cache file
      fs.unlinkSync(filePath);
      return null;
    }

    return {
      content: cacheEntry.content,
      generated: cacheEntry.generated,
      fallback: cacheEntry.fallback,
      timestamp: cacheEntry.timestamp,
    };
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

// Cache content
export function setCachedContent(title: string, response: AIBlogResponse): void {
  try {
    ensureCacheDir();
    const filePath = getCacheFilePath(title);
    
    const cacheEntry: CacheEntry = {
      content: response.content,
      generated: response.generated,
      fallback: response.fallback,
      timestamp: response.timestamp,
      expiresAt: Date.now() + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000),
    };

    fs.writeFileSync(filePath, JSON.stringify(cacheEntry, null, 2));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

// Clear all cached content (utility function)
export function clearAllCache(): void {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      for (const file of files) {
        if (file.endsWith('.json')) {
          fs.unlinkSync(path.join(CACHE_DIR, file));
        }
      }
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Clear expired cache entries (utility function)
export function clearExpiredCache(): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      return;
    }

    const files = fs.readdirSync(CACHE_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(CACHE_DIR, file);
        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const cacheEntry: CacheEntry = JSON.parse(fileContent);
          
          if (isExpired(cacheEntry.expiresAt)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          // If we can't parse the file, delete it
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
}
