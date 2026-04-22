import { loadSettings, Settings } from "./settings";

let latestApplyRequestId = 0;

function isContextInvalidatedError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes("Extension context invalidated")
  );
}

function runApplyFiltersSafely(): void {
  void applyFilters().catch((error) => {
    if (!isContextInvalidatedError(error)) {
      console.error("Failed to apply mute filters", error);
    }
  });
}

function resetVisibility(): void {
  const posts = document.querySelectorAll<HTMLElement>(
    '[class*="Entry_entry__"]',
  );
  posts.forEach((post) => {
    post.style.display = "";
  });

  const trendLinks = document.querySelectorAll<HTMLAnchorElement>(
    '[class*="Footer_tags__"] a',
  );
  trendLinks.forEach((a) => {
    a.style.display = "";
  });
}

async function applyFilters(): Promise<void> {
  const requestId = ++latestApplyRequestId;
  const settings = await loadSettings();
  if (requestId !== latestApplyRequestId) {
    return;
  }
  resetVisibility();
  if (!settings.enabled) {
    return;
  }
  filterPosts(settings);
  filterTrends(settings);
}

function filterPosts(settings: Settings): void {
  if (settings.mutedTags.length === 0) {
    return;
  }
  const posts = document.querySelectorAll<HTMLElement>(
    '[class*="Entry_entry__"]',
  );
  posts.forEach((post) => {
    if (shouldMute(post, settings)) {
      post.style.display = "none";
    }
  });
}

function filterTrends(settings: Settings): void {
  const tagLinks = document.querySelectorAll<HTMLAnchorElement>(
    '[class*="Footer_tags__"] a',
  );
  tagLinks.forEach((a) => {
    const tag = (a.textContent?.trim() ?? "").replace(/^#/, "");
    a.style.display = settings.mutedTags.includes(tag) ? "none" : "";
  });
}

function shouldMute(post: HTMLElement, settings: Settings): boolean {
  // タグチェック（テキストは "#タグ名" 形式なので先頭の # を除去して比較）
  const tagEls = Array.from(
    post.querySelectorAll<HTMLElement>('[class*="Entry_tag__"] a'),
  );
  for (const tagEl of tagEls) {
    const tag = (tagEl.textContent?.trim() ?? "").replace(/^#/, "");
    if (settings.mutedTags.includes(tag)) {
      return true;
    }
  }

  return false;
}

// 初回実行
runApplyFiltersSafely();

// 動的に読み込まれるコンテンツにも対応
const observer = new MutationObserver(() => {
  runApplyFiltersSafely();
});
observer.observe(document.body, { childList: true, subtree: true });

// 設定変更を監視してリアルタイムで反映
chrome.storage.onChanged.addListener(
  (
    _changes: Record<string, chrome.storage.StorageChange>,
    areaName: string,
  ) => {
    if (areaName === "sync") {
      runApplyFiltersSafely();
    }
  },
);
