export interface Settings {
  enabled: boolean;
  mutedTags: string[];
}

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  mutedTags: [],
};

export async function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
      resolve(result as Settings);
    });
  });
}

export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, resolve);
  });
}
