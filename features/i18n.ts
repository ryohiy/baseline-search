import { getLanguage, Language } from './language-config.js';

interface TextDefinitions {
  // メインメニュー
  mainTitle: string;
  mainSubtitle: string;
  mainMenuQuestion: string;
  mainMenuFreeSearch: string;
  mainMenuBaselineTarget: string;
  mainMenuRecentBaseline: string;
  mainMenuExit: string;
  mainMenuNavigation: string;

  // 検索画面
  searchTitle: string;
  searchKeyword: string;
  searchResults: string;
  searchNoResults: string;
  searchPageInfo: string;
  searchInstructions: string;
  searchInstructionsSearch: string;
  searchInstructionsNoPage: string;
  searchTryOtherKeywords: string;
  searchClearHint: string;

  // Baseline Target画面
  baselineYearSelection: string;
  baselineFeatureList: string;
  baselineYearNavigationInstructions: string;
  baselineFeatureNavigationInstructions: string;
  baselineAvailableYears: string;
  baselineYearCount: string;
  baselineScrollInstructions: string;
  baselineFeatureCount: string;

  // Recent Baseline画面
  recentBaselineTitle: string;
  recentBaselineNavigationInstructions: string;
  recentWidelyAvailable: string;
  recentNewlyAvailable: string;
  recentBaselineNoResults: string;

  // 詳細画面
  detailTitle: string;
  detailReturnInstruction: string;

  // 共通
  exit: string;

  // エラーメッセージ
  errorApp: string;
  errorInvalidChoice: string;

  // その他
  search: string;
}

const texts: Record<Language, TextDefinitions> = {
  ja: {
    // メインメニュー
    mainTitle: "=== Baseline Search ===",
    mainSubtitle: "Baseline情報の一覧・検索ツール",
    mainMenuQuestion: "どの機能を利用しますか?",
    mainMenuFreeSearch: "フリーワード検索（ページネーション+フリーワード）",
    mainMenuBaselineTarget: "Baseline Target（年別一覧）",
    mainMenuRecentBaseline: "最近のBaseline更新（過去28日間）",
    mainMenuExit: "Exit (終了)",
    mainMenuNavigation: "↑↓: 選択移動 | Enter: 決定 | 1-4: 直接選択 | ESC/q: 終了",

    // 検索画面
    searchTitle: "=== フリーワード検索+ページネーション ===",
    searchKeyword: "検索キーワード: ",
    searchResults: "{0}件の機能が見つかりました",
    searchNoResults: "機能が見つかりませんでした",
    searchPageInfo: "ページ: {0}/{1} | 表示中: {2}-{3}",
    searchInstructions: "↑↓: 選択 | ←→: ページ | /またはs: 検索 | Enter: 決定 | ESC/q: 終了",
    searchInstructionsSearch: "検索中: ↑↓で選択 | ←→でページ | Enter: 決定 | ESC: 検索終了",
    searchInstructionsNoPage: "数字キー (1-{0}) でページジャンプ",
    searchTryOtherKeywords: "別のキーワードを試すか、Ctrl+Cで検索をクリアしてください",
    searchClearHint: " (Ctrl+C: クリア)",

    // Baseline Target画面
    baselineYearSelection: "=== Baseline Target 年選択 ===",
    baselineFeatureList: "=== {0}年 Baseline Target 機能一覧 ===",
    baselineYearNavigationInstructions: "↑↓: 選択 | Enter: 決定 | ESC: 戻る",
    baselineFeatureNavigationInstructions: "↑↓: 選択 | Enter: 詳細表示 | ESC: 年選択に戻る",
    baselineAvailableYears: "利用可能な年 (↑↓で選択、Enterで決定): {0}/{1}",
    baselineYearCount: "{0}件",
    baselineScrollInstructions: "↑↓キーでスクロール (表示中: {0}-{1})",
    baselineFeatureCount: "機能一覧 (↑↓で選択、Enterで詳細表示): {0}/{1}",

    // Recent Baseline画面
    recentBaselineTitle: "=== 最近のBaseline更新 (過去28日間) ===",
    recentBaselineNavigationInstructions: "↑↓: 選択 | Enter: 詳細表示 | ESC: 戻る",
    recentWidelyAvailable: "最近Widely Availableになった機能",
    recentNewlyAvailable: "最近Newly Availableになった機能",
    recentBaselineNoResults: "過去28日間に更新された機能はありません",

    // 詳細画面
    detailTitle: "=== {0} 詳細情報 ===",
    detailReturnInstruction: "EnterまたはESCで戻る",

    // 共通
    exit: "終了します。",
    // エラーメッセージ
    errorApp: "アプリケーションでエラーが発生しました:",
    errorInvalidChoice: "無効な選択です。1-3を選んでください。",

    // その他
    search: "検索"
  },

  en: {
    // メインメニュー
    mainTitle: "=== Baseline Search ===",
    mainSubtitle: "Baseline Information Search & Browse Tool",
    mainMenuQuestion: "Which feature would you like to use?",
    mainMenuFreeSearch: "Free Text Search (Pagination + Free Word)",
    mainMenuBaselineTarget: "Baseline Target (By Year)",
    mainMenuRecentBaseline: "Recent Baseline Updates (Last 28 Days)",
    mainMenuExit: "Exit",
    mainMenuNavigation: "↑↓: Navigate | Enter: Select | 1-4: Direct | ESC/q: Exit",

    // 検索画面
    searchTitle: "=== Free Text Search + Pagination ===",
    searchKeyword: "Search keyword: ",
    searchResults: "{0} features found",
    searchNoResults: "No features found",
    searchPageInfo: "Page: {0}/{1} | Showing: {2}-{3}",
    searchInstructions: "↑↓: Select | ←→: Page | / or s: Search | Enter: Confirm | ESC/q: Exit",
    searchInstructionsSearch: "Searching: ↑↓ to select | ←→ for page | Enter: confirm | ESC: end search",
    searchInstructionsNoPage: "Number keys (1-{0}) for page jump",
    searchTryOtherKeywords: "Try other keywords or Ctrl+C to clear search",
    searchClearHint: " (Ctrl+C: Clear)",

    // Baseline Target画面
    baselineYearSelection: "=== Baseline Target Year Selection ===",
    baselineFeatureList: "=== {0} Baseline Target Features ===",
    baselineYearNavigationInstructions: "↑↓: Navigate | Enter: Select | ESC: Back",
    baselineFeatureNavigationInstructions: "↑↓: Navigate | Enter: Details | ESC: Back to year selection",
    baselineAvailableYears: "Available years (↑↓ to select, Enter to confirm): {0}/{1}",
    baselineYearCount: "{0} features",
    baselineScrollInstructions: "↑↓ keys to scroll (showing: {0}-{1})",
    baselineFeatureCount: "Feature list (↑↓ to select, Enter for details): {0}/{1}",

    // Recent Baseline画面
    recentBaselineTitle: "=== Recent Baseline Updates (Last 28 Days) ===",
    recentBaselineNavigationInstructions: "↑↓: Navigate | Enter: Details | ESC: Back",
    recentWidelyAvailable: "Recently Widely Available Features",
    recentNewlyAvailable: "Recently Newly Available Features",
    recentBaselineNoResults: "No features updated in the last 28 days",

    // 詳細画面
    detailTitle: "=== {0} Feature Details ===",
    detailReturnInstruction: "Press Enter or ESC to return",

    // 共通
    exit: "Exiting.",
    // エラーメッセージ
    errorApp: "Application error occurred:",
    errorInvalidChoice: "Invalid choice. Please select 1-3.",

    // その他
    search: "search"
  }
};

export function t(key: keyof TextDefinitions, ...args: (string | number)[]): string {
  const lang = getLanguage();
  let text = texts[lang][key];
  
  // プレースホルダーの置換 ({0}, {1}, etc.)
  args.forEach((arg, index) => {
    text = text.replace(`{${index}}`, String(arg));
  });
  
  return text;
}

export function getCurrentTexts(): TextDefinitions {
  return texts[getLanguage()];
}