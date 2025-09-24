import * as readline from "readline";
import { features } from "web-features";
import { showFeatureDetail } from "./show-feature-detail.js";

type FeatureWithKey = any & { key: string };

export function showSearchFeatures(rl: readline.Interface, callback: () => void) {
  console.log("=== フリーワードで検索する ===\n");
  console.log("機能名やキーワードを入力してください");
  console.log("空の状態でEnterキーを押すと検索を開始します\n");
  
  rl.question("検索キーワード: ", (searchTerm) => {
    const keyword = searchTerm.trim();
    
    if (keyword === "") {
      console.log("検索キーワードが入力されていません。\n");
      showSearchFeatures(rl, callback);
      return;
    }
    
    console.clear();
    performSearch(keyword, rl, callback);
  });
}

function performSearch(keyword: string, rl: readline.Interface, callback: () => void) {
  console.log(`=== 検索結果: "${keyword}" ===\n`);
  
  // 検索対象データを準備
  const allFeatures: FeatureWithKey[] = Object.entries(features).map(([key, feature]) => ({
    key,
    ...feature
  }));
  
  // 部分一致検索を実行
  const searchResults = searchFeatures(allFeatures, keyword);
  
  if (searchResults.length === 0) {
    console.log("検索結果が見つかりませんでした。\n");
    console.log("別のキーワードで検索しますか？");
    console.log("1. 再検索する");
    console.log("2. 戻る\n");
    
    rl.question("選択してください (1-2): ", (choice) => {
      switch (choice.trim()) {
        case "1":
          console.clear();
          showSearchFeatures(rl, callback);
          break;
        case "2":
          callback();
          break;
        default:
          console.log("無効な選択です。");
          performSearch(keyword, rl, callback);
      }
    });
    return;
  }
  
  displaySearchResults(searchResults, keyword, rl, callback);
}

function searchFeatures(allFeatures: FeatureWithKey[], keyword: string): FeatureWithKey[] {
  const lowerKeyword = keyword.toLowerCase();
  
  return allFeatures.filter(feature => {
    // キーでの検索
    if (feature.key.toLowerCase().includes(lowerKeyword)) {
      return true;
    }
    
    // 通常機能の場合は名前と説明でも検索
    if (feature.kind === 'feature') {
      if (feature.name && feature.name.toLowerCase().includes(lowerKeyword)) {
        return true;
      }
      if (feature.description && feature.description.toLowerCase().includes(lowerKeyword)) {
        return true;
      }
    }
    
    return false;
  });
}

function displaySearchResults(results: FeatureWithKey[], keyword: string, rl: readline.Interface, callback: () => void) {
  console.log(`${results.length}件の結果が見つかりました\n`);
  
  showSearchResultsPage(results, 0, keyword, rl, callback);
}

function showSearchResultsPage(
  results: FeatureWithKey[], 
  startIndex: number, 
  keyword: string, 
  rl: readline.Interface, 
  callback: () => void
) {
  const pageSize = 10;
  const endIndex = Math.min(startIndex + pageSize, results.length);
  const currentPage = Math.floor(startIndex / pageSize) + 1;
  const totalPages = Math.ceil(results.length / pageSize);
  
  console.log(`=== 検索結果 "${keyword}" (${currentPage}/${totalPages}ページ) ===\n`);
  
  const pageResults = results.slice(startIndex, endIndex);
  pageResults.forEach((feature, index) => {
    const displayIndex = index + 1;
    if (feature.kind === 'feature') {
      console.log(`${displayIndex}. ${feature.key} - ${feature.name || 'No name'}`);
    } else {
      console.log(`${displayIndex}. ${feature.key} (${feature.kind})`);
    }
  });
  
  console.log(`${pageResults.length + 1}. 再検索する`);
  console.log(`${pageResults.length + 2}. 戻る\n`);
  
  if (endIndex < results.length) {
    console.log("Enterで次のページ、数字で機能選択: ");
  } else {
    console.log("最後のページです。数字で機能選択: ");
  }
  
  rl.question("選択してください: ", (choice) => {
    const input = choice.trim();
    
    // 次のページ（Enterキー）
    if (input === '' && endIndex < results.length) {
      console.clear();
      showSearchResultsPage(results, endIndex, keyword, rl, callback);
      return;
    }
    
    const choiceNum = parseInt(input);
    
    // 機能選択
    if (choiceNum >= 1 && choiceNum <= pageResults.length) {
      const selectedFeature = pageResults[choiceNum - 1];
      showFeatureDetail(selectedFeature.key, selectedFeature, rl, () => {
        console.clear();
        showSearchResultsPage(results, startIndex, keyword, rl, callback);
      });
    }
    // 再検索
    else if (choiceNum === pageResults.length + 1) {
      console.clear();
      showSearchFeatures(rl, callback);
    }
    // 戻る
    else if (choiceNum === pageResults.length + 2) {
      callback();
    }
    else {
      console.log("無効な選択です。\n");
      showSearchResultsPage(results, startIndex, keyword, rl, callback);
    }
  });
}