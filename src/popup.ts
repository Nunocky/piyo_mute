import { loadSettings, saveSettings } from "./settings";

const mutedTagsEl = document.getElementById("mutedTags") as HTMLTextAreaElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const statusEl = document.getElementById("status") as HTMLParagraphElement;

async function init(): Promise<void> {
  const settings = await loadSettings();
  mutedTagsEl.value = settings.mutedTags.join("\n");
}

saveBtn.addEventListener("click", async () => {
  const mutedTags = mutedTagsEl.value
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  await saveSettings({ mutedTags });

  statusEl.textContent = "保存しました";
  setTimeout(() => {
    statusEl.textContent = "";
  }, 2000);
});

init();
