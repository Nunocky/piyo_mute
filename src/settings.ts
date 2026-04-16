export interface Settings {
  mutedUsers: string[];
  mutedTags: string[];
}

const DEFAULT_SETTINGS: Settings = {
  mutedUsers: [],
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
