#!/usr/bin/env node

import { showInkMainMenu } from "./features/ink-main-menu.js";

// 基本的なプロセス終了ハンドリング
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

async function executeChoice(choice: number) {
  console.clear();
  
  switch (choice) {
    case 1:
      console.log("=== フリーワード検索（ページネーション+フリーワード） ===\n");
      const { startInkSearchPagination } = await import('./features/ink-search-pagination.js');
      
      while (true) {
        const searchResult = await startInkSearchPagination();
        
        if (searchResult.cancelled) {
          // キャンセルされた場合はメニューに戻る
          break;
        }
        
        if (searchResult.selectedFeature) {
          // 機能が選択された場合は詳細表示
          const { startInkFeatureDetail } = await import('./features/ink-feature-detail.js');
          await startInkFeatureDetail(searchResult.selectedFeature.key, searchResult.selectedFeature);
          console.clear();
          // 詳細表示後は検索画面に戻る
          continue;
        } else {
          // 選択されなかった場合はメニューに戻る
          break;
        }
      }
      break;
      
    case 2:
      console.log("=== Baseline Target（年別一覧） ===\n");
      const { startInkBaselineTarget } = await import('./features/ink-baseline-target.js');
      
      while (true) {
        const baselineResult = await startInkBaselineTarget();
        
        if (baselineResult.cancelled) {
          // キャンセルされた場合はメニューに戻る
          break;
        }
        
        if (baselineResult.selectedFeature) {
          // 機能が選択された場合は詳細表示
          const { startInkFeatureDetail } = await import('./features/ink-feature-detail.js');
          await startInkFeatureDetail(baselineResult.selectedFeature.key, baselineResult.selectedFeature);
          console.clear();
          // 詳細表示後はベースライン画面に戻る
          continue;
        } else {
          // 選択されなかった場合はメニューに戻る
          break;
        }
      }
      break;
      
    case 3:
      console.log("終了します。");
      process.exit(0);
      
    default:
      console.log("無効な選択です。1-3を選んでください。");
      break;
  }
}

async function startCLI() {
  while (true) {
    console.clear();
    const result = await showInkMainMenu();
    
    if (result.cancelled) {
      console.log("終了します。");
      process.exit(0);
    }
    
    if (result.choice) {
      await executeChoice(result.choice);
    }
  }
}

startCLI().catch(error => {
  console.error('アプリケーションでエラーが発生しました:', error);
  process.exit(1);
});