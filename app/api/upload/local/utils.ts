import { promises as fs } from 'fs';
import path from 'path';
import mainConfig from '@/config';

const EVENTS_IMAGE_DIR = path.join(process.cwd(), 'public', 'events', 'img');

// Ensure directory exists
export async function ensureDirectoryExists(): Promise<void> {
  try {
    await fs.access(EVENTS_IMAGE_DIR);
  } catch {
    await fs.mkdir(EVENTS_IMAGE_DIR, { recursive: true });
  }
}

// Check if URL is from local storage
export function isLocalStorageUrl(url: string): boolean {
  return url.startsWith('/events/img/') || url.includes('/events/img/');
}

// Extract filename from local storage URL
export function extractFilenameFromUrl(url: string): string | null {
  const match = url.match(/\/events\/img\/([^\/\?]+)/);
  return match ? match[1] : null;
}

// Calculate total size of all files in events/img directory
export async function calculateTotalStorageSize(): Promise<number> {
  try {
    await ensureDirectoryExists();
    const files = await fs.readdir(EVENTS_IMAGE_DIR);
    
    let totalSize = 0;
    for (const file of files) {
      const filePath = path.join(EVENTS_IMAGE_DIR, file);
      try {
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
        }
      } catch (error) {
        console.warn(`Failed to get stats for ${file}:`, error);
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Failed to calculate storage size:', error);
    return 0;
  }
}

// Check if there's enough space for a new file
export async function hasEnoughSpace(fileSize: number): Promise<{ hasSpace: boolean; currentSize: number; maxSize: number; remaining: number }> {
  const currentSize = await calculateTotalStorageSize();
  const maxSize = mainConfig.maxStorageSize;
  const remaining = maxSize - currentSize;
  const hasSpace = remaining >= fileSize;
  
  return {
    hasSpace,
    currentSize,
    maxSize,
    remaining,
  };
}

// Delete file from local storage
export async function deleteLocalFile(filename: string): Promise<boolean> {
  try {
    const filePath = path.join(EVENTS_IMAGE_DIR, filename);
    await fs.unlink(filePath);
    console.log(`Successfully deleted local file: ${filename}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete local file ${filename}:`, error);
    return false;
  }
}

// Delete file from local storage by URL
export async function deleteLocalFileByUrl(url: string): Promise<boolean> {
  const filename = extractFilenameFromUrl(url);
  if (!filename) {
    return false;
  }
  return deleteLocalFile(filename);
}

