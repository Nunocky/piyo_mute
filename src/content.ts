import { loadSettings, Settings } from "./settings";

async function applyFilters(): Promise<void> {
  const settings = await loadSettings();
  filterPosts(settings);
}

function filterPosts(settings: Settings): void {
  if (settings.mutedTags.length === 0) {
    return;
  }
  const posts = document.querySelectorAll<HTMLElement>('[class*="Entry_entry__"]');
  posts.forEach((post) => {
    if (shouldMute(post, settings)) {
      post.style.display = "none";
    }
  });
}

function shouldMute(post: HTMLElement, settings: Settings): boolean {
  // タグチェック（テキストは "#タグ名" 形式なので先頭の # を除去して比較）
  const tagEls = Array.from(post.querySelectorAll<HTMLElement>('[class*="Entry_tag__"] a'));
  for (const tagEl of tagEls) {
    const tag = (tagEl.textContent?.trim() ?? "").replace(/^#/, "");
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

// 設定変更を監視してリアルタイムで反映
chrome.storage.onChanged.addListener(
  (_changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
    if (areaName === "sync") {
      // 設定が変更されたら、非表示を解除してから再適用
      const posts = document.querySelectorAll<HTMLElement>('[class*="Entry_entry__"]');
      posts.forEach((post) => {
        post.style.display = "";
      });
      applyFilters();
    }
  }
);
