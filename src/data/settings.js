const SETTINGS_STORAGE_KEY = 'fw_settings_v1';

const defaultSettings = {
  heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1600'
};

export const getSettings = () => {
  const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (data) return JSON.parse(data);
  
  // Initialize with defaults if empty
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
  return defaultSettings;
};

export const updateSettings = (newSettings) => {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
