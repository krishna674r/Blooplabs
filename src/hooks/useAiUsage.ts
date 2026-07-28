import { useState, useEffect } from 'react';

const DAILY_LIMIT = 10;
const STORAGE_KEY = 'blooplabs-ai-usage';

interface UsageData {
  count: number;
  lastResetDate: string; // ISO date string without time
}

export function useAiUsage() {
  const [usageData, setUsageData] = useState<UsageData | null>(null);

  // Initialize and check limits on mount
  useEffect(() => {
    checkAndResetUsage();
  }, []);

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const checkAndResetUsage = () => {
    const today = getTodayDateString();
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const parsed: UsageData = JSON.parse(stored);
        if (parsed.lastResetDate !== today) {
          // Reset at midnight (new day)
          const newData = { count: 0, lastResetDate: today };
          setUsageData(newData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } else {
          setUsageData(parsed);
        }
      } catch (e) {
        // Fallback
        const newData = { count: 0, lastResetDate: today };
        setUsageData(newData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      }
    } else {
      // First time
      const newData = { count: 0, lastResetDate: today };
      setUsageData(newData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }
  };

  const incrementUsage = (): boolean => {
    checkAndResetUsage();
    
    // Check latest state from localStorage to be safe
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    
    const parsed: UsageData = JSON.parse(stored);
    
    if (parsed.count >= DAILY_LIMIT) {
      return false; // Limit reached
    }
    
    const newData = { ...parsed, count: parsed.count + 1 };
    setUsageData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return true;
  };

  const hasRemainingUsage = () => {
    if (!usageData) return true; // Assume true while loading
    return usageData.count < DAILY_LIMIT;
  };
  
  const remainingCount = usageData ? Math.max(0, DAILY_LIMIT - usageData.count) : DAILY_LIMIT;

  return {
    usageData,
    incrementUsage,
    hasRemainingUsage,
    remainingCount,
    limit: DAILY_LIMIT
  };
}
