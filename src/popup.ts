import { loadSettings, saveSettings } from "./settings";

const mutedUsersEl = document.getElementById(
  "mutedUsers"
) as HTMLTextAreaElement;
const mutedTagsEl = document.getElementById("mutedTags") as HTMLTextAreaElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const statusEl = document.getElementById("status") as HTMLParagraphElement;

async function init(): Promise<void> {
  const settings = await loadSettings();
  mutedUsersEl.value = settings.mutedUsers.join("\n");
  mutedTagsEl.value = settings.mutedTags.join("\n");
}

saveBtn.addEventListener("click", async () => {
  const mutedUsers = mutedUsersEl.value
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const mutedTags = mutedTagsEl.value
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  await saveSettings({ mutedUsers, mutedTags });

  statusEl.textContent = "保存しました";
  setTimeout(() => {
    statusEl.textContent = "";
  }, 2000);
});

init();
