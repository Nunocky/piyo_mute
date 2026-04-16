import { loadSettings, Settings } from "./settings";

async function applyFilters(): Promise<void> {
  const settings = await loadSettings();
  filterPosts(settings);
}

function filterPosts(settings: Settings): void {
  if (settings.mutedUsers.length === 0 && settings.mutedTags.length === 0) {
    return;
  }
  // TODO: ページの DOM 構造に合わせてセレクタを調整する
  const posts = document.querySelectorAll<HTMLElement>(".entry, .diary-entry");
  posts.forEach((post) => {
    if (shouldMute(post, settings)) {
      post.style.display = "none";
    }
  });
}

function shouldMute(post: HTMLElement, settings: Settings): boolean {
  // ユーザー名チェック
  const userEl = post.querySelector<HTMLElement>(".username, .author");
  if (userEl) {
    const username = userEl.textContent?.trim() ?? "";
    if (settings.mutedUsers.includes(username)) {
      return true;
    }
  }

  // タグチェック
  const tagEls = post.querySelectorAll<HTMLElement>(".tag");
  for (const tagEl of tagEls) {
    const tag = tagEl.textContent?.trim() ?? "";
    if (settings.mutedTags.includes(tag)) {
      return true;
    }
  }

  return false;
}

// 初回実行
applyFilters();

// 動的に読み込まれるコンテンツにも対応
const observer = new MutationObserver(() => {
  applyFilters();
});
observer.observe(document.body, { childList: true, subtree: true });
