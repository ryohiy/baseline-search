import * as readline from "readline";

// ink-search-pagination.tsx からの結果型
interface SearchPaginationResult {
  selectedFeature: any | null;
  cancelled: boolean;
}

export async function showInkSearchPaginationFeatures(rl: readline.Interface, callback: () => void) {
  try {
    // readlineインターフェースを一時的に無効化してinkにstdinを譲る
    rl.pause();
    
    // stdinの状態を保存
    const stdinWasRaw = process.stdin.isRaw;
    
    try {
      // raw modeサポートチェック
      let rawModeSupported = false;
      try {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(true);
          process.stdin.setRawMode(false);
          rawModeSupported = true;
        }
      } catch (e) {
        // Raw modeテスト失敗
      }
      
      if (!rawModeSupported) {
        // readlineの状態を完全に復元
        rl.resume();
        
        // フォールバック: 通常の検索機能を使用
        setTimeout(() => {
          console.clear();
          console.log("この環境ではink検索+ページネーション機能をご利用いただけません。");
          console.log("通常の検索機能に切り替えます...\n");
          
          import('./search-features.js').then(({ showSearchFeatures }) => {
            setTimeout(() => {
              showSearchFeatures(rl, callback);
            }, 1000);
          });
        }, 100);
        return;
      }
      
      // 動的インポートでink検索+ページネーションを起動
      const { startInkSearchPagination } = await import('./ink-search-pagination.js');
      
      console.clear();
      console.log("ink検索+ページネーションUIを起動中...\n");
      
      // ink検索+ページネーションUIを実行
      const result: SearchPaginationResult = await startInkSearchPagination();
      
      
      // stdinの状態を復元
      if (process.stdin.isTTY && stdinWasRaw !== process.stdin.isRaw) {
        process.stdin.setRawMode(stdinWasRaw || false);
      }
      
      // readlineインターフェースを再有効化
      rl.resume();
      
      console.clear();
      
      if (result.cancelled) {
        // キャンセルされた場合はメニューに戻る
        callback();
        return;
      }
      
      if (result.selectedFeature) {
        // 機能が選択された場合はink版詳細表示を使用
        const { startInkFeatureDetail } = await import('./ink-feature-detail.js');
        
        await startInkFeatureDetail(result.selectedFeature.key, result.selectedFeature);
        
        console.clear();
        
        // 詳細表示後、再度ink検索+ページネーションを起動（少し待つ）
        setTimeout(() => {
          showInkSearchPaginationFeatures(rl, callback);
        }, 200);
      } else {
        // 選択されなかった場合はメニューに戻る
        callback();
      }
      
    } catch (inkError) {
      // stdinの状態を復元
      if (process.stdin.isTTY && stdinWasRaw !== process.stdin.isRaw) {
        try {
          process.stdin.setRawMode(stdinWasRaw || false);
        } catch (e) {
          // stdin復元エラーは無視
        }
      }
      
      // readlineインターフェースを再有効化
      rl.resume();
      
      throw inkError; // 外側のcatchに任せる
    }
    
  } catch (error) {
    console.error('ink検索+ページネーションでエラーが発生しました:', error);
    console.log('\n通常の検索機能をご利用ください。');
    console.log('Enterキーでメニューに戻ります...');
    
    rl.question('', () => {
      callback();
    });
  }
}