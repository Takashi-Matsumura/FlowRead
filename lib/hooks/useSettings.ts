'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppSettings, defaultSettings } from '../types/settings';
import { getSettings, saveSettings } from '../storage/settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = getSettings();
    setSettings(loaded);
    setIsLoaded(true);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const updateAISettings = useCallback((aiSettings: Partial<AppSettings['ai']>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        ai: { ...prev.ai, ...aiSettings },
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  return {
    settings,
    isLoaded,
    updateSettings,
    updateAISettings,
  };
}
