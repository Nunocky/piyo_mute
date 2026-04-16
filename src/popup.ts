import { loadSettings, saveSettings } from "./settings";

const mutedUsersEl = document.getElementById(
  "mutedUsers"
) as HTMLTextAreaElement;
const mutedTagsEl = document.getElementById("mutedTags") as HTMLTextAreaElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const statusEl = document.getElementById("status") as HTMLParagraphElement;

// タブ切り替え
document.querySelectorAll<HTMLButtonElement>(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    const panelId = `panel-${tab.dataset.tab}`;
    document.getElementById(panelId)?.classList.add("active");
  });
});

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
