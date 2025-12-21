import { useState, useEffect, useCallback } from 'react';

type StorageUnit = 'GB' | 'MB' | 'KB' | 'B';

type StorageStatusData = {
  useLocalStorage: boolean;
  currentSize: number;
  maxSize: number;
  remaining: number;
  usagePercent: number;
  // Formatted in GB
  currentSizeGB: number;
  maxSizeGB: number;
  remainingGB: number;
  // Formatted in MB
  currentSizeMB: number;
  maxSizeMB: number;
  remainingMB: number;
  // Formatted in KB
  currentSizeKB: number;
  maxSizeKB: number;
  remainingKB: number;
};

type UseStorageStatusReturn = {
  isLoading: boolean;
  error: Error | null;
  data: StorageStatusData | null;
  // Helper functions to format size
  formatSize: (bytes: number, unit?: StorageUnit) => string;
  getFormattedCurrentSize: (unit?: StorageUnit) => string;
  getFormattedMaxSize: (unit?: StorageUnit) => string;
  getFormattedRemaining: (unit?: StorageUnit) => string;
  // Auto-format (chooses best unit)
  getAutoFormattedCurrentSize: () => string;
  getAutoFormattedMaxSize: () => string;
  getAutoFormattedRemaining: () => string;
  // Google Drive status (only relevant if not using local storage)
  googleDriveConnected: boolean | null;
  refresh: () => Promise<void>;
};

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * 1024;
const BYTES_PER_GB = 1024 * 1024 * 1024;

function formatBytes(bytes: number, unit?: StorageUnit): string {
  if (unit === 'GB') {
    return `${(bytes / BYTES_PER_GB).toFixed(2)} GB`;
  }
  if (unit === 'MB') {
    return `${(bytes / BYTES_PER_MB).toFixed(2)} MB`;
  }
  if (unit === 'KB') {
    return `${(bytes / BYTES_PER_KB).toFixed(2)} KB`;
  }
  if (unit === 'B') {
    return `${bytes} B`;
  }
  
  // Auto-format: choose best unit
  if (bytes >= BYTES_PER_GB) {
    return `${(bytes / BYTES_PER_GB).toFixed(2)} GB`;
  }
  if (bytes >= BYTES_PER_MB) {
    return `${(bytes / BYTES_PER_MB).toFixed(2)} MB`;
  }
  if (bytes >= BYTES_PER_KB) {
    return `${(bytes / BYTES_PER_KB).toFixed(2)} KB`;
  }
  return `${bytes} B`;
}

export function useStorageStatus(): UseStorageStatusReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<StorageStatusData | null>(null);
  const [googleDriveConnected, setGoogleDriveConnected] = useState<boolean | null>(null);

  const fetchStorageStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/upload/storage-status');
      if (!response.ok) {
        throw new Error('Failed to fetch storage status');
      }

      const apiData = await response.json();
      
      const storageData: StorageStatusData = {
        useLocalStorage: apiData.useLocalStorage || false,
        currentSize: apiData.currentSize || 0,
        maxSize: apiData.maxSize || 0,
        remaining: apiData.remaining || 0,
        usagePercent: apiData.usagePercent || 0,
        currentSizeGB: apiData.currentSizeGB || 0,
        maxSizeGB: apiData.maxSizeGB || 0,
        remainingGB: apiData.remainingGB || 0,
        currentSizeMB: apiData.currentSizeMB || 0,
        maxSizeMB: apiData.maxSizeMB || 0,
        remainingMB: apiData.remainingMB || 0,
        currentSizeKB: (apiData.currentSize || 0) / BYTES_PER_KB,
        maxSizeKB: (apiData.maxSize || 0) / BYTES_PER_KB,
        remainingKB: (apiData.remaining || 0) / BYTES_PER_KB,
      };

      setData(storageData);

      // Only check Google Drive status if not using local storage
      if (!storageData.useLocalStorage) {
        try {
          const gdriveResponse = await fetch('/api/upload/gdrive/status');
          if (gdriveResponse.ok) {
            const gdriveData = await gdriveResponse.json();
            setGoogleDriveConnected(gdriveData.connected || false);
          } else {
            setGoogleDriveConnected(false);
          }
        } catch (gdriveError) {
          console.error('Failed to check Google Drive status:', gdriveError);
          setGoogleDriveConnected(false);
        }
      } else {
        setGoogleDriveConnected(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Failed to fetch storage status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStorageStatus();
  }, [fetchStorageStatus]);

  const formatSize = (bytes: number, unit?: StorageUnit): string => {
    return formatBytes(bytes, unit);
  };

  const getFormattedCurrentSize = (unit?: StorageUnit): string => {
    if (!data) return '0 B';
    return formatBytes(data.currentSize, unit);
  };

  const getFormattedMaxSize = (unit?: StorageUnit): string => {
    if (!data) return '0 B';
    return formatBytes(data.maxSize, unit);
  };

  const getFormattedRemaining = (unit?: StorageUnit): string => {
    if (!data) return '0 B';
    return formatBytes(data.remaining, unit);
  };

  const getAutoFormattedCurrentSize = (): string => {
    if (!data) return '0 B';
    return formatBytes(data.currentSize);
  };

  const getAutoFormattedMaxSize = (): string => {
    if (!data) return '0 B';
    return formatBytes(data.maxSize);
  };

  const getAutoFormattedRemaining = (): string => {
    if (!data) return '0 B';
    return formatBytes(data.remaining);
  };

  return {
    isLoading,
    error,
    data,
    formatSize,
    getFormattedCurrentSize,
    getFormattedMaxSize,
    getFormattedRemaining,
    getAutoFormattedCurrentSize,
    getAutoFormattedMaxSize,
    getAutoFormattedRemaining,
    googleDriveConnected,
    refresh: fetchStorageStatus,
  };
}

