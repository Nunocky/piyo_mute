import { loadSettings, saveSettings } from "./settings";

const enabledEl = document.getElementById("enabled") as HTMLInputElement;
const mutedTagsEl = document.getElementById("mutedTags") as HTMLTextAreaElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;

function parseMutedTags(): string[] {
  return mutedTagsEl.value
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function saveFromForm(): Promise<void> {
  await saveSettings({
    enabled: enabledEl.checked,
    mutedTags: parseMutedTags(),
  });
}

async function init(): Promise<void> {
  const settings = await loadSettings();
  enabledEl.checked = settings.enabled;
  mutedTagsEl.value = settings.mutedTags.join("\n");
}

saveBtn.addEventListener("click", async () => {
  await saveFromForm();
});

enabledEl.addEventListener("change", async () => {
  await saveFromForm();
});

init();
