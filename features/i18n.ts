import { getLanguage, Language } from './language-config.js';

interface TextDefinitions {
  // メインメニュー
  mainTitle: string;
  mainSubtitle: string;
  mainMenuQuestion: string;
  mainMenuFreeSearch: string;
  mainMenuBaselineTarget: string;
  mainMenuExit: string;
  mainMenuNavigation: string;
  mainMenuDirectSelect: string;

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
  baselineTitle: string;
  baselineNoFeatures: string;
  baselineReturnToMenu: string;
  baselineYearSelection: string;
  baselineFeatureList: string;
  baselineYearNavigationInstructions: string;
  baselineFeatureNavigationInstructions: string;

  // 詳細画面
  detailTitle: string;
  detailReturnPrompt: string;

  // 共通
  exit: string;
  cancel: string;
  loading: string;
  error: string;
  returnToMenu: string;
  pressEnterToContinue: string;

  // エラーメッセージ
  errorApp: string;
  errorInvalidChoice: string;
  errorNoSearchKeyword: string;
  errorInkNotAvailable: string;
  errorSwitchingToNormal: string;

  // その他
  year: string;
  resultsCount: string;
  page: string;
  displaying: string;
  jump: string;
  search: string;
  select: string;
  decision: string;
  navigation: string;
  directJump: string;
}

const texts: Record<Language, TextDefinitions> = {
  ja: {
    // メインメニュー
    mainTitle: "=== WEB FEATURES DOCS CLI ===",
    mainSubtitle: "Web機能データの詳細検索・閲覧ツール",
    mainMenuQuestion: "どの機能を利用しますか?",
    mainMenuFreeSearch: "フリーワード検索（ページネーション+フリーワード）",
    mainMenuBaselineTarget: "Baseline Target（年別一覧）",
    mainMenuExit: "Exit (終了)",
    mainMenuNavigation: "↑↓: 選択移動 | Enter: 決定 | 1-3: 直接選択 | ESC/q: 終了",
    mainMenuDirectSelect: "数字キー (1-{0}) でページジャンプ",

    // 検索画面
    searchTitle: "=== フリーワード検索+ページネーション (ink利用) ===",
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
    baselineTitle: "=== Baseline Target (年別一覧) ===",
    baselineNoFeatures: "この年にはBaseline Target機能がありません",
    baselineReturnToMenu: "メニューに戻ります。",
    baselineYearSelection: "=== Baseline Target 年選択 ===",
    baselineFeatureList: "=== {0}年 Baseline Target 機能一覧 ===",
    baselineYearNavigationInstructions: "↑↓: 選択 | Enter: 決定 | ESC: 戻る",
    baselineFeatureNavigationInstructions: "↑↓: 選択 | Enter: 詳細表示 | ESC: 年選択に戻る",

    // 詳細画面
    detailTitle: "=== {0} 詳細情報 ===",
    detailReturnPrompt: "Enterでメニューに戻る: ",

    // 共通
    exit: "終了します。",
    cancel: "キャンセル",
    loading: "読み込み中...",
    error: "エラー",
    returnToMenu: "メニューに戻る",
    pressEnterToContinue: "Enterキーで続行...",

    // エラーメッセージ
    errorApp: "アプリケーションでエラーが発生しました:",
    errorInvalidChoice: "無効な選択です。1-3を選んでください。",
    errorNoSearchKeyword: "検索キーワードが入力されていません。",
    errorInkNotAvailable: "この環境ではink検索+ページネーション機能をご利用いただけません。",
    errorSwitchingToNormal: "通常の検索機能に切り替えます...",

    // その他
    year: "年",
    resultsCount: "件",
    page: "ページ",
    displaying: "表示中",
    jump: "ジャンプ",
    search: "検索",
    select: "選択",
    decision: "決定",
    navigation: "移動",
    directJump: "直接選択"
  },

  en: {
    // メインメニュー
    mainTitle: "=== WEB FEATURES DOCS CLI ===",
    mainSubtitle: "Web Features Data Search & Browse Tool",
    mainMenuQuestion: "Which feature would you like to use?",
    mainMenuFreeSearch: "Free Text Search (Pagination + Free Word)",
    mainMenuBaselineTarget: "Baseline Target (By Year)",
    mainMenuExit: "Exit",
    mainMenuNavigation: "↑↓: Navigate | Enter: Select | 1-3: Direct | ESC/q: Exit",
    mainMenuDirectSelect: "Number keys (1-{0}) for page jump",

    // 検索画面
    searchTitle: "=== Free Text Search + Pagination (using ink) ===",
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
    baselineTitle: "=== Baseline Target (By Year) ===",
    baselineNoFeatures: "No Baseline Target features in this year",
    baselineReturnToMenu: "Returning to menu.",
    baselineYearSelection: "=== Baseline Target Year Selection ===",
    baselineFeatureList: "=== {0} Baseline Target Features ===",
    baselineYearNavigationInstructions: "↑↓: Navigate | Enter: Select | ESC: Back",
    baselineFeatureNavigationInstructions: "↑↓: Navigate | Enter: Details | ESC: Back to year selection",

    // 詳細画面
    detailTitle: "=== {0} Details ===",
    detailReturnPrompt: "Press Enter to return to menu: ",

    // 共通
    exit: "Exiting.",
    cancel: "Cancel",
    loading: "Loading...",
    error: "Error",
    returnToMenu: "Return to menu",
    pressEnterToContinue: "Press Enter to continue...",

    // エラーメッセージ
    errorApp: "Application error occurred:",
    errorInvalidChoice: "Invalid choice. Please select 1-3.",
    errorNoSearchKeyword: "No search keyword entered.",
    errorInkNotAvailable: "Ink search+pagination feature is not available in this environment.",
    errorSwitchingToNormal: "Switching to normal search function...",

    // その他
    year: "year",
    resultsCount: "results",
    page: "page",
    displaying: "showing",
    jump: "jump",
    search: "search",
    select: "select",
    decision: "confirm",
    navigation: "navigate",
    directJump: "direct"
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