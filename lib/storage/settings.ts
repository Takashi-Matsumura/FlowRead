import { AppSettings, defaultSettings } from '../types/settings';

const STORAGE_KEY = 'flowread_settings';

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }

  return defaultSettings;
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
